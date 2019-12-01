import {injectInTD} from './services/injectInTD';
import {setupReactRoot} from './services/setupBTDRoot';

(async () => {
  await injectInTD();
  setupReactRoot();
})();
