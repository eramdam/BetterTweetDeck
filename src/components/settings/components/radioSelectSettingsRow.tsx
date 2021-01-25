import {css} from 'emotion';
import React, {PropsWithChildren} from 'react';

import {AbstractTweetDeckSettings} from '../../../types/abstractTweetDeckSettings';
import {BTDSettings} from '../../../types/betterTweetDeck/btdSettingsTypes';
import {settingsRow, settingsRowTitle} from '../settingsStyles';
import {SettingsRadioSettingSelect, SettingsRadioSettingsSelectProps} from './settingsRadioSelect';

function RadioSelectSettingsRow<S extends object, T extends keyof S>(
  props: PropsWithChildren<SettingsRadioSettingsSelectProps<S, T>>
) {
  return (
    <div
      className={css`
        ${settingsRow};
        align-items: flex-start;

        & + & {
          padding-top: 30px;
        }
      `}>
      <span className={settingsRowTitle}>{props.children}</span>
      <div
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
      </div>
    </div>
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
