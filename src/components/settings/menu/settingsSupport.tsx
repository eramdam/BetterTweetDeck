import React, {FC} from 'react';

import {HandlerOf} from '../../../helpers/typeHelpers';
import {getExtensionVersion} from '../../../helpers/webExtensionHelpers';
import {BTDSettings} from '../../../types/btdSettingsTypes';
import {Trans} from '../../trans';
import {settingsRegularText} from '../settingsStyles';

export const SettingsSupport: FC<{
  settings: BTDSettings;
  onNewSettings: HandlerOf<BTDSettings>;
}> = ({onNewSettings, settings}) => {
  return (
    <div className={settingsRegularText}>
      <div>
        <h3>
          <Trans id="settings_browser_and_extension_informations" />
        </h3>
        <ul>
          <li>
            <Trans id="settings_version" /> {getExtensionVersion()}
          </li>
          <li>
            <Trans id="settings_user_agent" /> {navigator.userAgent}
          </li>
        </ul>
        <h3>
          <Trans id="settings_force_update_banners_to_be_dismissed" />
        </h3>
        <p>
          <Trans id="settings_dismiss_banner_paragraph" />
        </p>
        <button
          className="btd-settings-button secondary"
          onClick={() => {
            onNewSettings({
              ...settings,
              needsToShowUpdateBanner: false,
            });
          }}>
          <Trans id="settings_force_dismissed_banner" />
        </button>
      </div>
    </div>
  );
};
