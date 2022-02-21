import {css, cx} from '@emotion/css';
import React, {ReactNode} from 'react';

import {settingsDisabled} from '../settingsStyles';
import {SettingsTextarea, SettingsTextInput, SettingsTextInputProps} from './settingsTextInput';

interface SettingsTextInputWithAnnotationProps extends SettingsTextInputProps {
  annotation: ReactNode;
}

export function SettingsTextareaWithAnnotation(props: SettingsTextInputWithAnnotationProps) {
  return (
    <div
      className={cx(
        css`
          display: flex;
          align-items: flex-start;
        `,
        props.isDisabled && settingsDisabled,
        props.className
      )}>
      <SettingsTextarea
        value={props.value}
        onChange={props.onChange}
        isDisabled={props.isDisabled}
        placeholder={props.placeholder}></SettingsTextarea>
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

export function SettingsTextInputWithAnnotation(props: SettingsTextInputWithAnnotationProps) {
  return (
    <div
      className={cx(
        css`
          display: flex;
          align-items: center;
        `,
        props.isDisabled && settingsDisabled,
        props.className
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
