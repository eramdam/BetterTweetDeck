import {makeBTDModule} from './btdCommonTypes';
import {TweetDeckObject, TweetDeckTheme} from './tweetdeckTypes';

export interface AbstractTweetDeckSettings {
  theme: TweetDeckTheme;
}

export const applyTweetDeckSettings = makeBTDModule(({settings, TD, jq}) => {});

export function getSettingsFromTweetDeck(TD: TweetDeckObject) {
  return {
    theme: TD.settings.getTheme(),
  };
}

export const dummyAbstractTweetDeckSettings: AbstractTweetDeckSettings = {
  theme: 'dark',
};
