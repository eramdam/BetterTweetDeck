import {DeviantArtProvider} from './providers/deviantart';
import {BTDUrlProvider} from './types';

const Providers = [DeviantArtProvider];

export function findProviderForUrl(url: string) {
  return Providers.find(p => p.matchUrl(url));
}

export function getThumbnailData(url: string, provider: BTDUrlProvider) {
  if (!provider.matchUrl(url)) {
    return {};
  }

  return provider.fetchData(url);
}
