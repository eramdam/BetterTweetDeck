/* eslint-disable react/jsx-key */
import {css} from '@emotion/css';
import React, {FC, Fragment} from 'react';

import {BTDTimestampFormats} from '../../../features/changeTimestampFormat';
import {BTDUsernameFormat} from '../../../features/usernameDisplay';
import {BTDSettings} from '../../../types/btdSettingsTypes';
import {Trans} from '../../trans';
import {AvatarsShape} from '../components/avatarsShape';
import {BooleanSettingsRow} from '../components/booleanSettingRow';
import {BTDRadioSelectSettingsRow} from '../components/radioSelectSettingsRow';
import {SettingsButton} from '../components/settingsButton';
import {SettingsRow, SettingsRowTitle} from '../components/settingsRow';
import {SettingsSeparator} from '../components/settingsSeparator';
import {SettingsTextInputWithAnnotation} from '../components/settingsTimeFormatInput';
import {formatDateTime, SettingsMenuSectionProps} from '../settingsComponents';
import {useSettingsSearch} from '../settingsContext';
import {reactElementToString} from '../settingsHelpers';

export const SettingsTweetsDisplay: FC<SettingsMenuSectionProps> = (props) => {
  const {makeOnSettingsChange, settings} = props;
  const {renderAndAddtoIndex} = useSettingsSearch();
  const dateTimeSection = (newSettings: BTDSettings) => {
    return (
      <>
        <BTDRadioSelectSettingsRow
          ignoreSearch
          settingsKey="timestampStyle"
          initialValue={newSettings.timestampStyle}
          onChange={makeOnSettingsChange('timestampStyle')}
          fields={[
            {
              label: <Trans id="settings_timestamp_relative" />,
              value: BTDTimestampFormats.RELATIVE,
            },
            {
              label: (
                <>
                  <Trans id="settings_timestamp_custom" />
                  <a
                    className={css`
                      text-decoration: none;
                      font-size: 12px;
                      margin-left: 8px;
                      color: var(--twitter-blue);

                      &:hover {
                        color: var(--twitter-darkblue);
                      }
                    `}
                    href="https://moment.github.io/luxon/#/formatting?id=table-of-tokens"
                    target="_blank"
                    rel="noreferrer noopener">
                    <Trans id="settings_tokens_list" />
                  </a>
                </>
              ),
              value: BTDTimestampFormats.CUSTOM,
            },
          ]}>
          <Trans id="settings_date_format" />
        </BTDRadioSelectSettingsRow>
        <SettingsRow
          disabled={newSettings.timestampStyle === BTDTimestampFormats.RELATIVE}
          stretch={false}>
          <span></span>
          <SettingsTextInputWithAnnotation
            value={newSettings.timestampShortFormat}
            onChange={makeOnSettingsChange('timestampShortFormat')}
            annotation={formatDateTime(
              newSettings.timestampShortFormat
            )}></SettingsTextInputWithAnnotation>
        </SettingsRow>
        <BooleanSettingsRow
          disabled={newSettings.timestampStyle === BTDTimestampFormats.RELATIVE}
          alignToTheLeft
          settingsKey="fullTimestampAfterDay"
          initialValue={newSettings.fullTimestampAfterDay}
          onChange={makeOnSettingsChange('fullTimestampAfterDay')}>
          <Trans id="settings_short_time_after_24h" />
        </BooleanSettingsRow>
        <SettingsRow
          disabled={
            newSettings.timestampStyle === BTDTimestampFormats.RELATIVE ||
            !newSettings.fullTimestampAfterDay
          }>
          <span></span>
          <SettingsTextInputWithAnnotation
            value={newSettings.timestampFullFormat}
            onChange={makeOnSettingsChange('timestampFullFormat')}
            annotation={formatDateTime(
              newSettings.timestampFullFormat
            )}></SettingsTextInputWithAnnotation>
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
                makeOnSettingsChange('timestampShortFormat')('hh:mm a');
                makeOnSettingsChange('timestampFullFormat')('MM/dd/yy hh:mm a');
              }}>
              <Trans id="settings_timestamp_preset_absolute_us" />
            </SettingsButton>
          </div>
        </SettingsRow>
      </>
    );
  };

  return (
    <Fragment>
      {renderAndAddtoIndex({
        keywords: [
          <Trans id="settings_timestamp_relative" />,
          <Trans id="settings_timestamp_custom" />,
          <Trans id="settings_date_format" />,
          <Trans id="settings_short_time_after_24h" />,
          <Trans id="settings_timestamp_presets" />,
          <Trans id="settings_timestamp_preset_absolute" />,
          <Trans id="settings_timestamp_preset_absolute_us" />,
        ].map((t) => reactElementToString(t)),
        key: 'dateTimeSection',
        render: dateTimeSection,
      })}
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
      {renderAndAddtoIndex({
        keywords: [
          <Trans id="settings_avatar_shape" />,
          <Trans id="settings_avatar_square" />,
          <Trans id="settings_avatar_circle" />,
        ].map((t) => reactElementToString(t)),
        key: 'avatarShapes',
        render: (newSettings: BTDSettings) => (
          <AvatarsShape
            initialValue={newSettings.avatarsShape}
            onChange={makeOnSettingsChange('avatarsShape')}></AvatarsShape>
        ),
      })}
    </Fragment>
  );
};
