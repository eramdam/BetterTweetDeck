import {css, cx} from '@emotion/css';
import React from 'react';

import {HandlerOf} from '../../../helpers/typeHelpers';

export interface SettingsTextInputProps {
  placeholder?: string;
  className?: string;
  value: string;
  onChange: HandlerOf<string>;
  isDisabled?: boolean;
}

const commonStyles = css`
  background: var(--twitter-input-bg);
  color: var(--settings-modal-text);
  border: 1px solid var(--twitter-input-border-color);
  display: inline-block;
  padding: 4px 8px;
  font-size: 13px;
  line-height: 18px;
  border-radius: 4px;
  min-width: 200px;

  &::placeholder {
    color: var(--twitter-input-placeholder);
  }

  &:focus {
    outline: 0;
    border-color: rgba(29, 161, 242, 0.8);
    box-shadow: inset 0 1px 3px rgba(20, 23, 26, 0.1), 0 0 8px rgba(29, 161, 242, 0.6);
  }
`;

export function SettingsTextarea(props: SettingsTextInputProps) {
  return (
    <textarea
      className={cx(
        commonStyles,
        props.className,
        css`
          min-height: 50px;
          max-height: 400px;
          min-width: 400px;
          max-width: 80%;
        `
      )}
      onChange={(e) => props.onChange(e.target.value)}
      value={props.value}
      placeholder={props.placeholder}
      disabled={props.isDisabled}
    />
  );
}

export function SettingsTextInput(props: SettingsTextInputProps) {
  return (
    <input
      className={cx(commonStyles, props.className)}
      type="text"
      onChange={(e) => props.onChange(e.target.value)}
      value={props.value}
      placeholder={props.placeholder}
      disabled={props.isDisabled}
    />
  );
}
