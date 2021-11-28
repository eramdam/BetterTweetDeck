import './muteNfts.css';

import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const muteNftAvatars = makeBTDModule(({TD, jq, settings}) => {
  modifyMustacheTemplate(TD, 'twitter_profile.mustache', (string) => {
    return string.replace(
      /avatar-border--2/g,
      `avatar-border--2 {{#hasNftAvatar}}avatar--hexagone{{/hasNftAvatar}}`
    );
  });

  modifyMustacheTemplate(TD, `account_summary.mustache`, (string) => {
    return string.replace(
      `class="tweet-avatar avatar pull-right"`,
      `class="tweet-avatar avatar pull-right {{#hasNftAvatar}}avatar--hexagone{{/hasNftAvatar}}"`
    );
  });
  modifyMustacheTemplate(TD, `status/conversation_header.mustache`, (string) => {
    return string.replace(
      `class="tweet-avatar avatar pull-right"`,
      `class="tweet-avatar avatar pull-right {{#hasNftAvatar}}avatar--hexagone{{/hasNftAvatar}}"`
    );
  });
  modifyMustacheTemplate(TD, `status/tweet_single_header.mustache`, (string) => {
    return string.replace(
      `class="tweet-avatar avatar pin-top-full-width"`,
      `class="tweet-avatar avatar pin-top-full-width {{#hasNftAvatar}}avatar--hexagone{{/hasNftAvatar}}"`
    );
  });

  jq(document).on('TD.ready', () => {
    const nftFilters = TD.controller.filterManager
      .getAll()
      .filter((f) => f.type === 'BTD_nft_avatar');

    if (settings.muteNftAvatars) {
      if (nftFilters.length < 1) {
        TD.controller.filterManager.addFilter('BTD_nft_avatar', '');
      }
    } else {
      nftFilters.forEach((filter) => {
        TD.controller.filterManager.removeFilter(filter);
      });
    }
  });
});
