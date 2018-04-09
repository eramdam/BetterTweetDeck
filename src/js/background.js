import { defaultsDeep } from 'lodash';
import { settings } from './util/browserHelpers';

const DEFAULT_SETTINGS = {
  ts: 'absolute_us',
  full_after_24: true,
};

console.log({ DEFAULT_SETTINGS });

settings.get().then((currSettings) => {
  settings.set(defaultsDeep(currSettings, DEFAULT_SETTINGS)).then(() => settings.get()).then((newSettings) => {
    console.log({ newSettings });
  });
});
