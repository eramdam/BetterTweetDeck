import {Skyla} from 'skyla';

import {BTDSettings} from './btdSettingsTypes';

export type BTDModuleOptions = {
  settings: BTDSettings;
  skyla: Skyla;
};
type UniversalBTDModule = (opts: BTDModuleOptions) => void;

export function makeBTDModule(btdModule: UniversalBTDModule) {
  return (opts: BTDModuleOptions) => {
    try {
      btdModule(opts);
    } catch (e) {
      console.error(e);
    }
  };
}

export const BTDSettingsAttribute = 'data-btd-settings';
export const BTDVersionAttribute = 'data-btd-version';
