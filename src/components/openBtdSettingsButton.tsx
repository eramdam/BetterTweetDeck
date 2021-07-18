import React from 'react';

export const BTDSettingsButton = () => {
  return (
    <a
      className="js-show-drawer js-header-action link-clean cf app-nav-tab padding-h--10 padding-v--2"
      data-btd-settings-button
      data-title="BTD Settings">
      <div className="obj-left margin-l--2">
        <i className="icon icon-sliders icon-medium position-rel"></i>
      </div>
      <div className="nbfc padding-ts hide-condensed txt-size--14 txt-bold app-nav-tab-text">
        BTD Settings
      </div>
    </a>
  );
};
