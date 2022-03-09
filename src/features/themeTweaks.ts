import './lightsOut.css';

export enum BetterTweetDeckAccentColors {
  DEFAULT = 'rgb(29, 161, 242)',
  YELLOW = 'rgb(255, 173, 31)',
  RED = 'rgb(224, 36, 94)',
  PINK = 'rgb(224, 36, 142)',
  PURPLE = 'rgb(121, 75, 196)',
  ORANGE = 'rgb(244, 93, 34)',
  GREEN = 'rgb(23, 191, 99)',
  CUSTOM = 'CUSTOM',
}

export enum BetterTweetDeckThemes {
  LIGHT = 'light',
  DARK = 'default',
  LEGACY_DARK = 'legacy',
  ULTRA_DARK = 'ultra_dark',
}

import {makeBTDModule} from '../types/btdCommonTypes';

export const tweakTweetDeckTheme = makeBTDModule(({settings}) => {
  if (settings.customAccentColor !== BetterTweetDeckAccentColors.DEFAULT) {
    require('./addAccentColors.css');
    if (settings.customAccentColor === BetterTweetDeckAccentColors.CUSTOM) {
      document.documentElement.style.setProperty(
        '--btd-accent-color',
        settings.customAnyAccentColor
      );
    } else {
      document.documentElement.style.setProperty('--btd-accent-color', settings.customAccentColor);
    }
    document.body.setAttribute('btd-accent-color', 'true');
  }

  if (settings.theme === BetterTweetDeckThemes.LEGACY_DARK) {
    document.body.setAttribute('btd-theme', 'old-grey');
  } else if (settings.theme === BetterTweetDeckThemes.ULTRA_DARK) {
    document.body.setAttribute('btd-theme', 'super-dark');
  } else {
    document.body.setAttribute('btd-theme', '');
  }
});
