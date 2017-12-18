export default function () {
  // Save references of original functions
  TD.vo.Filter.prototype._getDisplayType = TD.vo.Filter.prototype.getDisplayType;
  TD.vo.Filter.prototype._pass = TD.vo.Filter.prototype.pass;

  // If we're running in debug mode, this already exists
  if (window.BTD === undefined) {
    window.BTD = {};
  }

  // Custom filters
  BTD.Filters = {
    BTD_is_retweet_from: {
      dropdown: true,
      name: 'Retweets from User (without @)',
      descriptor: 'retweets from',
      function(t, e) {
        return !(e.isRetweetedStatus() && (t.value === e.user.screenName.toLowerCase()));
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

  // Add our custom filters to the filter dropdown
  TD.mustaches['settings/global_setting_filter.mustache'] = TD.mustaches['settings/global_setting_filter.mustache']
    .replace(
      '</select>',
      `${BTD.filterDropdown()}</select>`,
    );
}
