import {defaultsDeep} from 'lodash';

import {BTDSettings} from './types';
import {settings} from './util/browserHelpers';

const defaultSettings: BTDSettings = {
  ts: 'absolute_us',
  full_after_24: true,
  no_tco: true,
};

console.log(defaultSettings);

settings.get().then((currSettings) => {
  settings
    .set(defaultsDeep(currSettings, defaultSettings))
    .then(() => settings.get())
    .then((newSettings) => {
      console.log({newSettings});
    });
});
