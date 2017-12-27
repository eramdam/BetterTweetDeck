/*
 * Advanced Mute Engine for TweetDeck
 * Copyright (c) 2017 pixeldesu
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

export default function () {
  // Save references of original functions
  TD.vo.Filter.prototype._getDisplayType = TD.vo.Filter.prototype.getDisplayType;
  TD.vo.Filter.prototype._pass = TD.vo.Filter.prototype.pass;

  // If we're running in debug mode, this already exists
  if (!window.BTD) {
    window.BTD = {};
  }

  // Custom filters
  BTD.Filters = {
    BTD_is_retweet_from: {
      dropdown: true,
      name: 'Retweets from User (without @)',
      descriptor: 'retweets from',
      placeholder: 'e.g. tweetdeck',
      function(t, e) {
        return !(e.isRetweetedStatus() && (t.value === e.user.screenName.toLowerCase()));
      },
    },
    BTD_mute_user_keyword: {
      dropdown: true,
      name: 'Keyword from User (user|keyword)',
      descriptor: 'user|keyword: ',
      placeholder: 'e.g. tweetdeck|feature',
      function(t, e) {
        if (!e.user) return true;
        const filter = t.value.split('|');
        const user = filter[0];
        const keyword = filter[1];

        return !(e.text.toLowerCase().includes(keyword) && (user === e.user.screenName.toLowerCase()));
      },
    },
    BTD_user_biographies: {
      dropdown: true,
      name: 'Biography',
      descriptor: 'users whose bio contains',
      placeholder: 'Enter a keyword or phrase',
      function(t, e) {
        if (!e.user) return true;

        return !(e.user.description.toLowerCase().includes(t.value));
      },
    },
    BTD_default_avatars: {
      dropdown: true,
      name: 'Default Profile Pictures',
      descriptor: 'users having a default profile picture',
      placeholder: 'Write something random here',
      function(t, e) {
        if (!e.user) return true;

        return !(e.user.profileImageURL.includes('default'));
      },
    },
    BTD_follower_count: {
      dropdown: true,
      name: 'Follower count less than',
      descriptor: 'users having less followers than',
      placeholder: 'Enter a number',
      function(t, e) {
        if (!e.user) return true;

        return !(e.user.followersCount < parseInt(t.value, 10));
      },
    },
  };

  // Custom pass function to apply our filters
  TD.vo.Filter.prototype.pass = function pass(e) {
    if (this.type.startsWith('BTD')) {
      const t = this;
      e = this._getFilterTarget(e);

      return BTD.Filters[this.type].function(t, e);
    }
    return this._pass(e);
  };

  // Custom display type function to show proper description in filter list
  TD.vo.Filter.prototype.getDisplayType = function getDisplayType() {
    if (BTD.Filters[this.type] !== undefined) {
      return BTD.Filters[this.type].descriptor;
    }
    return this._getDisplayType();
  };

  // Helper function to build <option>s for the custom filters
  BTD.filterDropdown = function filterDropdown() {
    const filters = Object.keys(BTD.Filters);
    let filterString = '';

    filters.forEach((filter) => {
      const fil = BTD.Filters[filter];
      if (fil.dropdown) {
        filterString += `<option value="${filter}">{{_i}}${fil.name}{{/i}}</option>`;
      }
    });

    return filterString;
  };

  $(document).on('change', '.js-filter-types', (e) => {
    e.preventDefault();

    const options = e.target.options;
    const filter = e.target.options[options.selectedIndex].value;

    if (filter.startsWith('BTD')) {
      $('.js-filter-input').attr('placeholder', BTD.Filters[filter].placeholder);
    }
  });

  // Add our custom filters to the filter dropdown
  TD.mustaches['settings/global_setting_filter.mustache'] = TD.mustaches['settings/global_setting_filter.mustache']
    .replace(
      '</select>',
      `${BTD.filterDropdown()}</select>`,
    );
}
