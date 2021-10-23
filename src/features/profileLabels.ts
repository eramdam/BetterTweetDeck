import {isString} from 'lodash';

import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {buildURLWithSearchParams} from '../helpers/networkHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const addProfileLabels = makeBTDModule((options) => {
  const {jq, TD} = options;

  jq.ajaxPrefilter((ajaxOptions) => {
    try {
      const url = new URL(ajaxOptions.url || '');

      if (!url.searchParams.has('include_entities')) {
        return;
      }

      ajaxOptions.url = buildURLWithSearchParams(ajaxOptions.url || '', {
        ext: `mediaStats,highlightedLabel,voiceInfo,superFollowMetadata`,
      });
    } catch (e) {
      //
    }
  });

  TD.services.TwitterUser.prototype.OGFromJSON = TD.services.TwitterUser.prototype.fromJSONObject;

  TD.services.TwitterUser.prototype.fromJSONObject = function fromJSONObject(blob: any) {
    var baseTweet = this.OGFromJSON(blob);

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

  modifyMustacheTemplate(TD, 'status/tweet_single.mustache', (string) => {
    return string.replace(
      `{{/getMainTweet}} </header>`,
      `{{/getMainTweet}} </header> {{#getMainUser}} {{#highlightedLabel}} <a rel="url noopener noreferrer" href="{{url}}" class="btd-official-label txt-mute" target="_blank"><img src="{{badge}}" /> {{description}}</a> {{/highlightedLabel}} {{/getMainUser}}`
    );
  });

  modifyMustacheTemplate(TD, 'account_summary.mustache', (string) => {
    return string.replace(
      `{{/withUserBio}} </div> </div>`,
      `{{/withUserBio}} {{#highlightedLabel}} <a rel="url noopener noreferrer" href="{{url}}" class="btd-official-label txt-mute" target="_blank"><img src="{{badge}}" /> {{description}}</a> {{/highlightedLabel}} </div> </div>`
    );
  });

  modifyMustacheTemplate(TD, 'twitter_profile.mustache', (string) => {
    return string.replace(
      `{{/getDisplayURL}} </p>`,
      `{{/getDisplayURL}} </p> {{#highlightedLabel}} <p class="margin-t--5"><a rel="url noopener noreferrer" href="{{url}}" class="btd-official-label prf-siteurl" target="_blank"><img src="{{badge}}" /> {{description}}</a></p> {{/highlightedLabel}}`
    );
  });
});
