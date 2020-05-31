import {browser} from 'webextension-polyfill-ts';

import {changeAvatarsShape} from './features/changeAvatarShape';
import {changeScrollbarStyling} from './features/changeScrollbars';
import {changeTweetActionsStyling} from './features/changeTweetActions';
import {maybeMakeComposerButtonsSmaller} from './features/smallerComposerButtons';
import {getValidatedSettings} from './services/backgroundSettings';
import {injectInTD} from './services/injectInTD';
import {setupReactRoot} from './services/setupBTDRoot';

(async () => {
  // Setup the React components.
  await setupReactRoot();
  // Add our own class to the body.
  document.body.classList.add('btd-loaded');
  // Inject some scripts
  await injectInTD();

  // Get the settings from the browser.
  const settings = await getValidatedSettings();
  changeAvatarsShape({settings});
  maybeMakeComposerButtonsSmaller({settings});
  changeTweetActionsStyling({settings});
  changeScrollbarStyling({settings});
})();

browser.runtime.onMessage.addListener((details) => {
  switch (details.action) {
    case 'share': {
      document.dispatchEvent(new CustomEvent('uiComposeTweet'));
      const composer = document.querySelector<HTMLTextAreaElement>('textarea.js-compose-text');

      if (!composer) {
        return;
      }

      composer.value = `${details.text} ${details.url}`;
      composer.dispatchEvent(new Event('change'));
      break;
    }
  }
});
