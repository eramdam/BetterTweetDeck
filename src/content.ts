import './components/index.css';

import {browser} from 'webextension-polyfill-ts';

import {setupEmojiPicker} from './features/emojiPicker';
import {setupGifPicker} from './features/gifPicker';
import {setupThumbnailInjector} from './features/thumbnails/thumbnailInjector';
import {listenToInternalBTDMessage} from './helpers/communicationHelpers';
import {injectInTD} from './services/injectInTD';
import {setupBtdRoot} from './services/setupBTDRoot';
import {BTDMessageOriginsEnum, BTDMessages} from './types/betterTweetDeck/btdMessageTypes';

// Setup root modal.
setupBtdRoot();
// Inject some scripts.
injectInTD();
// Setup thumbnail system.
setupThumbnailInjector();

listenToInternalBTDMessage(BTDMessages.BTD_READY, BTDMessageOriginsEnum.CONTENT, async () => {
  setupGifPicker();
  setupEmojiPicker();

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
});
