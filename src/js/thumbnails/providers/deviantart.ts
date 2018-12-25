import {buildURLWithSearchParams, statusAndJson} from '../../helpers/thumbnailsHelpers';
import {BTDThumbnailProvider, BTDUrlProviderResultTypeEnum} from '../types';

export const DeviantArtProvider: BTDThumbnailProvider = {
  name: 'DeviantArt',
  settingsKey: 'deviantart',
  matchUrl: url => [/^http:\/\/fav.me\//, /^http:\/\/sta.sh\//, /https:\/\/[\w\W]+.deviantart.com/].some(re => re.test(url)),
  fetchData: async (url) => {
    try {
      const json = await fetch(
        buildURLWithSearchParams('https://backend.deviantart.com/oembed', {
          url
        })
      ).then(statusAndJson);

      return {
        type: BTDUrlProviderResultTypeEnum.IMAGE,
        thumbnailUrl: String(json.thumbnail_url),
        url
      };
    } catch (error) {
      return {
        type: BTDUrlProviderResultTypeEnum.ERROR,
        error
      };
    }
  }
};
