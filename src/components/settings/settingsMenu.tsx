import React, {ReactNode} from 'react';

import {HandlerOf, Renderer} from '../../helpers/typeHelpers';
import {getExtensionVersion} from '../../helpers/webExtensionHelpers';
import {BTDSettings} from '../../types/btdSettingsTypes';
import {getTransString, Trans} from '../trans';
import {SettingsCredits} from './components/settingsCredits';
import {SettingsCssEditor} from './components/settingsCssEditor';
import {renderGeneralSettings} from './menu/settingsGeneral';
import {ImportExportSettings} from './menu/settingsImportExport';
import {renderThemeSettings} from './menu/settingsTheme';
import {renderTweetActionsSettings} from './menu/settingsTweetActions';
import {renderTweetDisplaySettings} from './menu/settingsTweetsDisplay';
import {SettingsMenuRenderer} from './settingsComponents';
import {settingsRegularText} from './settingsStyles';

interface MenuItem {
  title: ReactNode;
  id: string;
  items: {
    id: string;
    label: string;
    render: Renderer;
  }[];
}

export const makeSettingsMenu = (
  settings: BTDSettings,
  makeOnSettingsChange: <T extends keyof BTDSettings>(key: T) => (val: BTDSettings[T]) => void,
  setSettings: HandlerOf<BTDSettings>,
  setEditorHasErrors: HandlerOf<boolean>
): readonly MenuItem[] => {
  const rendererArguments: Parameters<SettingsMenuRenderer> = [
    settings,
    makeOnSettingsChange,
    setEditorHasErrors,
  ];

  return [
    {
      title: <Trans id="settings_section_settings" />,
      id: 'settings',
      items: [
        {
          id: 'general',
          label: getTransString('settings_general'),
          render: () => renderGeneralSettings(...rendererArguments),
        },
        {
          id: 'theme',
          label: getTransString('settings_theme'),
          render: () => renderThemeSettings(...rendererArguments),
        },
        {
          id: 'tweets-display',
          label: getTransString('settings_tweets_display'),
          render: () => renderTweetDisplaySettings(...rendererArguments),
        },
        {
          id: 'tweet-actions',
          label: getTransString('settings_tweet_actions'),
          render: () => renderTweetActionsSettings(...rendererArguments),
        },
        {
          id: 'custom-css',
          label: getTransString('settings_custom_css'),
          render: () => {
            return (
              <SettingsCssEditor
                onChange={(val) => makeOnSettingsChange('customCss')(val)}
                onErrorChange={setEditorHasErrors}
                value={settings.customCss}></SettingsCssEditor>
            );
          },
        },
      ],
    },
    {
      title: getTransString('settings_meta'),
      id: 'meta',
      items: [
        {
          id: 'support',
          label: getTransString('settings_support'),
          render: () => (
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
              </div>
            </div>
          ),
        },
        {
          id: 'import-export',
          label: getTransString('settings_import_export'),
          render: () => <ImportExportSettings settings={settings} onNewSettings={setSettings} />,
        },
        {
          id: 'credits',
          label: getTransString('settings_credits_about'),
          render: () => {
            return <SettingsCredits />;
          },
        },
      ],
    },
  ];
};
