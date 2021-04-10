import React, {Fragment} from 'react';

import {BTDScrollbarsMode} from '../../../features/changeScrollbars';
import {BetterTweetDeckThemes} from '../../../features/themeTweaks';
import {getTransString, Trans} from '../../trans';
import {CheckboxSelectSettingsRow} from '../components/checkboxSelectSettingsRow';
import {CustomAccentColor} from '../components/customAccentColor';
import {BTDRadioSelectSettingsRow} from '../components/radioSelectSettingsRow';
import {ThemeSelector} from '../components/themeSelector';
import {SettingsMenuRenderer} from '../settingsComponents';

export const renderThemeSettings: SettingsMenuRenderer = (
  settings,
  makeOnSettingsChange,
  _setEditorHasErrors
) => {
  return (
    <Fragment>
      <CustomAccentColor
        initialValue={settings.customAccentColor}
        onChange={makeOnSettingsChange('customAccentColor')}></CustomAccentColor>
      <ThemeSelector
        initialValue={settings.theme}
        onlyDark
        onChange={(value) => {
          if (value === 'light') {
            makeOnSettingsChange('theme')(BetterTweetDeckThemes.LIGHT);
          } else {
            makeOnSettingsChange('theme')(value);
          }
        }}></ThemeSelector>
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
