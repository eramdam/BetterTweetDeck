import './features/mainStyles.css';

import {isRight} from 'fp-ts/lib/Either';
import {PathReporter} from 'io-ts/lib/PathReporter';
import {browser} from 'webextension-polyfill-ts';

import {setupEmojiAutocompletion} from './features/emojiAutocompletion';
import {setupEmojiPicker} from './features/emojiPicker';
import {setupGifPicker} from './features/gifPicker';
import {listenToInternalBTDMessage} from './helpers/communicationHelpers';
import {ExtensionSettings, sendMessageToBackground} from './helpers/webExtensionHelpers';
import {setupSettings} from './inject/setupSettings';
import {getValidatedSettings} from './services/backgroundSettings';
import {injectInTD} from './services/injectInTD';
import {setupBtdRoot} from './services/setupBTDRoot';
import {
  BTDMessageOriginsEnum,
  BTDMessages,
  RSaveSettingsResultEvent,
} from './types/betterTweetDeck/btdMessageTypes';

// Inject some scripts.
injectInTD();

listenToInternalBTDMessage(BTDMessages.BTD_READY, BTDMessageOriginsEnum.CONTENT, async () => {
  setupGifPicker();
  setupEmojiPicker();
  setupEmojiAutocompletion();
  setupBtdRoot();
  const settings = await getValidatedSettings();
  setupSettings(settings);

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

listenToInternalBTDMessage(
  BTDMessages.SAVE_SETTINGS,
  BTDMessageOriginsEnum.CONTENT,
  async (msg) => {
    if (msg.data.name !== BTDMessages.SAVE_SETTINGS) {
      return;
    }

    const decoded = RSaveSettingsResultEvent.decode(msg.data);

    if (!isRight(decoded)) {
      console.log(PathReporter.report(decoded));
      console.log('error parsing save settings msg');
      return;
    }

    const {settings} = decoded.right.payload;

    ExtensionSettings.set(settings);
  }
);
