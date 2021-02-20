import {isEmpty} from 'lodash';

import {BetterTweetDeckThemes} from '../features/themeTweaks';
import {BTDSettings} from './betterTweetDeck/btdSettingsTypes';
import {TweetDeckObject, TweetDeckTheme} from './tweetdeckTypes';

export interface AbstractTweetDeckSettings {
  theme: TweetDeckTheme;
}

export function applyTweetDeckSettings(TD: TweetDeckObject, settings: BTDSettings) {
  if (isEmpty(settings)) {
    return;
  }
  if (settings.theme === BetterTweetDeckThemes.LIGHT) {
    TD.settings.setTheme('light');
  } else {
    TD.settings.setTheme('dark');
  }
}

export const dummyAbstractTweetDeckSettings: AbstractTweetDeckSettings = {
  theme: 'dark',
};
