import {css, cx} from '@emotion/css';
import React, {PropsWithChildren} from 'react';

import {settingsDisabled, settingsRow, settingsRowTitle} from '../settingsStyles';
import {SettingsCheckboxSelect, SettingsCheckboxSelectProps} from './settingsCheckboxSelect';

interface CheckboxSelectSettingsRowProps extends SettingsCheckboxSelectProps {}

export function CheckboxSelectSettingsRow(
  props: PropsWithChildren<CheckboxSelectSettingsRowProps>
) {
  return (
    <div
      className={cx(
        css`
          ${settingsRow};
          align-items: flex-start;
        `,
        props.disabled && settingsDisabled
      )}>
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
