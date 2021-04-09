import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {createSelectorForChirp} from '../helpers/tweetdeckHelpers';
import {onChirpAdded} from '../services/chirpHandler';
import {makeBTDModule} from '../types/btdCommonTypes';

export const renderMediaAndQuotedTweets = makeBTDModule(({TD, jq}) => {
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
