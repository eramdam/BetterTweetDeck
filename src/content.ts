import './features/mainStyles.css';

import {browser} from 'webextension-polyfill-ts';

import {processDownloadMediaRequest} from './background/gifRequests';
import {setupEmojiAutocompletion} from './features/emojiAutocompletion';
import {setupEmojiPicker} from './features/emojiPicker';
import {setupGifPicker} from './features/gifPicker';
import {listenToInternalBTDMessage} from './helpers/communicationHelpers';
import {isHTMLElement} from './helpers/domHelpers';
import {sendMessageToBackground} from './helpers/webExtensionHelpers';
import {injectInTD} from './services/injectInTD';
import {setupBtdRoot} from './services/setupBTDRoot';
import {BTDMessageOriginsEnum, BTDMessages} from './types/betterTweetDeck/btdMessageTypes';

// Inject some scripts.
injectInTD();

listenToInternalBTDMessage(BTDMessages.BTD_READY, BTDMessageOriginsEnum.CONTENT, async () => {
  setupGifPicker();
  setupEmojiPicker();
  setupEmojiAutocompletion();
  setupBtdRoot();

  const settingsButton = document.querySelector('[btd-settings-button]');

  if (isHTMLElement(settingsButton)) {
    settingsButton.addEventListener('click', () => {
      openSettings();
    });
  }

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

    const mediaPayload = await processDownloadMediaRequest({
      requestId: undefined,
      isReponse: false,
      name: BTDMessages.DOWNLOAD_MEDIA,
      origin: BTDMessageOriginsEnum.CONTENT,
      payload: mediaUrl,
    });

    if (!mediaPayload) {
      return;
    }

    return mediaPayload;
  }
);

function openSettings() {
  sendMessageToBackground({
    data: {
      requestId: undefined,
      isReponse: false,
      name: BTDMessages.OPEN_SETTINGS,
      origin: BTDMessageOriginsEnum.CONTENT,
      payload: undefined,
    },
  });
}
