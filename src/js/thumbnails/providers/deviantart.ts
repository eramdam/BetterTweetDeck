import {statusAndJson} from '../../util/fetchHelpers';
import {BTDUrlProvider, BTDUrlProviderResultTypeEnum} from '../types';

export const DeviantArtProvider: BTDUrlProvider = {
  name: 'DeviantArt',
  settingsKey: 'deviantart',
  matchUrl: url => [/^http:\/\/fav.me\//, /^http:\/\/sta.sh\//, /https:\/\/[\w\W]+.deviantart.com/].some(re => re.test(url)),
  fetchData: async (url) => {
    const requestUrl = new URL('https://backend.deviantart.com/oembed');

    requestUrl.searchParams.set('url', url);

    try {
      const json = await fetch(requestUrl.toString()).then(statusAndJson);

      return {
        type: BTDUrlProviderResultTypeEnum.IMAGE,
        thumbnailUrl: String(json.thumbnail_url),
        url: String(json.url)
      };
    } catch (error) {
      return {
        type: BTDUrlProviderResultTypeEnum.ERROR,
        error
      };
    }
  }
};
