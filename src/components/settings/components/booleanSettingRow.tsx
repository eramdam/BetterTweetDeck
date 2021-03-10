import {css, cx} from '@emotion/css';
import React, {PropsWithChildren} from 'react';

import {HandlerOf} from '../../../helpers/typeHelpers';
import {maybeAlignToTheLeft, settingsDisabled} from '../settingsStyles';
import {SettingsRow, SettingsRowContent, SettingsRowTitle} from './settingsRow';
import {SettingsToggle} from './settingsToggle';

interface BooleanSettingsRowProps {
  initialValue: boolean;
  onChange: HandlerOf<boolean>;
  settingsKey: string;
  alignToTheLeft?: boolean;
  disabled?: boolean;
}

export function BooleanSettingsRow(props: PropsWithChildren<BooleanSettingsRowProps>) {
  return (
    <SettingsRow
      className={cx(maybeAlignToTheLeft(props.alignToTheLeft), props.disabled && settingsDisabled)}>
      <SettingsRowTitle></SettingsRowTitle>
      <SettingsRowContent
        className={css`
          display: flex;
          align-items: center;
        `}>
        <SettingsToggle
          id={props.settingsKey}
          name={props.settingsKey}
          defaultChecked={props.initialValue}
          onChange={props.onChange}>
          {props.children}
        </SettingsToggle>
      </SettingsRowContent>
    </SettingsRow>
  );
}