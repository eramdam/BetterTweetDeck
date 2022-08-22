import './changeTweetActions.css';

import {isHTMLElement} from '../helpers/domHelpers';
import {getChirpFromElement} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const changeTweetActionsStyling = makeBTDModule(({settings, jq, TD}) => {
  document.body.setAttribute('btd-tweet-actions-position', settings.tweetActionsPosition);
  document.body.setAttribute(
    'btd-show-tweet-actions-on-hover',
    String(settings.showTweetActionsOnHover)
  );

  if (!settings.showAccountChoiceOnFavorite) {
    return;
  }

  const usernamesAllowlist = settings.accountChoiceAllowList
    .split(',')
    .map((t) => t.trim().replace('@', '').toLowerCase())
    .filter(Boolean);

  jq(document).on('click', '.tweet-footer [rel="favorite"]', (e) => {
    const chirp = getChirpFromElement(TD, e.target);

    if (!chirp || !isHTMLElement(e.target) || !e.target.closest('.stream-item')) {
      return;
    }

    const usefulChirp = chirp.chirp.targetTweet || chirp.chirp;

    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();

    if (
      usernamesAllowlist.includes(usefulChirp.account.state.username.toLowerCase()) ||
      usernamesAllowlist.length === 0
    ) {
      jq(document).trigger('uiShowFavoriteFromOptions', {
        tweet: usefulChirp,
      });
      return;
    }

    usefulChirp.favorite({
      element: jq(e.target.closest('.stream-item')!),
      statusKey: usefulChirp.id,
      column: chirp.extra.columnKey,
    });
  });
});
