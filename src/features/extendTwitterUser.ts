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
        include_ext_sensitive_media_warning: true,
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
    if (!isEmpty(baseLabel)) {
      baseUser.highlightedLabel.badge = baseLabel.badge.url;
      baseUser.highlightedLabel.url = baseUser.highlightedLabel.url?.url || '';

      if (baseLabel.userLabelType === 'AutomatedLabel') {
        baseUser.highlightedLabel.description =
          baseLabel.longDescription?.text || baseLabel.description;
        const automator = baseLabel.longDescription?.entities?.[0].ref?.mention?.screenName || '';
        if (automator) {
          baseUser.highlightedLabel.url = `https://twitter.com/${automator}`;
          baseUser.highlightedLabel.author = `https://twitter.com/${automator}`;
        }
      }
    }

    return baseUser;
  };
});
