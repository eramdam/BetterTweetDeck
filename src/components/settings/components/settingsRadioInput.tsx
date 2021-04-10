import {css} from '@emotion/css';
import React, {PropsWithChildren} from 'react';

import {Handler} from '../../../helpers/typeHelpers';
import {generateInputId} from '../settingsHelpers';

const mainInputStyles = css`
  appearance: none;
  width: 15px;
  height: 15px;
  border: 1px solid var(--twitter-blue);
  background: transparent;
  outline: 0;
  border-radius: 100%;

  &:checked {
    box-shadow: inset 0 0 0 3px var(--settings-modal-background),
      inset 0 0 0 8px var(--twitter-blue);
  }
`;

interface SettingsRadioSelectFieldProps {
  name: string;
  id: string;
  defaultChecked: boolean;
  onChange: Handler;
}
export function SettingsRadioInput(props: PropsWithChildren<SettingsRadioSelectFieldProps>) {
  const inputId = generateInputId();
  return (
    <span>
      <input
        name={props.name}
        type="radio"
        id={inputId}
        checked={props.defaultChecked}
        className={mainInputStyles}
        onChange={props.onChange}
      />
      <label htmlFor={inputId}>{props.children}</label>
    </span>
  );
}
