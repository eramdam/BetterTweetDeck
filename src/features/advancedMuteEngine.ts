/*
 * Advanced Mute Engine for TweetDeck
 * Copyright (c) 2017 pixeldesu
 * Converted to TypeScript by eramdam
 *
 * This version of the AME is modified for usage in BetterTweetDeck
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

import {makeEnumRuntimeType} from '../helpers/runtimeTypeHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';
import {ChirpBaseTypeEnum, TweetDeckChirp, TweetDeckObject} from '../types/tweetdeckTypes';
import {
  AMEFilters,
  maybeLogMuteCatch,
  removeCatchesByFilter,
  userSpecificTypes,
} from './mutesCatcher';

interface AMEFilter {
  name: string;
  descriptor: string;
  placeholder: string;
  display?: AMEDisplayOptions;
  options?: AMEFilterOptions;
  function(filter: TweetDeckObject['vo']['Filter'], chirp: TweetDeckChirp): boolean;
}

interface AMEDisplayOptions {
  global?: boolean;
  actions?: boolean;
  options?: boolean;
}

interface AMEFilterOptions {
  templateString?: string;
  nameInDropdown?: string;
}

type AMEFiltersMap = {[k in AMEFilters]: AMEFilter};

export const RAMEFilters = makeEnumRuntimeType<AMEFilters>(AMEFilters);

export const setupAME = makeBTDModule(({TD, jq}) => {
  // Save references of original functions
  TD.vo.Filter.prototype._getDisplayType = TD.vo.Filter.prototype.getDisplayType;
  TD.vo.Filter.prototype._pass = TD.vo.Filter.prototype.pass;

  TD.controller.filterManager._addFilter = TD.controller.filterManager.addFilter;
  TD.controller.filterManager._removeFilter = TD.controller.filterManager.removeFilter;

  // If we're running in debug mode, this already exists
  if (!window.BTD) {
    window.BTD = {};
  }

  // Custom filters
  const AmeFilters: AMEFiltersMap = {
    [AMEFilters.NFT_AVATAR]: {
      display: {
        global: false,
        options: false,
        actions: false,
      },
      name: 'Mute accounts with an NFT avatar',
      descriptor: 'accounts with an NFT avatar',
      placeholder: 'nothing!',
      function(t, e) {
        if (typeof e.user?.hasNftAvatar === 'undefined') {
          return true;
        }

        return e.user.hasNftAvatar === false;
      },
    },
    [AMEFilters.BLUE_VERIFIED]: {
      display: {
        global: true,
      },
      name: 'Mute accounts subscribed to Twitter Blue',
      descriptor: 'accounts subscribed to Twitter Blue',
      placeholder: 'Write something random here',
      function(t, e) {
        if (typeof e.user?.isBlueVerified === 'undefined') {
          return true;
        }

        return e.user.isBlueVerified === false;
      },
    },
    [AMEFilters.SPECIFIC_TWEET]: {
      name: 'Specific tweet',
      descriptor: 'specific tweet',
      placeholder: 'ID of tweet',
      options: {
        templateString: '{{chirp.id}}',
        nameInDropdown: 'Hide this tweet',
      },
      function(t, e) {
        if (e.id === t.value) {
          return false;
        }

        return true;
      },
    },
    [AMEFilters.IS_RETWEET_FROM]: {
      display: {
        actions: true,
      },
      name: 'Retweets from User',
      descriptor: 'retweets from',
      placeholder: 'e.g. tweetdeck',
      function(t, e) {
        return !(e.isRetweetedStatus() && t.value === e.user.screenName.toLowerCase());
      },
    },
    [AMEFilters.MUTE_USER_KEYWORD]: {
      display: {
        global: true,
      },
      name: 'Keyword from User',
      descriptor: 'user|keyword: ',
      placeholder: 'e.g. tweetdeck|feature',
      function(t, e) {
        if (!e.user) return true;
        const filter = t.value.split('|');
        const user = filter[0];
        const keyword = filter[1];

        return !(
          e.text.toLowerCase().includes(keyword) && user === e.user.screenName.toLowerCase()
        );
      },
    },
    [AMEFilters.HASHTAGS_NUMBER]: {
      display: {
        global: true,
      },
      name: 'Tweet contains more than X hashtags',
      descriptor: 'tweets with more than X hashtags',
      placeholder: 'Enter a number',
      function(t, e) {
        if (!e.entities) {
          return true;
        }

        if (!Number.isSafeInteger(Number(t.value))) {
          return true;
        }

        return e.entities.hashtags.length <= Number(t.value);
      },
    },
    [AMEFilters.REGEX_DISPLAYNAME]: {
      display: {
        global: true,
      },
      name: 'Display name (Regular Expression)',
      descriptor: 'display names matching',
      placeholder: 'Enter a keyword or phrase',
      function(t, e) {
        if (!e.user) return true;
        const regex = new RegExp(t.value, 'gi');

        return !e.user.name.match(regex);
      },
    },
    [AMEFilters.REGEX]: {
      display: {
        global: true,
      },
      name: 'Tweet Text (Regular Expression)',
      descriptor: 'tweets matching',
      placeholder: 'Enter a regular expression',
      function(t, e) {
        const regex = new RegExp(t.value, 'gi');

        return !e.getFilterableText().match(regex);
      },
    },
    [AMEFilters.CIRCLE_TWEETS]: {
      display: {
        global: true,
      },
      name: 'Mute circle tweets',
      descriptor: 'mute tweets tweeted for circles',
      placeholder: 'nothing!',
      function(t, e) {
        if (!e.limitedActions) return true;

        return e.limitedActions !== 'limit_trusted_friends_tweet';
      },
    },
    [AMEFilters.USER_REGEX]: {
      display: {
        global: true,
      },
      name: 'Username (Regular Expression)',
      descriptor: 'usernames matching',
      placeholder: 'Enter a regular expression',
      function(t, e) {
        if (!e.user) return true;
        const regex = new RegExp(t.value, 'gi');

        return !e.user.screenName.match(regex);
      },
    },
    [AMEFilters.MUTE_QUOTES]: {
      display: {
        actions: true,
      },
      name: 'Quotes from User',
      descriptor: 'quotes from',
      placeholder: 'e.g. tweetdeck',
      function(t, e) {
        if (!e.user) return true;

        return !(e.isQuoteStatus && t.value === e.user.screenName.toLowerCase());
      },
    },
    [AMEFilters.USER_BIOGRAPHIES]: {
      display: {
        global: true,
      },
      name: 'Biography',
      descriptor: 'users whose bio contains',
      placeholder: 'Enter a keyword or phrase',
      function(t, e) {
        if (!e.user) return true;

        return !e.user.description.toLowerCase().includes(t.value);
      },
    },
    [AMEFilters.DEFAULT_AVATARS]: {
      display: {
        global: true,
      },
      name: 'Default Profile Pictures',
      descriptor: 'users having a default profile picture',
      placeholder: 'Write something random here',
      function(t, e) {
        if (!e.user) return true;

        return !e.user.profileImageURL.includes('default');
      },
    },
    [AMEFilters.FOLLOWER_COUNT_LESS_THAN]: {
      display: {
        global: true,
      },
      name: 'Follower count less than',
      descriptor: 'users with less followers than',
      placeholder: 'Enter a number',
      function(t, e) {
        if (!e.user) return true;

        return !(e.user.followersCount < parseInt(t.value, 10));
      },
    },
    [AMEFilters.FOLLOWER_COUNT_GREATER_THAN]: {
      display: {
        global: true,
      },
      name: 'Follower count more than',
      descriptor: 'users with more followers than',
      placeholder: 'Enter a number',
      function(t, e) {
        if (!e.user) return true;

        return !(e.user.followersCount > parseInt(t.value, 10));
      },
    },
  };

  // Custom _getFilterTarget implementation to take RTs into account.
  function getAMEFilterTarget(
    e: TweetDeckChirp,
    filterTarget: 'parent' | 'child',
    filterType: AMEFilters
  ) {
    if (e.targetTweet && filterTarget !== 'parent') {
      return e.targetTweet;
    }

    if (userSpecificTypes.includes(filterType) && e.retweetedStatus) {
      return e.retweetedStatus;
    }

    return e;
  }

  // Custom pass function to apply our filters
  TD.vo.Filter.prototype.pass = function pass(e) {
    if (RAMEFilters.is(this.type)) {
      try {
        const t = this;
        e = getAMEFilterTarget(e, this.filterTarget, this.type);

        const shouldDisplay = AmeFilters[this.type].function(t, e);
        if (e.chirpType === ChirpBaseTypeEnum.TWEET || e.chirpType === ChirpBaseTypeEnum.UNKNOWN) {
          maybeLogMuteCatch(e, this, shouldDisplay);
        }

        return shouldDisplay;
      } catch (e) {
        console.error(e);
        return true;
      }
    }

    const shouldDisplay = this._pass(e);

    if (e.chirpType === ChirpBaseTypeEnum.TWEET || e.chirpType === ChirpBaseTypeEnum.UNKNOWN) {
      maybeLogMuteCatch(e, this, shouldDisplay);
    }

    return shouldDisplay;
  };

  TD.controller.filterManager.removeFilter = function removeFilter(filter) {
    const foundFilter = TD.controller.filterManager.getAll().find((f) => f.id === filter.id);
    if (foundFilter) {
      removeCatchesByFilter(foundFilter);
    }
    return this._removeFilter(filter);
  };

  // Custom display type function to show proper description in filter list
  TD.vo.Filter.prototype.getDisplayType = function getDisplayType() {
    if (RAMEFilters.is(this.type)) {
      return AmeFilters[this.type].descriptor;
    }
    return this._getDisplayType();
  };

  // Helper function to build <option>s for the custom filters
  const filterDropdown = function filterDropdown() {
    const filters = Object.keys(AmeFilters);
    let filterString = '';

    filters.forEach((filter) => {
      if (!RAMEFilters.is(filter)) {
        return;
      }
      const fil = AmeFilters[filter];
      if (fil.display && fil.display.global) {
        filterString += `<option value="${filter}">{{_i}}${fil.name}{{/i}}</option>`;
      }
    });

    return filterString;
  };

  // Helper function to build <li>s for the actions dropdown
  const userDropdown = function userDropdown() {
    const filters = Object.keys(AmeFilters);
    let filterString = '';

    filters.forEach((filter) => {
      if (!RAMEFilters.is(filter)) {
        return;
      }
      const fil = AmeFilters[filter];
      if (fil.display && fil.display.actions) {
        const templateString =
          fil.options && fil.options.templateString ? fil.options.templateString : '{{screenName}}';
        const name =
          fil.options && fil.options.nameInDropdown
            ? fil.options.nameInDropdown
            : `Mute ${fil.name}`;

        filterString += `<li class="is-selectable">
            <a href="#" data-btd-filter="${filter}" data-btd-value="${templateString}">{{_i}}${name}{{/i}}</a>
          </li>`;
      }
    });

    return filterString;
  };

  jq(document).on('change', '.js-filter-types', (e) => {
    e.preventDefault();

    const options = e.target.options;
    const filter = e.target.options[options.selectedIndex].value;

    if (RAMEFilters.is(filter)) {
      jq('.js-filter-input').attr('placeholder', AmeFilters[filter].placeholder);
    }
  });

  jq('body').on('click', '[data-btd-filter]', (ev) => {
    ev.preventDefault();
    const filter = jq(ev.target).data('btd-filter');
    const value = jq(ev.target).data('btd-value');

    TD.controller.filterManager.addFilter(filter, value);
  });

  // Add our custom filters to the filter dropdown
  TD.mustaches['settings/global_setting_filter.mustache'] = TD.mustaches[
    'settings/global_setting_filter.mustache'
  ].replace('</select>', `${filterDropdown()}</select>`);

  // Add our custom filters to the actions dropdown
  TD.mustaches['menus/actions.mustache'] = TD.mustaches['menus/actions.mustache'].replace(
    '{{/isMuted}} ',
    `{{/isMuted}} {{#user}} {{^isMe}} ${userDropdown()} {{/isMe}} {{/user}}`
  );

  const filterKey = 'BTD_specific_tweet';
  const filter = AmeFilters[filterKey];

  if (filter.options) {
    TD.mustaches['menus/actions.mustache'] = TD.mustaches['menus/actions.mustache'].replace(
      '{{/isOwnChirp}}',
      `{{/isOwnChirp}}
            <li class="is-selectable">
              <a href="#" action="_" data-btd-filter="${filterKey}" data-btd-value="${filter.options.templateString}">${filter.options.nameInDropdown}</a>
            </li>
          `
    );
  }
});
