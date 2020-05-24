import {injectInTD} from './services/injectInTD';
import {setupReactRoot} from './services/setupBTDRoot';

(async () => {
  // Setup the React components.
  await setupReactRoot();
  // Add our own class to the body.
  document.body.classList.add('btd-loaded');
  // Inject some scripts
  await injectInTD();
})();
