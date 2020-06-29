import './addAccentColors.css';
import './lightsOut.css';

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
  // @ts-ignore
  document.body.style = `--btd-accent-color: ${BetterTweetDeckAccentColors.DEFAULT}`;
});
