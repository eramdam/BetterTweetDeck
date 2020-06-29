import './addAccentColors.css';

export enum BetterTweetDeckAccentColors {
  DEFAULT = '#1da1f2',
  GOLD = '#ffac33',
  RED = '#e0245e',
  PURPLE = '#794bc4',
  ORANGE = '#f45d22',
  AVOCADO = '#17bf63',
  GREY = '',
}

import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export const addAccentColors = makeBTDModule(() => {
  document.body.style.setProperty('--btd-accent-color', BetterTweetDeckAccentColors.DEFAULT);
});
