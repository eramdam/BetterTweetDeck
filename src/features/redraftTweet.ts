import {sendInternalBTDMessage} from '../helpers/communicationHelpers';
import {
  getChirpFromElement,
  getChirpFromKeyAlone,
  getMediaFromChirp,
} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';
import {BTDMessageOriginsEnum, BTDMessages} from '../types/btdMessageTypes';
import {TweetDeckChirp, TweetDeckUser} from '../types/tweetdeckTypes';

export const listenToRedraftTweetEvent = makeBTDModule(({TD, jq}) => {
  jq('body').on('click', '[data-btd-action="edit-tweet"]', async (ev) => {
    ev.preventDefault();
    const chirpObject = getChirpFromElement(TD, ev.target);
    if (!chirpObject) {
      return;
    }

    const {chirp, extra} = chirpObject;

    const media = getMediaFromChirp(chirp);

    type ComposeData = {
      type: string;
      text: string;
      from: string[];
      conversationId?: string | number;
      quotedTweet?: TweetDeckChirp;
      mentions?: TweetDeckUser[];
      element?: HTMLElement;
      inReplyTo?: {
        id: string;
        htmlText: string;
        user: {
          screenName: string;
          name: string;
          profileImageURL: string;
        };
      };
    };

    const composeData: ComposeData = {
      type: extra.chirpType || '',
      text: TD.util.removeHTMLCodes(chirp.text),
      from: [TD.storage.Account.generateKeyFor('twitter', chirp.creatorAccount!.getUserID())],
    };

    // @TODO: this doesn't work in DMs yet because DMs use attachments sometimes, i don't understand
    // @TODO: in what circumstances do we use MESSAGE_THREAD? regular MESSAGE has conversationId
    // @TODO: in what circumstances do we use messageRecipients? no chirps have them.

    if (extra.chirpType === TD.services.ChirpBase.MESSAGE) {
      composeData.conversationId = chirp.conversationId;
    }

    // == get the original text back
    // if we have media, remove the link from the text
    if (chirp.entities.media.length) {
      const firstMedia = chirp.entities.media[0];
      composeData.text = loudencer(composeData.text, ...firstMedia.indices);
    }

    // remove usernames from tweet
    chirp.entities.user_mentions.forEach((mention) => {
      if (mention.isImplicitMention) {
        composeData.text = loudencer(composeData.text, ...mention.indices);
      }
    });

    // replace quotes in a tweet
    chirp.entities.urls.forEach((url) => {
      if (
        chirp.isQuoteStatus &&
        !chirp.quotedTweetMissing &&
        url.expanded_url === chirp.quotedTweet?.getChirpURL()
      ) {
        composeData.text = loudencer(composeData.text, ...url.indices);
        composeData.quotedTweet = chirp.quotedTweet;
      }
    });

    // make the chirp quieter
    // eslint-disable-next-line no-control-regex
    composeData.text = composeData.text.replace(/\u0007/gi, '');

    // expand original urls for tweets
    chirp.entities.urls.forEach((url) => {
      composeData.text = composeData.text.replace(url.url, url.expanded_url);
    });

    // ensure no html entities remain
    composeData.text = unescape(composeData.text);

    // trim in case we picked up any whitespace
    composeData.text = composeData.text.trim();

    // compose in advance because the reply composer doesn't transfer text for reasons unknown
    jq(document).trigger('uiComposeTweet', composeData);

    // == handle replies
    if (chirp.inReplyToID) {
      const mainChirp = chirp.getMainTweet();
      composeData.type = 'reply';
      composeData.mentions = chirp.getReplyingToUsers();
      composeData.inReplyTo = {
        id: String(chirp.inReplyToID),
        htmlText: mainChirp.htmlText,
        user: {
          screenName: mainChirp.user.screenName,
          name: mainChirp.user.name,
          profileImageURL: mainChirp.user.profileImageURL,
        },
      };

      // == find that user, if at all possible
      const replyChirp = getChirpFromKeyAlone(TD, String(chirp.inReplyToID))?.chirp;
      if (replyChirp) {
        composeData.mentions = replyChirp.getReplyUsers();
        composeData.inReplyTo = {
          id: replyChirp.id,
          htmlText: replyChirp.htmlText,
          user: {
            screenName: replyChirp.user.screenName,
            name: replyChirp.user.name,
            profileImageURL: replyChirp.user.profileImageURL,
          },
        };
      } else {
        console.log('reply did not have an existing chirp in its original column');
      }

      // now that the reply information is filled, we have to push this compose on top of the one with text
      jq(document).trigger('uiComposeTweet', composeData);
    }

    // == re-upload all the files we had, if any
    if (media.length) {
      const files = await Promise.all(media.map((item) => requestMediaItem(item.url)));
      jq(document).trigger('uiComposeFilesAdded', {files: files});
      media.forEach((item, index) => {
        // @ts-expect-error
        jq._data(document, 'events')[
          'uiComposeVideoTooLarge'
        ][0].handler.context.onDescriptionAdded(index, {imageDescription: item.description});
      });

      jq(document).one('uiComposeImageAdded', (e) => {
        // it is now safe to remove the tweet
        chirp.destroy();
      });
    } else {
      // send one last compose event, for good luck
      jq(document).trigger('uiComposeTweet', composeData);
      // it is now safe to remove the tweet
      chirp.destroy();
    }
  });
});

// control characters can't appear in tweets, so we can use them to pad strings out
// source: https://shkspr.mobi/blog/2015/11/twitters-weird-control-character-handling/
const loudencer = (str: string, start: number, end: number) => {
  return str.slice(0, start) + '\x07'.repeat(str.slice(start, end).length) + str.slice(end);
};

const getMediaUrlParts = (url: string) => {
  const extension = url
    .replace(/:[a-z]+$/, '')
    .split('.')
    .pop();

  let type: string | undefined = undefined;

  if (extension?.toLowerCase() === 'mp4') {
    type = 'video/mp4';
  } else if (extension?.toLowerCase() === 'gif') {
    type = 'image/gif';
  } else if (extension?.toLowerCase() === 'jpg') {
    type = 'image/jpg';
  } else if (extension?.toLowerCase() === 'png') {
    type = 'image/png';
  }

  return {
    originalExtension: extension,
    type,
    originalFile: url.split('/').pop()!.split('.')[0],
  };
};

export async function requestMediaItem(mediaUrl: string): Promise<File | undefined> {
  const res = await sendInternalBTDMessage({
    isReponse: false,
    name: BTDMessages.DOWNLOAD_MEDIA,
    origin: BTDMessageOriginsEnum.INJECT,
    payload: mediaUrl,
  });
  if (res.name !== BTDMessages.DOWNLOAD_MEDIA_RESULT) {
    return undefined;
  }

  const parts = getMediaUrlParts(mediaUrl);

  return new File([res.payload.blob], `${parts.originalFile}.${parts.originalExtension}`, {
    type: parts.type,
  });
}
