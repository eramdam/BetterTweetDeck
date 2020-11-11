import {TweetDeckObject} from './tweetdeckTypes';

export type TweetDeckTheme = 'light' | 'dark';
export type TweetDeckLinkShortener = 'bitly' | 'twitter';
export interface TweetDeckBitlyAccount {
  apiKey: string;
  login: string;
}
export type TweetDeckColumnWidth = 'wide' | 'medium' | 'narrow';
export type TweetDeckFontSize = 'smallest' | 'small' | 'medium' | 'large' | 'largest';

export interface AbstractTweetDeckSettings {
  theme: TweetDeckTheme;
  linkShortener: TweetDeckLinkShortener;
  bitlyAccount: TweetDeckBitlyAccount;
  columnWidth: TweetDeckColumnWidth;
  fontSize: TweetDeckFontSize;
  autoPlayGifs: boolean;
  showStartupNotifications: boolean;
  displaySensitiveMedia: boolean;
  useStream: boolean;
}

export function makeAbstractTweetDeckSettings(TD: TweetDeckObject): AbstractTweetDeckSettings {
  return {
    theme: TD.settings.getTheme(),
    linkShortener: TD.settings.getLinkShortener(),
    bitlyAccount: TD.settings.getBitlyAccount(),
    columnWidth: TD.settings.getColumnWidth(),
    fontSize: TD.settings.getFontSize(),
    autoPlayGifs: TD.settings.getAutoPlayGifs(),
    showStartupNotifications: TD.settings.getShowStartupNotifications(),
    displaySensitiveMedia: TD.settings.getDisplaySensitiveMedia(),
    useStream: TD.settings.getUseStream(),
  };
}

export function applyAbstractTweetDeckSettings(
  TD: TweetDeckObject,
  settings: AbstractTweetDeckSettings
) {
  TD.settings.setTheme(settings.theme);
  TD.settings.setLinkShortener(settings.linkShortener);
  TD.settings.setBitlyAccount(settings.bitlyAccount);
  TD.settings.setColumnWidth(settings.columnWidth);
  TD.settings.setFontSize(settings.fontSize);
  TD.settings.setAutoPlayGifs(settings.autoPlayGifs);
  TD.settings.setShowStartupNotifications(settings.showStartupNotifications);
  TD.settings.setDisplaySensitiveMedia(settings.displaySensitiveMedia);
  TD.settings.setUseStream(settings.useStream);
}

export const dummyAbstractTweetDeckSettings: AbstractTweetDeckSettings = {
  theme: 'dark',
  linkShortener: 'bitly',
  bitlyAccount: {
    apiKey: '',
    login: '',
  },
  columnWidth: 'medium',
  fontSize: 'medium',
  autoPlayGifs: true,
  showStartupNotifications: false,
  displaySensitiveMedia: true,
  useStream: true,
};
