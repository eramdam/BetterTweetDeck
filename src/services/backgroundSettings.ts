import {ExtensionSettings} from '../helpers/webExtensionHelpers';

export async function setupSettingsInBackground() {
  const currentSettings = await ExtensionSettings.get();

  console.log({currentSettings});
}
