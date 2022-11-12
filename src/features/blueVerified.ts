/* eslint-disable no-useless-escape */
import './blueVerified.css';

import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const supportBlueVerified = makeBTDModule(({TD, jq, settings}) => {
  if (!settings.verifiedBlueBadges) {
    return;
  }
  document.body.setAttribute(
    'btd-verified-blue-badge',
    String(settings.verifiedBlueBadgeVariation)
  );

  [
    'compose/autocomplete_twitter_user.mustache',
    'compose/in_reply_to.mustache',
    'list_module_account_item.mustache',
    'lists/member.mustache',
    'settings/account_settings_login_account.mustache',
    'status/scheduled_tweet_single_header.mustache',
    'status/tweet_single_header.mustache',
    'twitter_profile.mustache',
    'typeahead/typeahead_users.mustache',
    'typeahead/typeahead_users_compose.mustache',
  ].forEach((mustache) => {
    modifyMustacheTemplate(TD, mustache, (markup) => {
      return markup.replace(
        '{{/isVerified}}',
        `{{/isVerified}} {{#isBlueVerified}}<i class="js-show-tip sprite verified-blue" title="" data-original-title='This account is subscribed to Twitter Blue.'></i>{{/isBlueVerified}} `
      );
    });
  });
});
