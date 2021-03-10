import {css} from '@emotion/css';
import React, {Fragment} from 'react';

import {BTDTimestampFormats} from '../../../features/changeTimestampFormat';
import {BTDUsernameFormat} from '../../../features/usernameDisplay';
import {getTransString, Trans} from '../../trans';
import {BooleanSettingsRow} from '../components/booleanSettingRow';
import {BTDRadioSelectSettingsRow} from '../components/radioSelectSettingsRow';
import {SettingsButton} from '../components/settingsButton';
import {SettingsRow, SettingsRowTitle} from '../components/settingsRow';
import {SettingsSeparator} from '../components/settingsSeparator';
import {SettingsTimeFormatInput} from '../components/settingsTimeFormatInput';
import {formatDateTime, SettingsMenuRenderer} from '../settingsComponents';

export const renderTweetDisplaySettings: SettingsMenuRenderer = (
  settings,
  makeOnSettingsChange,
  _setEditorHasErrors
) => {
  return (
    <Fragment>
      <BTDRadioSelectSettingsRow
        settingsKey="timestampStyle"
        initialValue={settings.timestampStyle}
        onChange={makeOnSettingsChange('timestampStyle')}
        fields={[
          {
            label: getTransString('settings_timestamp_relative'),
            value: BTDTimestampFormats.RELATIVE,
          },
          {
            label: getTransString('settings_timestamp_custom'),
            value: BTDTimestampFormats.CUSTOM,
          },
        ]}>
        <Trans id="settings_date_format" />
      </BTDRadioSelectSettingsRow>
      <SettingsRow disabled={settings.timestampStyle === BTDTimestampFormats.RELATIVE}>
        <span></span>
        <SettingsTimeFormatInput
          value={settings.timestampShortFormat}
          onChange={makeOnSettingsChange('timestampShortFormat')}
          preview={formatDateTime(settings.timestampShortFormat)}></SettingsTimeFormatInput>
      </SettingsRow>
      <BooleanSettingsRow
        disabled={settings.timestampStyle === BTDTimestampFormats.RELATIVE}
        alignToTheLeft
        settingsKey="fullTimestampAfterDay"
        initialValue={settings.fullTimestampAfterDay}
        onChange={makeOnSettingsChange('fullTimestampAfterDay')}>
        <Trans id="settings_short_time_after_24h" />
      </BooleanSettingsRow>
      <SettingsRow
        disabled={
          settings.timestampStyle === BTDTimestampFormats.RELATIVE ||
          !settings.fullTimestampAfterDay
        }>
        <span></span>
        <SettingsTimeFormatInput
          value={settings.timestampFullFormat}
          onChange={makeOnSettingsChange('timestampFullFormat')}
          preview={formatDateTime(settings.timestampFullFormat)}></SettingsTimeFormatInput>
      </SettingsRow>
      <SettingsRow
        className={css`
          align-items: flex-start;
        `}>
        <SettingsRowTitle>
          <Trans id="settings_timestamp_presets" />
        </SettingsRowTitle>
        <div
          className={css`
            display: inline-block;
            margin-left: -10px;

            > button {
              margin-bottom: 10px;
              margin-left: 10px;
            }
          `}>
          <SettingsButton
            onClick={() => {
              makeOnSettingsChange('timestampStyle')(BTDTimestampFormats.CUSTOM);
              makeOnSettingsChange('fullTimestampAfterDay')(true);
              makeOnSettingsChange('timestampShortFormat')('HH:mm');
              makeOnSettingsChange('timestampFullFormat')('dd/MM/yy HH:mm');
            }}>
            <Trans id="settings_timestamp_preset_absolute" />
          </SettingsButton>
          <SettingsButton
            onClick={() => {
              makeOnSettingsChange('timestampStyle')(BTDTimestampFormats.CUSTOM);
              makeOnSettingsChange('fullTimestampAfterDay')(true);
              makeOnSettingsChange('timestampShortFormat')('hh:mm');
              makeOnSettingsChange('timestampFullFormat')('MM/dd/yy hh:mm');
            }}>
            <Trans id="settings_timestamp_preset_absolute_us" />
          </SettingsButton>
        </div>
      </SettingsRow>
      <SettingsSeparator></SettingsSeparator>
      <BTDRadioSelectSettingsRow
        settingsKey="usernamesFormat"
        initialValue={settings.usernamesFormat}
        onChange={makeOnSettingsChange('usernamesFormat')}
        fields={[
          {
            label: <Trans id="settings_fullname_username" />,
            value: BTDUsernameFormat.DEFAULT,
          },
          {
            label: <Trans id="settings_username_fullname" />,
            value: BTDUsernameFormat.USER_FULL,
          },
          {label: <Trans id="settings_username" />, value: BTDUsernameFormat.USER},
          {label: <Trans id="settings_fullname" />, value: BTDUsernameFormat.FULL},
        ]}>
        <Trans id="settings_name_display_style" />
      </BTDRadioSelectSettingsRow>
    </Fragment>
  );
};
