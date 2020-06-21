import './components/index.css';

import {browser} from 'webextension-polyfill-ts';

import {setupEmojiAutocompletion} from './features/emojiAutocompletion';
import {setupEmojiPicker} from './features/emojiPicker';
import {setupGifModals} from './features/gifModals';
import {setupGifPicker} from './features/gifPicker';
import {setupThumbnailInjector} from './features/thumbnails/thumbnailInjector';
import {listenToInternalBTDMessage} from './helpers/communicationHelpers';
import {sendMessageToBackground} from './helpers/webExtensionHelpers';
import {getValidatedSettings} from './services/backgroundSettings';
import {injectInTD} from './services/injectInTD';
import {setupBtdRoot} from './services/setupBTDRoot';
import {BTDMessageOriginsEnum, BTDMessages} from './types/betterTweetDeck/btdMessageTypes';

// Setup root modal.
setupBtdRoot();
// Inject some scripts.
injectInTD();
// Setup thumbnail system.
setupThumbnailInjector();
getValidatedSettings().then((settings) => {
  setupGifModals(settings);
});

listenToInternalBTDMessage(BTDMessages.BTD_READY, BTDMessageOriginsEnum.CONTENT, async () => {
  setupGifPicker();
  setupEmojiPicker();
  setupEmojiAutocompletion();

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

listenToInternalBTDMessage(
  BTDMessages.DOWNLOAD_MEDIA,
  BTDMessageOriginsEnum.CONTENT,
  async (ev) => {
    if (ev.data.name !== BTDMessages.DOWNLOAD_MEDIA) {
      return;
    }

    const mediaUrl = ev.data.payload;

    const mediaBlob = await sendMessageToBackground({
      data: {
        requestId: undefined,
        isReponse: false,
        name: BTDMessages.DOWNLOAD_MEDIA,
        origin: BTDMessageOriginsEnum.CONTENT,
        payload: mediaUrl,
      },
    });

    if (!mediaBlob) {
      return;
    }

    return mediaBlob;
  }
);
