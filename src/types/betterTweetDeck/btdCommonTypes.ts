import {TweetDeckObject} from '../tweetdeckTypes';
import {BTDSettings} from './btdSettingsTypes';

export type BTDModuleOptions = {
  settings: BTDSettings;
  TD: TweetDeckObject;
  jq: JQueryStatic;
};
type UniversalBTDModule = (opts: BTDModuleOptions) => void;

export function makeBTDModule(btdModule: UniversalBTDModule): UniversalBTDModule {
  return btdModule;
}

export const BTDSettingsAttribute = 'data-btd-settings';
export const BTDUuidAttribute = 'data-btd-uuid';
export const BTDModalUuidAttribute = 'data-btd-modal-uuid';

export const getFullscreenNodeRoot = () => document.getElementById('btd-fullscreen-portal-root');
export const getFullscreenNode = () => document.getElementById('btd-fullscreen-portal-target');

const UuidSelectors = [BTDUuidAttribute, BTDModalUuidAttribute] as const;

export function makeBtdUuidSelector(
  uuidSelectors: typeof UuidSelectors[number],
  uuid?: string,
  suffix = ''
) {
  if (!uuid) {
    return `[${uuidSelectors}] ${suffix}`.trim();
  }
  return `[${uuidSelectors}="${uuid}"] ${suffix}`.trim();
}
