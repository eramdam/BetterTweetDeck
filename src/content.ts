import {injectInTD} from './services/injectInTD';
import {setupReactRoot} from './services/setupBTDRoot';

(async () => {
  // Add our own class to the body.
  document.body.classList.add('btd-loaded');
  // Inject some scripts
  await injectInTD();
  // Setup the React components.
  setupReactRoot();
})();
