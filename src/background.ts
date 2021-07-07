import {browser, Menus, Tabs} from 'webextension-polyfill-ts';

import {getTransString} from './components/trans';
import {isSafari} from './helpers/browserHelpers';
import {ExtensionSettings, getExtensionVersion} from './helpers/webExtensionHelpers';
import {getValidatedSettings, setupSettingsInBackground} from './services/backgroundSettings';
import {BTDMessageEvent, BTDMessages} from './types/btdMessageTypes';
import {BTDSettings} from './types/btdSettingsTypes';

/**
 Constants.
 */
const textLimitWithLink = 254;
const textMenuItemId = 'bettertweetdeck-share-item';

/**
 * Main logic.
 */

// Startup logic
browser.runtime.onInstalled.addListener(async () => {
  const settings = await setupSettingsInBackground();

  if (settings.installedVersion !== getExtensionVersion()) {
    await ExtensionSettings.set({
      ...settings,
      installedVersion: getExtensionVersion(),
      needsToShowUpdateBanner: true,
    });
  }

  if (!settings.enableShareItem || isSafari) {
    return;
  }

  addContextMenuItem(settings);
});

// Dynamically remove/add contextmenu item
browser.storage.onChanged.addListener(async (changes) => {
  if (changes.enableShareItem?.newValue === changes.enableShareItem?.oldValue) {
    return;
  }

  const settings = await getValidatedSettings();

  if (changes.enableShareItem.newValue) {
    addContextMenuItem(settings);
  } else {
    removeContextMenuItem();
  }
});

// Listen to internal messages
browser.runtime.onMessage.addListener(async (request: BTDMessageEvent, sender) => {
  if (sender.url !== 'https://tweetdeck.twitter.com/') {
    throw new Error('Message not coming from BTD');
  }

  switch (request.data.name) {
    case BTDMessages.PING: {
      return true;
    }
    case BTDMessages.OPEN_SETTINGS: {
      browser.tabs.create({
        url: request.data.payload.selectedId
          ? `build/options/index.html?selectedId=${request.data.payload.selectedId}`
          : 'build/options/index.html',
      });
      return undefined;
    }

    case BTDMessages.BTD_READY: {
      await ExtensionSettings.set({
        ...(await getValidatedSettings()),
        needsToShowUpdateBanner: false,
        needsToShowFollowPrompt: false,
      });
      return undefined;
    }

    default:
      return undefined;
  }
});

/**
 * Helpers.
 */

function removeContextMenuItem() {
  if (!browser.contextMenus) {
    return;
  }
  browser.contextMenus.removeAll();
  browser.contextMenus.onClicked.removeListener(contextMenuClickListener);
}

async function contextMenuClickListener(info: Menus.OnClickData, tab: Tabs.Tab | undefined) {
  const settings = await getValidatedSettings();

  const urlToShare = info.linkUrl || info.srcUrl || info.pageUrl;
  const baseText = info.selectionText || tab?.title || '';
  const textToShare = !settings.shouldShortenSharedText
    ? baseText
    : baseText.slice(0, textLimitWithLink) + '…';

  const tabs = await browser.tabs.query({
    url: '*://tweetdeck.twitter.com/*',
  });

  if (tabs.length === 0) {
    return;
  }

  const TweetDeckTab = tabs[0];

  if (!TweetDeckTab.id || !TweetDeckTab.windowId) {
    return;
  }

  await browser.windows.update(TweetDeckTab.windowId, {
    focused: true,
  });

  await browser.tabs.update(TweetDeckTab.id, {active: true});
  browser.tabs.sendMessage(TweetDeckTab.id, {
    action: 'share',
    text: textToShare,
    url: urlToShare,
  });
}

function addContextMenuItem(settings: BTDSettings) {
  if (!browser.contextMenus) {
    return;
  }

  browser.contextMenus.create(
    {
      id: textMenuItemId,
      title: getTransString('settings_share_on_tweetdeck'),
      contexts: ['page', 'selection', 'image', 'link'],
    },
    () => browser.runtime.lastError
  );
  browser.contextMenus.onClicked.addListener(contextMenuClickListener);
}
