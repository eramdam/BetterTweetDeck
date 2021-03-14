import {isEmpty} from 'lodash';

import {BetterTweetDeckThemes} from '../features/themeTweaks';
import {makeBTDModule} from './betterTweetDeck/btdCommonTypes';
import {TweetDeckObject, TweetDeckTheme} from './tweetdeckTypes';

export interface AbstractTweetDeckSettings {
  theme: TweetDeckTheme;
}

export const applyTweetDeckSettings = makeBTDModule(({settings, TD, jq}) => {
  jq(document).one('dataSettingsValues', () => {
    if (isEmpty(settings)) {
      return;
    }
    if (settings.theme === BetterTweetDeckThemes.LIGHT) {
      TD.settings.setTheme('light');
    } else {
      TD.settings.setTheme('dark');
    }
  });
});

export function getSettingsFromTweetDeck(TD: TweetDeckObject) {
  return {
    theme: TD.settings.getTheme(),
  };
}

export const dummyAbstractTweetDeckSettings: AbstractTweetDeckSettings = {
  theme: 'dark',
};
