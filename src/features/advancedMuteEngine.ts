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

import {makeBTDModule} from '../types/btdCommonTypes';
import {TweetDeckChirp, TweetDeckObject} from '../types/tweetdeckTypes';

type AMEFiltersMap = {[k: string]: AMEFilter};

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

export const setupAME = makeBTDModule(({TD, jq}) => {
  // Save references of original functions
  TD.vo.Filter.prototype._getDisplayType = TD.vo.Filter.prototype.getDisplayType;
  TD.vo.Filter.prototype._pass = TD.vo.Filter.prototype.pass;

  // If we're running in debug mode, this already exists
  if (!window.BTD) {
    window.BTD = {};
  }

  // Custom filters
  const AmeFilters: AMEFiltersMap = {
    BTD_specific_tweet: {
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
    BTD_is_retweet_from: {
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
    BTD_mute_user_keyword: {
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
    BTD_regex: {
      display: {
        global: true,
      },
      name: 'Tweet Text (Regular Expression)',
      descriptor: 'tweets matching',
      placeholder: 'Enter a regular expression',
      function(t, e) {
        const regex = new RegExp(t.value, 'g');

        return !e.getFilterableText().match(regex);
      },
    },
    BTD_user_regex: {
      display: {
        global: true,
      },
      name: 'Username (Regular Expression)',
      descriptor: 'usernames matching',
      placeholder: 'Enter a regular expression',
      function(t, e) {
        if (!e.user) return true;
        const regex = new RegExp(t.value, 'g');

        return !e.user.screenName.match(regex);
      },
    },
    BTD_mute_quotes: {
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
    BTD_user_biographies: {
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
    BTD_default_avatars: {
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
    BTD_follower_count_less_than: {
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
    BTD_follower_count_greater_than: {
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

  // Custom pass function to apply our filters
  TD.vo.Filter.prototype.pass = function pass(e) {
    if (this.type.startsWith('BTD')) {
      const t = this;
      e = this._getFilterTarget(e);

      return AmeFilters[this.type].function(t, e);
    }
    return this._pass(e);
  };

  // Custom display type function to show proper description in filter list
  TD.vo.Filter.prototype.getDisplayType = function getDisplayType() {
    if (AmeFilters[this.type] !== undefined) {
      return AmeFilters[this.type].descriptor;
    }
    return this._getDisplayType();
  };

  // Helper function to build <option>s for the custom filters
  const filterDropdown = function filterDropdown() {
    const filters = Object.keys(AmeFilters);
    let filterString = '';

    filters.forEach((filter) => {
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

    if (filter.startsWith('BTD')) {
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
