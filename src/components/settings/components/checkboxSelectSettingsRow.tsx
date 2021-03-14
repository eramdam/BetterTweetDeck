import {css, cx} from '@emotion/css';
import React, {PropsWithChildren} from 'react';

import {SettingsCheckboxSelect, SettingsCheckboxSelectProps} from './settingsCheckboxSelect';
import {SettingsRow, SettingsRowContent, SettingsRowTitle} from './settingsRow';

interface CheckboxSelectSettingsRowProps extends SettingsCheckboxSelectProps {}

export function CheckboxSelectSettingsRow(
  props: PropsWithChildren<CheckboxSelectSettingsRowProps>
) {
  return (
    <SettingsRow className={cx(css``)} disabled={props.disabled}>
      <SettingsRowTitle>{props.children}</SettingsRowTitle>
      <SettingsRowContent
        className={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
        `}>
        <SettingsCheckboxSelect
          fields={props.fields}
          onChange={props.onChange}></SettingsCheckboxSelect>
      </SettingsRowContent>
    </SettingsRow>
  );
}
