import {getExtensionUrl, settings as extensionSettings} from './util/browserHelpers';

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

window.addEventListener('message', (ev) => {
  if (ev.origin !== 'https://tweetdeck.twitter.com' || ev.data.origin !== 'BTD_INJECT') {
    return;
  }

  switch (ev.data.msg) {
    case 'CHIRP_REQUEST':
      window.postMessage(
        Object.assign(ev.data, {
          msg: 'Hello from content',
          origin: 'BTD_CONTENT',
        }),
        'https://tweetdeck.twitter.com',
      );
      break;

    default:
      break;
  }
});
