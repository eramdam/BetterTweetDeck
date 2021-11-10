import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const addProfileLabels = makeBTDModule((options) => {
  const {jq, TD, settings} = options;

  if (!settings.showProfileLabels) {
    return;
  }

  modifyMustacheTemplate(TD, 'status/tweet_single.mustache', (string) => {
    return string.replace(
      `{{/getMainTweet}} </header>`,
      `{{/getMainTweet}} </header> {{#getMainUser}} {{#highlightedLabel}} <a rel="url noopener noreferrer" href="{{url}}" class="btd-profile-label txt-mute" target="_blank"><img src="{{badge}}" /> {{description}}</a> {{/highlightedLabel}} {{/getMainUser}}`
    );
  });

  modifyMustacheTemplate(TD, 'account_summary.mustache', (string) => {
    return string.replace(
      `{{/withUserBio}} </div> </div>`,
      `{{/withUserBio}} {{#highlightedLabel}} <a rel="url noopener noreferrer" href="{{url}}" class="btd-profile-label txt-mute" target="_blank"><img src="{{badge}}" /> {{description}}</a> {{/highlightedLabel}} </div> </div>`
    );
  });

  modifyMustacheTemplate(TD, 'twitter_profile.mustache', (string) => {
    return string.replace(
      `{{/getDisplayURL}} </p>`,
      `{{/getDisplayURL}} </p> {{#highlightedLabel}} <p class="margin-t--5"><a rel="url noopener noreferrer" href="{{url}}" class="btd-profile-label prf-siteurl" target="_blank"><img src="{{badge}}" /> {{description}}</a></p> {{/highlightedLabel}}`
    );
  });
});
