import {delayAsync} from '../helpers/asyncHelpers';
import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {createSelectorForChirp} from '../helpers/tweetdeckHelpers';
import {onChirpAdded} from '../services/chirpHandler';
import {makeBTDModule} from '../types/btdCommonTypes';

export const renderMediaAndQuotedTweets = makeBTDModule(({TD, jq}) => {
  const OGPluck = TD.util.pluck;
  TD.util.pluck = (methodName) => {
    return (a) => {
      if (methodName === 'canSend') {
        // Allow quoted tweet with media (this is called before sending the tweet)
        if (a.hasQuotedTweet === true && a.canSend === false && a.hasMediaAttached === true) {
          return true;
        }
      }
      return OGPluck(methodName)(a);
    };
  };

  // We listen to composer events and remove the `is-disabled` class on the send button*
  // * Note that the button is still actually clickable even with that class
  jq(document).on(
    'uiFilesAdded uiComposeTweet uiComposeImageAdded uiComposeFilesAdded',
    async () => {
      // Wait a bit for the DOM to be up-to-date with the quoted tweet and everything
      await delayAsync(0);
      // Grab the composer
      const composer = document.querySelector('div[data-drawer="compose"]');

      if (!composer) {
        return;
      }

      // Grab the send button
      const sendButton = composer.querySelector<HTMLButtonElement>('button.js-send-button');

      if (!sendButton) {
        return;
      }

      // Do we have media and a quoted tweet?
      const hasMedia = Boolean(composer.querySelector('.js-media-added > *'));
      const hasQuotedTweet = Boolean(composer.querySelector('.js-quote-tweet-holder > *'));

      // Do we have media, a quoted tweet AND is the send button disabled? If so, re-enable it.
      if (hasMedia && hasQuotedTweet && sendButton.classList.contains('is-disabled')) {
        sendButton.classList.remove('is-disabled');
      }
    }
  );

  onChirpAdded((addedChirp) => {
    if (addedChirp.chirp.quotedTweet && addedChirp.chirp.entities.media.length > 0) {
      const quotedTweetHasGif = addedChirp.chirp.quotedTweet.entities.media.find(
        (e) => e.type === 'animated_gif'
      );

      // We bail-out if the quoted tweet has a gif because TweetDeck messes up the rendering in that case..
      if (quotedTweetHasGif) {
        return;
      }

      const quotedTweetMarkup = addedChirp.chirp.quotedTweet.renderQuotedTweet({
        mediaPreviewSize: addedChirp.columnMediaSize,
      });

      const chirpNode = document.querySelector(
        `${createSelectorForChirp(addedChirp.chirp, addedChirp.columnKey)}`
      );

      if (!chirpNode) {
        return;
      }

      if (chirpNode.querySelector('.quoted-tweet')) {
        return;
      }

      chirpNode.querySelector('.tweet-body')?.insertAdjacentHTML('beforeend', quotedTweetMarkup);
    }
  });
  modifyMustacheTemplate(TD, 'status/tweet_single.mustache', (string) => {
    return string.replace(
      `<div class="js-card-container"></div>  {{#quotedTweet}}`,
      `<div class="js-card-container"></div> {{>status/tweet_media_wrapper}} {{#quotedTweet}}`
    );
  });

  modifyMustacheTemplate(TD, 'status/tweet_detail.mustache', (string) => {
    return string.replace('{{^hasMedia}}', '').replace('{{/hasMedia}}', '');
  });
});
