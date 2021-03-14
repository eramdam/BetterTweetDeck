import {css} from '@emotion/css';
import React, {PropsWithChildren} from 'react';

import {AbstractTweetDeckSettings} from '../../../types/abstractTweetDeckSettings';
import {BTDSettings} from '../../../types/btdSettingsTypes';
import {SettingsRadioSettingSelect, SettingsRadioSettingsSelectProps} from './settingsRadioSelect';
import {SettingsRow, SettingsRowContent, SettingsRowTitle} from './settingsRow';

function RadioSelectSettingsRow<S extends object, T extends keyof S>(
  props: PropsWithChildren<SettingsRadioSettingsSelectProps<S, T>>
) {
  return (
    <SettingsRow
      className={css`
        align-items: flex-start;

        & + & {
          padding-top: 30px;
        }
      `}>
      <SettingsRowTitle>{props.children}</SettingsRowTitle>
      <SettingsRowContent
        className={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
        `}>
        <SettingsRadioSettingSelect<S, T>
          settingsKey={props.settingsKey}
          onChange={props.onChange}
          initialValue={props.initialValue}
          fields={props.fields}
        />
      </SettingsRowContent>
    </SettingsRow>
  );
}

export function BTDRadioSelectSettingsRow<T extends keyof BTDSettings>(
  props: PropsWithChildren<SettingsRadioSettingsSelectProps<BTDSettings, T>>
) {
  return RadioSelectSettingsRow(props);
}

export function TDRadioSelectSettingsRow<T extends keyof AbstractTweetDeckSettings>(
  props: PropsWithChildren<SettingsRadioSettingsSelectProps<AbstractTweetDeckSettings, T>>
) {
  return RadioSelectSettingsRow(props);
}
