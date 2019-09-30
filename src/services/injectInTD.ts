import {ExtensionSettings, getExtensionUrl} from '../helpers/webExtensionHelpers';

export async function injectInTD() {
  // If we're already injected, nothing to do.
  if (document.querySelector('[data-btd-settings]')) {
    return;
  }

  // Get the settings from the browser.
  const settings = await ExtensionSettings.get();

  // Otherwise, inject.
  const toInject = document.createElement('script');
  toInject.src = getExtensionUrl('inject.js');
  toInject.setAttribute('data-btd-settings', JSON.stringify(settings));
  document.head.appendChild(toInject);
}
