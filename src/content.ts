import './components/styles/index.css';

import {browser} from 'webextension-polyfill-ts';

import {setupThumbnailInjector} from './features/thumbnails/thumbnailInjector';
import {injectInTD} from './services/injectInTD';
import {setupBtdRoot} from './services/setupBTDRoot';

// Setup root modal.
setupBtdRoot();
// Inject some scripts.
injectInTD();
// Setup thumbnail system.
setupThumbnailInjector();

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

// listenToInternalBTDMessage(BTDMessages.BTD_READY, BTDMessageOriginsEnum.CONTENT, async () => {
// });
