import {css} from '@emotion/css';
import React, {PropsWithChildren} from 'react';

import {HandlerOf} from '../../../helpers/typeHelpers';
import {maybeAlignToTheLeft, settingsRow, settingsRowTitle} from '../settingsStyles';
import {SettingsToggle} from './settingsToggle';

interface BooleanSettingsRowProps {
  initialValue: boolean;
  onChange: HandlerOf<boolean>;
  settingsKey: string;
  alignToTheLeft?: boolean;
}

export function BooleanSettingsRow(props: PropsWithChildren<BooleanSettingsRowProps>) {
  return (
    <div
      className={css`
        ${settingsRow};
        ${maybeAlignToTheLeft(props.alignToTheLeft)}
      `}>
      <span className={settingsRowTitle}></span>
      <div
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
      </div>
    </div>
  );
}
