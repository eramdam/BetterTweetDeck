import {findProviderForUrl} from './thumbnails';
import {getExtensionUrl, settings as extensionSettings} from './util/browserHelpers';
import {
  BTDMessageOriginsEnum,
  BTDMessageTypesEnums,
  ChirpUrlsMessageData,
  msgToInject,
  onBTDMessage
} from './util/messaging';

function isCorrectTweetDeckUrlObject(
  obj: any
): obj is {
  isUrlForAttachment: boolean;
  expanded_url: string;
} {
  return !!obj.isUrlForAttachment && !!obj.expanded_url;
}

/** Fetches the thumbnails data for an array of URL entities coming from a chirp */
async function onChirpUrls(data: ChirpUrlsMessageData) {
  // Find one appicable URL
  const validUrl = data.payload
    .filter(url => isCorrectTweetDeckUrlObject(url) && !url.isUrlForAttachment)
    .pop();

  if (!validUrl || !isCorrectTweetDeckUrlObject(validUrl)) {
    return;
  }

  // Find a possible thumbnail provider for the valid URL
  const provider = findProviderForUrl(validUrl.expanded_url);

  // If no providers matched, nothing to do
  if (!provider) {
    return;
  }

  // Fetch the thumbnail data
  const thumbData = await provider.fetchData(validUrl.expanded_url);

  // Send back that info to inject.js
  msgToInject({
    type: BTDMessageTypesEnums.THUMBNAIL_DATA,
    payload: thumbData,
    meta: {
      origin: BTDMessageOriginsEnum.CONTENT,
      hash: data.meta && data.meta.hash
    }
  });
}

(async () => {
  /**
   * Get the extensions settings from the browser
   */
  const settings = await extensionSettings.get();

  /**
   * Inject our script into the page
   */
  const injected = document.createElement('script');
  injected.src = getExtensionUrl('js/inject.js');
  injected.dataset.btdSettings = JSON.stringify(settings);
  document.head.appendChild(injected);

  onBTDMessage(BTDMessageOriginsEnum.INJECT, (data) => {
    if (!data.meta || !data.meta.hash) {
      return;
    }

    switch (data.type) {
      case BTDMessageTypesEnums.CHIRP_URLS:
        onChirpUrls(data);
        break;

      default:
        break;
    }
  });
})();
