import {fold, isRight} from 'fp-ts/lib/Either';
import {pipe} from 'fp-ts/lib/function';
import * as t from 'io-ts';
import reporter from 'io-ts-reporters';
import _ from 'lodash';

import {ExtensionSettings} from '../helpers/webExtensionHelpers';
import {BTDSettings, RBetterTweetDeckSettings} from '../types/btdSettingsTypes';

const defaultSettings = pipe(
  RBetterTweetDeckSettings.decode({}),
  fold(() => '', _.identity)
);

export function validateSettings(src: any) {
  const decoded = t.exact(RBetterTweetDeckSettings).decode(src);

  if (!isRight(decoded)) {
    const errors: string[] = [];
    reporter.report(decoded).forEach((error) => {
      errors.push(error);
    });
    throw new Error(errors.join('\n'));
  }

  return decoded.right;
}

/** Returns the currently saved settings, validated against the schema. */
export async function getValidatedSettings(): Promise<BTDSettings> {
  const currentSettings = await ExtensionSettings.get();
  const settingsWithDefault = RBetterTweetDeckSettings.decode(currentSettings);

  if (!isRight(settingsWithDefault)) {
    console.log(reporter.report(settingsWithDefault));
    // @ts-ignore
    return defaultSettings;
  }

  return settingsWithDefault.right;
}

/** Retrieves and apply extension settings. */
export async function setupSettingsInBackground() {
  const settings = await getValidatedSettings();
  console.log({settings});

  await ExtensionSettings.set(settings);
}
