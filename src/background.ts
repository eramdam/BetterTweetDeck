import {browser} from 'webextension-polyfill-ts';

import {getValidatedSettings, setupSettingsInBackground} from './services/backgroundSettings';
import {findProviderForUrl, getThumbnailData} from './thumbnails';
import {BTDMessages} from './types/betterTweetDeck/btdMessageTypes';

(async () => {
  await setupSettingsInBackground();

  browser.runtime.onMessage.addListener(async (request, sender) => {
    if (
      sender.url !== 'https://tweetdeck.twitter.com/' ||
      !String(sender.id).includes('erambert.me') ||
      !String(sender.id).includes('BetterTweetDeck')
    ) {
      throw new Error('Message not coming from BTD');
    }

    if (request.data.name === BTDMessages.FETCH_THUMBNAIL) {
      const targetUrl = request.data.payload.url;
      if (!targetUrl) {
        return;
      }

      const provider = findProviderForUrl(targetUrl);

      if (!provider) {
        return;
      }

      const thumbnailData = await getThumbnailData(targetUrl, provider);

      return {
        name: BTDMessages.THUMBNAIL_RESULT,
        payload: thumbnailData,
      };
    }

    return undefined;
  });

  // // Get the settings from the browser.
  const settings = await getValidatedSettings();
  const textLimitWithLink = 254;

  if (settings.enableShareItem) {
    browser.contextMenus.create({
      title: 'Share on BTD',
      contexts: ['page', 'selection', 'image', 'link'],
      onclick: async (info, tab) => {
        const urlToShare = info.linkUrl || info.srcUrl || info.pageUrl;
        const baseText = info.selectionText || tab.title || '';
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
      },
    });
  }
})();
