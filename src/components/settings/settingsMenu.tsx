import React, {ReactNode} from 'react';

import {HandlerOf, Renderer} from '../../helpers/typeHelpers';
import {getExtensionVersion} from '../../helpers/webExtensionHelpers';
import {BTDSettings} from '../../types/betterTweetDeck/btdSettingsTypes';
import {getTransString, Trans} from '../trans';
import {SettingsCssEditor} from './components/settingsCssEditor';
import {ExportSettings} from './menu/settingsExport';
import {renderGeneralSettings} from './menu/settingsGeneral';
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
    label: ReactNode;
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
          id: 'theme-tweaks',
          label: getTransString('settings_theme'),
          render: () => renderThemeSettings(...rendererArguments),
        },
        {
          id: 'tweets-display',
          label: <Trans id="settings_tweets_display" />,
          render: () => renderTweetDisplaySettings(...rendererArguments),
        },
        {
          id: 'tweet-actions',
          label: <Trans id="settings_tweet_actions" />,
          render: () => renderTweetActionsSettings(...rendererArguments),
        },
        {
          id: 'custom-css',
          label: <Trans id="settings_custom_css" />,
          render: () => {
            return (
              <SettingsCssEditor
                onChange={(val) => makeOnSettingsChange('customCss')(val.trim())}
                onErrorChange={setEditorHasErrors}
                value={settings.customCss}></SettingsCssEditor>
            );
          },
        },
      ],
    },
    {
      title: 'Meta',
      id: 'meta',
      items: [
        {
          id: 'support',
          label: <Trans id="settings_support" />,
          render: () => (
            <div className={settingsRegularText}>
              <div>
                <h3>Browser and extension informations</h3>
                <ul>
                  <li>Version: {getExtensionVersion()}</li>
                  <li>User agent: {navigator.userAgent}</li>
                </ul>
              </div>
            </div>
          ),
        },
        {
          id: 'import-export',
          label: 'Import / Export',
          render: () => <ExportSettings settings={settings} onNewSettings={setSettings} />,
        },
      ],
    },
  ];
};
