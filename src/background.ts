import {browser} from 'webextension-polyfill-ts';

import {setupSettingsInBackground} from './services/backgroundSettings';
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
})();
