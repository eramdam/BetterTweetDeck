import {injectScriptToMainFrame} from './services/injectToMain';
import {BTDMessageOriginsEnum, BTDMessageTypesEnums, waitForBTDMessage} from './services/messaging';
import {setupRoot} from './services/setupBTDRoot';

(async () => {
  injectScriptToMainFrame();
  setupRoot();

  await waitForBTDMessage(BTDMessageOriginsEnum.INJECT, BTDMessageTypesEnums.READY);
  console.log('Ready!');
})();
