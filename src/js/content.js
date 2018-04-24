import { getExtensionUrl, settings as extensionSettings } from './util/browserHelpers';

(async () => {
  /**
   * Get the extensions settings from the browser
   */
  const settings = await extensionSettings.get();

  /**
   * Inject our script into the page
   */
  const injected = document.createElement('script');
  injected.src = getExtensionUrl('js/inject.js');
  injected.dataset.btdSettings = JSON.stringify(settings);
  document.head.appendChild(injected);
})();
