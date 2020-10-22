import './features/mainStyles.css';

import {isRight} from 'fp-ts/lib/Either';
import {PathReporter} from 'io-ts/lib/PathReporter';
import {browser} from 'webextension-polyfill-ts';

import {setupEmojiAutocompletion} from './features/emojiAutocompletion';
import {setupEmojiPicker} from './features/emojiPicker';
import {setupGifModals} from './features/gifModals';
import {setupGifPicker} from './features/gifPicker';
import {maybeReplaceHeartsByStars} from './features/replaceHeartsByStars';
import {tweakTweetDeckTheme} from './features/themeTweaks';
import {setupThumbnailInjector} from './features/thumbnails/thumbnailInjector';
import {listenToInternalBTDMessage} from './helpers/communicationHelpers';
import {ExtensionSettings, sendMessageToBackground} from './helpers/webExtensionHelpers';
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
// Setup thumbnail system.
setupThumbnailInjector();
getValidatedSettings().then((settings) => {
  setupGifModals(settings);
  maybeReplaceHeartsByStars({settings});
  tweakTweetDeckTheme({settings});
});

listenToInternalBTDMessage(BTDMessages.BTD_READY, BTDMessageOriginsEnum.CONTENT, async () => {
  setupGifPicker();
  setupEmojiPicker();
  setupEmojiAutocompletion();
  setupBtdRoot();

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

listenToInternalBTDMessage(BTDMessages.GET_SETTINGS, BTDMessageOriginsEnum.CONTENT, async (msg) => {
  if (msg.data.name !== BTDMessages.GET_SETTINGS) {
    return;
  }

  const settings = await getValidatedSettings();
  console.log({settings});

  return {
    requestId: undefined,
    isReponse: true,
    name: BTDMessages.GET_SETTINGS_RESULT,
    origin: BTDMessageOriginsEnum.CONTENT,
    payload: settings,
  };
});
