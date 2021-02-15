import {css} from '@emotion/css';
import React, {PropsWithChildren} from 'react';

import {settingsRow, settingsRowTitle} from '../settingsStyles';
import {SettingsCheckboxSelect, SettingsCheckboxSelectProps} from './settingsCheckboxSelect';

interface CheckboxSelectSettingsRowProps extends SettingsCheckboxSelectProps {}

export function CheckboxSelectSettingsRow(
  props: PropsWithChildren<CheckboxSelectSettingsRowProps>
) {
  return (
    <div
      className={css`
        ${settingsRow};
        align-items: flex-start;
      `}>
      <span className={settingsRowTitle}>{props.children}</span>
      <div
        className={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
        `}>
        <SettingsCheckboxSelect
          fields={props.fields}
          onChange={props.onChange}></SettingsCheckboxSelect>
      </div>
    </div>
  );
}
