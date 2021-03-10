import React, {ReactNode} from 'react';

import {HandlerOf, Renderer} from '../../helpers/typeHelpers';
import {BTDSettings} from '../../types/betterTweetDeck/btdSettingsTypes';
import {getTransString, Trans} from '../trans';
import {SettingsCssEditor} from './components/settingsCssEditor';
import {renderGeneralSettings} from './menu/settingsGeneral';
import {renderThemeSettings} from './menu/settingsTheme';
import {renderTweetActionsSettings} from './menu/settingsTweetActions';
import {renderTweetDisplaySettings} from './menu/settingsTweetsDisplay';
import {SettingsMenuRenderer} from './settingsComponents';

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
                onChange={makeOnSettingsChange('customCss')}
                onErrorChange={setEditorHasErrors}
                value={settings.customCss}></SettingsCssEditor>
            );
          },
        },
      ],
    },
  ];
};
