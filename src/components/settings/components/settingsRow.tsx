import {css, cx} from '@emotion/css';
import React from 'react';
import {PropsWithChildren} from 'react';

import {settingsDisabled, settingsRow, settingsRowTitle} from '../settingsStyles';

type SettingsRowProps = PropsWithChildren<{className?: string}>;

export function SettingsRow(props: SettingsRowProps & {disabled?: boolean; stretch?: boolean}) {
  const stretch = props.stretch ?? true;
  return (
    <div
      className={cx(
        settingsRow,
        props.className,
        props.disabled && settingsDisabled,
        !stretch &&
          css`
            justify-content: flex-start;
          `
      )}>
      {props.children}
    </div>
  );
}
export function SettingsRowTitle(props: SettingsRowProps) {
  return <h3 className={cx(settingsRowTitle, props.className)}>{props.children}</h3>;
}
export function SettingsRowContent(props: SettingsRowProps) {
  return <div className={cx(props.className)}>{props.children}</div>;
}
