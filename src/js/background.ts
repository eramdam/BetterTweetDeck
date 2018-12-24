import {defaultsDeep} from 'lodash';

import {ExtensionSettings} from './helpers/browserHelpers';
import {BTDSettings, BTDTimeFormatsEnum} from './types';

const defaultSettings: BTDSettings = {
  ts: BTDTimeFormatsEnum.ABSOLUTE_US,
  full_after_24: true,
  no_tco: true
};

ExtensionSettings.get().then(async (currentSettings) => {
  await ExtensionSettings.set(defaultsDeep(currentSettings, defaultSettings));

  console.log(await ExtensionSettings.get());
});
