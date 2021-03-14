import './changeTweetActions.css';

import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {getChirpFromElement} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export enum BTDTweetActionsPosition {
  LEFT = 'left',
  RIGHT = 'right',
}

export const changeTweetActionsStyling = makeBTDModule(({settings, jq, TD}) => {
  document.body.setAttribute('btd-tweet-actions-position', settings.tweetActionsPosition);
  document.body.setAttribute(
    'btd-show-tweet-actions-on-hover',
    String(settings.showTweetActionsOnHover)
  );

  if (!settings.showAccountChoiceOnFavorite) {
    return;
  }

  modifyMustacheTemplate(TD, 'status/tweet_detail_actions.mustache', (string) => {
    return string.replace('rel="favorite"', 'rel="btd-favoriteOrUnfavorite"');
  });
  modifyMustacheTemplate(TD, 'status/tweet_single_actions.mustache', (string) => {
    return string.replace('rel="favorite"', 'rel="btd-favoriteOrUnfavorite"');
  });

  jq(document).on('click', '.tweet-footer .tweet-action[rel="btd-favoriteOrUnfavorite"]', (e) => {
    const chirp = getChirpFromElement(TD, e.target);

    if (!chirp) {
      return;
    }

    jq(document).trigger('uiShowFavoriteFromOptions', {
      tweet: chirp.chirp,
    });

    e.stopPropagation();
    e.preventDefault();
  });
});
