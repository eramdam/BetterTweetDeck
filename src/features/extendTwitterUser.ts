import {isEmpty} from 'lodash';

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
    var baseUser = this.OGFromJSON(blob);

    baseUser.hasNftAvatar = Boolean(blob.ext_has_nft_avatar);
    const baseLabel = blob.ext?.highlightedLabel?.r?.ok?.label || {};
    baseUser.highlightedLabel = isEmpty(baseLabel) ? undefined : baseLabel;

    return baseUser;
  };
});
