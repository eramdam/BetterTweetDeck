import {css, cx} from '@emotion/css';
import React from 'react';
import {PropsWithChildren} from 'react';

import {settingsDisabled, settingsRow, settingsRowTitle} from '../settingsStyles';

type SettingsRowProps = PropsWithChildren<{className?: string}>;

export function SettingsRow(
  props: SettingsRowProps & {disabled?: boolean; stretch?: boolean; noPaddingTop?: boolean}
) {
  const stretch = props.stretch ?? true;
  return (
    <div
      className={cx(
        settingsRow,
        props.className,
        props.disabled && settingsDisabled,
        props.noPaddingTop &&
          css`
            padding-top: 0;
          `,
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
  return <div className={cx(props.className, 'settings-row-content')}>{props.children}</div>;
}
