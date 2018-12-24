import {BTDSettings, getExtensionUrl} from '../helpers/browserHelpers';

/** Injects (part of) our code to TD's main frame. */
export async function injectScriptToMainFrame() {
  /** Bail out if the script has already been inserted in the page. */
  if (document.querySelector('[data-btd-settings]')) {
    return;
  }

  /**
   * Grab the settings from the browser.
   */
  const settings = await BTDSettings.get();

  const toInject = document.createElement('script');
  toInject.src = getExtensionUrl('js/inject.js');
  toInject.setAttribute('data-btd-settings', JSON.stringify(settings));
  document.head.appendChild(toInject);
}
