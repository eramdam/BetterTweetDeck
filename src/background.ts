import browser from 'webextension-polyfill';

import {getTransString} from './components/trans';
import {isSafari} from './helpers/browserHelpers';
import {
  ExtensionSettings,
  getExtensionUrl,
  getExtensionVersion,
  listenForStorageChange,
} from './helpers/webExtensionHelpers';
import {getValidatedSettings, setupSettingsInBackground} from './services/backgroundSettings';
import {BTDMessageEvent, BTDMessages} from './types/btdMessageTypes';
import {BTDSettings} from './types/btdSettingsTypes';

(async () => {
  await setupSettingsInBackground();

  browser.runtime.onMessage.addListener(async (request: BTDMessageEvent, sender) => {
    if (sender.url !== 'https://tweetdeck.twitter.com/') {
      throw new Error('Message not coming from BTD');
    }

    switch (request.data.name) {
      case BTDMessages.OPEN_SETTINGS: {
        browser.tabs.create({
          url: request.data.payload.selectedId
            ? `build/options/index.html?selectedId=${request.data.payload.selectedId}`
            : 'build/options/index.html',
        });
        return undefined;
      }

      case BTDMessages.UPDATE_SETTINGS: {
        await ExtensionSettings.set({
          ...(await getValidatedSettings()),
          ...request.data.payload,
        });
        return undefined;
      }

      case BTDMessages.BTD_READY: {
        await ExtensionSettings.set({
          ...(await getValidatedSettings()),
          needsToShowUpdateBanner: false,
          showFollowPrompt: false,
        });
        return undefined;
      }

      default:
        return undefined;
    }
  });

  listenForStorageChange(async (changes) => {
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

  // Get the settings from the browser.
  const settings = await getValidatedSettings();

  if (settings.installedVersion !== getExtensionVersion()) {
    await ExtensionSettings.set({
      ...settings,
      installedVersion: getExtensionVersion(),
      needsToShowUpdateBanner: true,
    });

    if (!(await browser.permissions.contains({permissions: ['notifications']}))) {
      return;
    }

    const tabs = await browser.tabs.query({
      url: '*://tweetdeck.twitter.com/*',
    });

    if (tabs.length > 0) {
      const updateNotification = await browser.notifications.create(undefined, {
        title: browser.i18n.getMessage('settings_better_tweetdeck_has_been_updated'),
        message: browser.i18n.getMessage('settings_click_this_notification_to_reload'),
        type: 'basic',
        isClickable: true,
        priority: 1,
        iconUrl: getExtensionUrl('build/assets/icons/icon-512.png'),
      });

      browser.notifications.onClicked.addListener((id) => {
        if (id === updateNotification) {
          tabs.forEach((tab) => {
            browser.tabs.reload(tab.id);
          });
          browser.notifications.clear(id);
        }
      });
    }
  }

  if (!settings.enableShareItem || isSafari) {
    return;
  }

  addContextMenuItem(settings);
})();

function removeContextMenuItem() {
  browser.contextMenus.removeAll();
}

const textLimitWithLink = 254;

function addContextMenuItem(settings: BTDSettings) {
  browser.contextMenus.create({
    title: getTransString('settings_share_on_tweetdeck'),
    contexts: ['page', 'selection', 'image', 'link'],
    onclick: async (info, tab) => {
      const urlToShare = info.linkUrl || info.srcUrl || info.pageUrl;
      const baseText = info.selectionText || tab.title || '';
      const suffix =
        settings.shouldShortenSharedText && baseText.length > textLimitWithLink ? '…' : '';
      const textToShare = !settings.shouldShortenSharedText
        ? baseText
        : baseText.slice(0, textLimitWithLink) + suffix;

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
    },
  });
}
