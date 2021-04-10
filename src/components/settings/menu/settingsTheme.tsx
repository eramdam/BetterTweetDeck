import React, {FC, Fragment} from 'react';

import {BTDScrollbarsMode} from '../../../features/changeScrollbars';
import {BetterTweetDeckThemes} from '../../../features/themeTweaks';
import {getTransString, Trans} from '../../trans';
import {CheckboxSelectSettingsRow} from '../components/checkboxSelectSettingsRow';
import {CustomAccentColor} from '../components/customAccentColor';
import {BTDRadioSelectSettingsRow} from '../components/radioSelectSettingsRow';
import {ThemeSelector} from '../components/themeSelector';
import {SettingsMenuSectionProps} from '../settingsComponents';
import {useSettingsSearch} from '../settingsContext';
import {reactElementToString} from '../settingsHelpers';

export const SettingsTheme: FC<SettingsMenuSectionProps> = (props) => {
  const {settings, makeOnSettingsChange} = props;
  const {renderAndAddtoIndex} = useSettingsSearch();

  const accentColor = (
    <CustomAccentColor
      initialValue={settings.customAccentColor}
      onChange={makeOnSettingsChange('customAccentColor')}></CustomAccentColor>
  );

  const themeSelector = (
    <ThemeSelector
      initialValue={settings.theme}
      onChange={(value) => {
        if (value === 'light') {
          makeOnSettingsChange('theme')(BetterTweetDeckThemes.LIGHT);
        } else {
          makeOnSettingsChange('theme')(value);
        }
      }}></ThemeSelector>
  );

  return (
    <Fragment>
      {renderAndAddtoIndex({
        keywords: [reactElementToString(<Trans id="settings_accent_color" />)],
        key: 'accentColor',
        render: () => accentColor,
      })}
      {renderAndAddtoIndex({
        keywords: [
          getTransString('settings_theme'),
          getTransString('settings_light'),
          getTransString('settings_dark_theme'),
          getTransString('settings_old_gray'),
          getTransString('settings_super_black'),
        ],
        key: 'theme',
        render: () => themeSelector,
      })}
      <CheckboxSelectSettingsRow
        onChange={(_key, value) => {
          makeOnSettingsChange('enableAutoThemeSwitch')(value);
        }}
        disabled={settings.theme === BetterTweetDeckThemes.LIGHT}
        fields={[
          {
            introducedIn: '4',
            initialValue: settings.enableAutoThemeSwitch,
            key: 'enableAutoThemeSwitch',
            label: getTransString('settings_auto_switch_light_theme'),
          },
        ]}></CheckboxSelectSettingsRow>

      <BTDRadioSelectSettingsRow
        settingsKey="scrollbarsMode"
        initialValue={settings.scrollbarsMode}
        onChange={makeOnSettingsChange('scrollbarsMode')}
        fields={[
          {
            label: getTransString('settings_scrollbar_default'),
            value: BTDScrollbarsMode.DEFAULT,
          },
          {
            label: getTransString('settings_scrollbar_thin'),
            value: BTDScrollbarsMode.SLIM,
          },
          {
            label: getTransString('settings_scrollbar_hidden'),
            value: BTDScrollbarsMode.HIDDEN,
          },
        ]}>
        <Trans id="settings_style_of_scrollbars" />
      </BTDRadioSelectSettingsRow>
    </Fragment>
  );
};
