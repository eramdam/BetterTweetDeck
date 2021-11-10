import {isString} from 'lodash';

import {buildURLWithSearchParams} from '../helpers/networkHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const extendTwitterUser = makeBTDModule(({TD, jq}) => {
  jq.ajaxPrefilter((ajaxOptions) => {
    try {
      const url = new URL(ajaxOptions.url || '');

      if (!url.searchParams.has('include_entities')) {
        return;
      }

      ajaxOptions.url = buildURLWithSearchParams(ajaxOptions.url || '', {
        ext: `mediaStats,highlightedLabel,voiceInfo,superFollowMetadata`,
        include_ext_has_nft_avatar: true,
      });
    } catch (e) {
      //
    }
  });

  TD.services.TwitterUser.prototype.OGFromJSON = TD.services.TwitterUser.prototype.fromJSONObject;

  TD.services.TwitterUser.prototype.fromJSONObject = function fromJSONObject(blob: any) {
    var baseTweet = this.OGFromJSON(blob);

    baseTweet.hasNftAvatar = Boolean(blob.ext_has_nft_avatar);
    const hasRequiredLabelData =
      blob.ext?.highlightedLabel?.r?.ok?.label &&
      isString(blob.ext?.highlightedLabel?.r?.ok?.label?.badge?.url) &&
      isString(blob.ext?.highlightedLabel?.r?.ok?.label?.description) &&
      isString(blob.ext?.highlightedLabel?.r?.ok?.label?.url.url);
    baseTweet.highlightedLabel = hasRequiredLabelData
      ? {
          badge: blob.ext?.highlightedLabel?.r?.ok?.label?.badge?.url,
          description: blob.ext?.highlightedLabel?.r?.ok?.label?.description,
          url: blob.ext?.highlightedLabel?.r?.ok?.label?.url.url,
        }
      : undefined;

    return baseTweet;
  };
});
