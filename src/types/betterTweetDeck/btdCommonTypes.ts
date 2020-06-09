import {TweetDeckObject} from '../tweetdeckTypes';
import {BTDSettings} from './btdSettingsTypes';

type BTDModuleOptions = {
  settings: BTDSettings;
} & {
  TD: TweetDeckObject;
} & {
  $: JQueryStatic;
};
type UniversalBTDModule = (opts: BTDModuleOptions) => void;
type PartialUniversalBTDModule = (opts: Partial<BTDModuleOptions>) => void;
function validateBTDModuleArguments(opts: Partial<BTDModuleOptions>): opts is BTDModuleOptions {
  if (Object.keys(opts).length > 0) {
    return true;
  }

  throw new Error('missing arguments for BTD module');
}

export function makeBTDModule(module: UniversalBTDModule): PartialUniversalBTDModule {
  return (opts) => {
    if (!validateBTDModuleArguments(opts)) {
      return;
    }

    module(opts);
  };
}

export const BTDSettingsAttribute = 'data-btd-settings';
export const BTDUuidAttribute = 'data-btd-uuid';
export const BTDModalUuidAttribute = 'data-btd-modal-uuid';

export const getFullscreenNodeRoot = () => document.getElementById('btd-fullscreen-portal-root');
export const getFullscreenNode = () => document.getElementById('btd-fullscreen-portal-target');

const UuidSelectors = [BTDUuidAttribute, BTDModalUuidAttribute] as const;

export function makeBtdUuidSelector(
  uuidSelectors: typeof UuidSelectors[number],
  uuid: string,
  suffix = ''
) {
  return `[${uuidSelectors}="${uuid}"] ${suffix}`.trim();
}
