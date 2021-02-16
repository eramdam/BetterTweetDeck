import React from 'dom-chef';

import {DCFactory} from '../helpers/domHelpers';
import {Handler} from '../helpers/typeHelpers';

export interface SettingsButtonProps {
  onClick: Handler;
}

export const makeSettingsButton: DCFactory<SettingsButtonProps> = (props) => {
  return (
    <a
      className="js-show-drawer js-header-action link-clean cf app-nav-tab padding-h--10 padding-v--2"
      data-title="Better TweetDeck Settings"
      data-drawer="btdSettings"
      onClick={props.onClick}>
      <div className="obj-left margin-l--2">
        <i className="icon icon-sliders icon-medium position-rel" />
      </div>
      <div className="nbfc padding-ts hide-condensed txt-size--14 txt-bold app-nav-tab-text">
        BTD Settings
      </div>
    </a>
  );
};
