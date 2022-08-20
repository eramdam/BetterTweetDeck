import './lightsOut.css';

import {makeBTDModule} from '../types/btdCommonTypes';
import {BetterTweetDeckAccentColors, BetterTweetDeckThemes} from '../types/btdSettingsEnums';

export const tweakTweetDeckTheme = makeBTDModule(({settings}) => {
  if (settings.customAccentColor !== BetterTweetDeckAccentColors.DEFAULT) {
    require('./addAccentColors.css');

    if (settings.customAccentColor === BetterTweetDeckAccentColors.CUSTOM) {
      // Fail-safe against empty custom color
      if (settings.customAnyAccentColor) {
        document.documentElement.style.setProperty(
          '--btd-accent-color',
          settings.customAnyAccentColor
        );
      } else {
        document.documentElement.style.setProperty(
          '--btd-accent-color',
          BetterTweetDeckAccentColors.DEFAULT
        );
      }
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
