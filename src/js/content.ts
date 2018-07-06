import {getExtensionUrl, settings as extensionSettings} from './util/browserHelpers';
import {
  BTDMessageOriginsEnum,
  BTDMessageTypesEnums,
  msgToInject,
  onBTDMessage
} from './util/messaging';

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

onBTDMessage(BTDMessageOriginsEnum.INJECT, (ev) => {
  // console.log('onBTDMessage', ev.data);
  switch (ev.data.type) {
    case BTDMessageTypesEnums.CHIRP_URLS:
      msgToInject({
        hash: ev.data.hash,
        type: BTDMessageTypesEnums.DEBUG,
        payload: ev.data.payload
      });
      break;

    default:
      break;
  }
});
