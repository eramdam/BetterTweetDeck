import {css} from '@emotion/css';
import React, {ReactNode} from 'react';
import {SettingsTextInput, SettingsTextInputProps} from './settingsTextInput';

interface SettingsTimeFormatInputProps extends SettingsTextInputProps {
  preview: ReactNode;
}

export function SettingsTimeFormatInput(props: SettingsTimeFormatInputProps) {
  return (
    <div
      className={css`
        display: flex;
        align-items: center;
      `}>
      <SettingsTextInput
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}></SettingsTextInput>
      <small
        className={css`
          margin-left: 10px;
        `}>
        {props.preview}
      </small>
    </div>
  );
}
