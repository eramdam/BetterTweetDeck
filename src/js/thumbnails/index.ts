import {DeviantArtProvider} from './providers/deviantart';
import {BTDThumbnailProvider} from './types';

const thumbnailProviders = [DeviantArtProvider];

export function findProviderForUrl(url: string) {
  return thumbnailProviders.find(p => p.matchUrl(url));
}

export async function getThumbnailData(url: string, provider: BTDThumbnailProvider) {
  return provider.fetchData(url);
}
