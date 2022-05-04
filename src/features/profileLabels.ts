import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const addProfileLabels = makeBTDModule((options) => {
  const {TD, settings} = options;

  if (!settings.showProfileLabels) {
    return;
  }

  modifyMustacheTemplate(TD, 'status/tweet_single.mustache', (string) => {
    return string.replace(
      `{{/getMainTweet}} </header>`,
      `{{/getMainTweet}} </header> {{#getMainUser}} {{#highlightedLabel}} <a rel="{{#author}}user{{/author}}{{^author}}url noopener noreferrer{{/author}}" href="{{url}}" class="btd-profile-label txt-mute" target="_blank">{{#badge}}<img src="{{badge}}" />{{/badge}} {{description}}</a> {{/highlightedLabel}} {{/getMainUser}}`
    );
  });

  modifyMustacheTemplate(TD, 'account_summary.mustache', (string) => {
    return string.replace(
      `{{/withUserBio}} </div> </div>`,
      `{{/withUserBio}} {{#highlightedLabel}} <a rel="{{#author}}user{{/author}}{{^author}}url noopener noreferrer{{/author}}" href="{{url}}" class="btd-profile-label txt-mute" target="_blank">{{#badge}}<img src="{{badge}}" />{{/badge}} {{description}}</a> {{/highlightedLabel}} </div> </div>`
    );
  });

  modifyMustacheTemplate(TD, 'twitter_profile.mustache', (string) => {
    return string.replace(
      `{{/getDisplayURL}} </p>`,
      `{{/getDisplayURL}} </p> {{#highlightedLabel}} <p class="margin-t--5"><a rel="{{#author}}user{{/author}}{{^author}}url noopener noreferrer{{/author}}" href="{{url}}" class="btd-profile-label prf-siteurl" target="_blank">{{#badge}}<img src="{{badge}}" />{{/badge}} {{description}}</a></p> {{/highlightedLabel}}`
    );
  });
});
