import './addAccentColors.css';
import './lightsOut.css';

export enum BetterTweetDeckAccentColors {
  DEFAULT = 'rgb(29, 161, 242)',
  YELLOW = 'rgb(255, 173, 31)',
  RED = 'rgb(224, 36, 94)',
  PINK = 'rgb(224, 36, 142)',
  PURPLE = 'rgb(121, 75, 196)',
  ORANGE = 'rgb(244, 93, 34)',
  GREEN = 'rgb(23, 191, 99)',
}

export enum BetterTweetDeckDarkThemes {
  DEFAULT = 'default',
  LEGACY = 'legacy',
  ULTRA_DARK = 'ultra_dark',
}

import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export const tweakTweetDeckTheme = makeBTDModule(({settings}) => {
  console.log({accent: settings.customAccentColor});
  // @ts-ignore
  document.body.style = `--btd-accent-color: ${settings.customAccentColor}`;

  if (settings.customDarkTheme === BetterTweetDeckDarkThemes.LEGACY) {
    document.body.setAttribute('btd-old-grey', 'true');
  } else if (settings.customDarkTheme === BetterTweetDeckDarkThemes.ULTRA_DARK) {
    document.body.setAttribute('btd-super-dark', 'true');
  }
});
