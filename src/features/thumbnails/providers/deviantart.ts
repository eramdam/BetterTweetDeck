import {buildURLWithSearchParams, statusAndJson} from '../../../helpers/networkHelpers';
import {BTDThumbnailProvider, BTDUrlProviderResultTypeEnum} from '../types';

export const DeviantArtProvider: BTDThumbnailProvider = {
  name: 'DeviantArt',
  settingsKey: 'deviantart',
  matchUrl: (url) =>
    [/^http:\/\/fav.me\//, /^http:\/\/sta.sh\//, /https:\/\/[\w\W]+.deviantart.com/].some((re) =>
      re.test(url)
    ),
  fetchData: async (url) => {
    if (url.startsWith('https://www.deviantart.com/') && !url.includes('/art/')) {
      return {
        type: BTDUrlProviderResultTypeEnum.ERROR,
        error: undefined,
      };
    }
    try {
      const json = await fetch(
        buildURLWithSearchParams('https://backend.deviantart.com/oembed', {
          url,
        })
      ).then(statusAndJson);

      const {type} = json;

      if (type !== 'link' && type !== 'photo') {
        throw new Error('Result is not of the right type.');
      }

      const fullscreenImageUrl = type === 'link' ? json.fullsize_url : json.url;

      return {
        type: BTDUrlProviderResultTypeEnum.IMAGE,
        thumbnailUrl: String(json.thumbnail_url),
        fullscreenImageUrl: String(fullscreenImageUrl),
        url,
      };
    } catch (error) {
      return {
        type: BTDUrlProviderResultTypeEnum.ERROR,
        error,
      };
    }
  },
};
