import {fold, isRight} from 'fp-ts/lib/Either';
import {pipe} from 'fp-ts/lib/function';
import {PathReporter} from 'io-ts/lib/PathReporter';
import _ from 'lodash';

import {ExtensionSettings} from '../helpers/webExtensionHelpers';
import {BTDSettings, RBetterTweetDeckSettings} from '../types/betterTweetDeck/btdSettingsTypes';

const defaultSettings = pipe(
  RBetterTweetDeckSettings.decode({}),
  fold(() => '', _.identity)
);

/** Returns the currently saved settings, validated against the schema. */
export async function getValidatedSettings(): Promise<BTDSettings> {
  const currentSettings = await ExtensionSettings.get();
  const settingsWithDefault = RBetterTweetDeckSettings.decode(currentSettings);

  if (!isRight(settingsWithDefault)) {
    console.log(PathReporter.report(settingsWithDefault));
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
