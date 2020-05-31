import './changeTweetActions.css';

import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export enum BTDTweetActionsPosition {
  LEFT = 'left',
  RIGHT = 'right',
}

export const changeTweetActionsStyling = makeBTDModule(({settings}) => {
  document.body.setAttribute('btd-tweet-actions-position', settings.tweetActionsPosition);
  document.body.setAttribute(
    'btd-show-tweet-actions-on-hover',
    String(settings.showTweetActionsOnHover)
  );
});
