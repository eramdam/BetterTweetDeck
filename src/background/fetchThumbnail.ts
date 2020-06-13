import {findProviderForUrl, getThumbnailData} from '../features/thumbnails';
import {
  BTDFetchThumbnailEvent,
  BTDMessages,
  BTDThumbnailResultEvent,
} from '../types/betterTweetDeck/btdMessageTypes';

export async function processThumbnailMessage(
  message: BTDFetchThumbnailEvent
): Promise<BTDThumbnailResultEvent | undefined> {
  const targetUrl = message.payload.url;
  if (!targetUrl) {
    return undefined;
  }

  const provider = findProviderForUrl(targetUrl);

  if (!provider) {
    return undefined;
  }

  const thumbnailData = await getThumbnailData(targetUrl, provider);

  return {
    ...message,
    name: BTDMessages.THUMBNAIL_RESULT,
    payload: thumbnailData,
  };
}
