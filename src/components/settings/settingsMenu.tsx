import React, {ReactNode} from 'react';

import {HandlerOf, Renderer} from '../../helpers/typeHelpers';
import {getExtensionVersion} from '../../helpers/webExtensionHelpers';
import {BTDSettings} from '../../types/btdSettingsTypes';
import {getTransString, Trans} from '../trans';
import {NewFeatureBadgeProps} from './components/newFeatureBadge';
import {SettingsCredits} from './components/settingsCredits';
import {SettingsCss} from './components/settingsCss';
import {SettingsComposer} from './menu/settingsComposer';
import {SettingsGeneral} from './menu/settingsGeneral';
import {ImportExportSettings} from './menu/settingsImportExport';
import {SettingsLogo} from './menu/settingsLogo';
import {SettingsTheme} from './menu/settingsTheme';
import {SettingsTweetActions} from './menu/settingsTweetActions';
import {SettingsTweetsDisplay} from './menu/settingsTweetsDisplay';
import {settingsRegularText} from './settingsStyles';
import {SettingsTweetContent} from './settingsTweetContent';

export enum SettingsMenuSectionsEnum {
  GENERAL = 'general',
  THEME = 'theme',
  LOGO = 'logo',
  TWEETS_DISPLAY = 'tweets-display',
  TWEETS_CONTENT = 'tweets-content',
  TWEET_ACTIONS = 'tweet-actions',
  COMPOSER = 'composer',
  CUSTOM_CSS = 'custom-css',
  SUPPORT = 'support',
  IMPORT_EXPORT = 'import-export',
  CREDITS = 'credits',
  BLANK = '__BLANK__',
}

export interface MenuItem {
  title: ReactNode;
  id: string;
  items: {
    id: SettingsMenuSectionsEnum;
    label: string;
    render: Renderer;
    badgeProps?: NewFeatureBadgeProps;
  }[];
}

export const makeSettingsMenu = (
  settings: BTDSettings,
  makeOnSettingsChange: <T extends keyof BTDSettings>(key: T) => (val: BTDSettings[T]) => void,
  setSettings: HandlerOf<BTDSettings>,
  setEditorHasErrors: HandlerOf<boolean>
): readonly MenuItem[] => {
  const settingsSectionProps = {
    setEditorHasErrors,
    settings,
    makeOnSettingsChange,
  };

  return [
    {
      title: <Trans id="settings_section_settings" />,
      id: 'settings',
      items: [
        {
          id: SettingsMenuSectionsEnum.GENERAL,
          label: getTransString('settings_general'),
          render: () => <SettingsGeneral {...settingsSectionProps}></SettingsGeneral>,
        },
        {
          id: SettingsMenuSectionsEnum.TWEETS_CONTENT,
          label: getTransString('settings_tweet_content'),
          render: () => <SettingsTweetContent {...settingsSectionProps}></SettingsTweetContent>,
        },
        {
          id: SettingsMenuSectionsEnum.THEME,
          label: getTransString('settings_theme'),
          render: () => <SettingsTheme {...settingsSectionProps}></SettingsTheme>,
        },
        {
          id: SettingsMenuSectionsEnum.LOGO,
          label: getTransString('settings_logo_variation'),
          render: () => <SettingsLogo {...settingsSectionProps}></SettingsLogo>,
          badgeProps: {
            introducedIn: '4.1',
          },
        },
        {
          id: SettingsMenuSectionsEnum.TWEETS_DISPLAY,
          label: getTransString('settings_tweets_display'),
          render: () => <SettingsTweetsDisplay {...settingsSectionProps}></SettingsTweetsDisplay>,
        },
        {
          id: SettingsMenuSectionsEnum.TWEET_ACTIONS,
          label: getTransString('settings_tweet_actions'),
          render: () => <SettingsTweetActions {...settingsSectionProps}></SettingsTweetActions>,
        },
        {
          id: SettingsMenuSectionsEnum.COMPOSER,
          label: getTransString('settings_tweet_composer'),
          render: () => <SettingsComposer {...settingsSectionProps}></SettingsComposer>,
        },
        {
          id: SettingsMenuSectionsEnum.CUSTOM_CSS,
          label: getTransString('settings_custom_css'),
          render: () => {
            return <SettingsCss {...settingsSectionProps}></SettingsCss>;
          },
        },
      ],
    },
    {
      title: getTransString('settings_meta'),
      id: 'meta',
      items: [
        {
          id: SettingsMenuSectionsEnum.SUPPORT,
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
          id: SettingsMenuSectionsEnum.IMPORT_EXPORT,
          label: getTransString('settings_import_export'),
          render: () => <ImportExportSettings settings={settings} onNewSettings={setSettings} />,
        },
        {
          id: SettingsMenuSectionsEnum.CREDITS,
          label: getTransString('settings_credits_about'),
          render: () => {
            return <SettingsCredits />;
          },
        },
      ],
    },
  ];
};
