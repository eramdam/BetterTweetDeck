import './changeTweetActions.css';

import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';

export enum BTDTweetActionsPosition {
  LEFT = 'left',
  RIGHT = 'right',
}

export function changeTweetActionsStyling(settings: BTDSettings) {
  document.body.setAttribute('btd-tweet-actions-position', settings.tweetActionsPosition);
  document.body.setAttribute(
    'btd-show-tweet-actions-on-hover',
    String(settings.showTweetActionsOnHover)
  );
}
