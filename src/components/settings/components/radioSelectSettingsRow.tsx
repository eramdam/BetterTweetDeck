import {css} from '@emotion/css';
import React, {PropsWithChildren} from 'react';

import {BTDSettings} from '../../../types/btdSettingsTypes';
import {useSettingsSearch} from '../settingsContext';
import {reactElementToString} from '../settingsHelpers';
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
  const {renderAndAddtoIndex} = useSettingsSearch();
  return renderAndAddtoIndex({
    key: props.settingsKey,
    keywords: props.fields.map((f) => reactElementToString(f.label)),
    render: (newSettings) =>
      RadioSelectSettingsRow({...props, initialValue: newSettings[props.settingsKey]}),
  });
}
