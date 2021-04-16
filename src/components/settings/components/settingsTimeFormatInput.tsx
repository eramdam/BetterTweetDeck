import {css, cx} from '@emotion/css';
import React, {ReactNode} from 'react';

import {settingsDisabled} from '../settingsStyles';
import {SettingsTextInput, SettingsTextInputProps} from './settingsTextInput';

interface SettingsTimeFormatInputProps extends SettingsTextInputProps {
  annotation: ReactNode;
}

export function SettingsTextInputWithAnnotation(props: SettingsTimeFormatInputProps) {
  return (
    <div
      className={cx(
        css`
          display: flex;
          align-items: center;
        `,
        props.isDisabled && settingsDisabled
      )}>
      <SettingsTextInput
        value={props.value}
        onChange={props.onChange}
        isDisabled={props.isDisabled}
        placeholder={props.placeholder}></SettingsTextInput>
      <small
        className={css`
          margin-left: 10px;
          font-size: 13px;
        `}>
        {props.annotation}
      </small>
    </div>
  );
}
