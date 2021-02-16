import {cx} from '@emotion/css';
import React from 'react';
import {PropsWithChildren} from 'react';

import {settingsDisabled, settingsRow, settingsRowTitle} from '../settingsStyles';

type SettingsRowProps = PropsWithChildren<{className?: string}>;

export function SettingsRow(props: SettingsRowProps & {disabled?: boolean}) {
  return (
    <div className={cx(settingsRow, props.className, props.disabled && settingsDisabled)}>
      {props.children}
    </div>
  );
}
export function SettingsRowTitle(props: SettingsRowProps) {
  return <div className={cx(settingsRowTitle, props.className)}>{props.children}</div>;
}
export function SettingsRowContent(props: SettingsRowProps) {
  return <div className={cx(props.className)}>{props.children}</div>;
}
