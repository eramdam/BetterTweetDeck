import {isRight} from 'fp-ts/lib/Either';
import {PathReporter} from 'io-ts/lib/PathReporter';

import {ExtensionSettings} from '../helpers/webExtensionHelpers';
import {BTDSettings, RBetterTweetDeckSettings} from '../types/betterTweetDeck/btdSettingsTypes';

// @ts-ignore
const defaultSettings = RBetterTweetDeckSettings.decode({}) as BTDSettings;

/** Returns the currently saved settings, validated against the schema. */
export async function getValidatedSettings(): Promise<BTDSettings> {
  const currentSettings = await ExtensionSettings.get();
  const settingsWithDefault = RBetterTweetDeckSettings.decode(currentSettings);

  if (!isRight(settingsWithDefault)) {
    console.error('Had to use default settings');
    console.log(PathReporter.report(settingsWithDefault));
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
