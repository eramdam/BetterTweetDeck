import {css} from '@emotion/css';
import React, {PropsWithChildren} from 'react';

import {Handler} from '../../../helpers/typeHelpers';

const mainInputStyles = css`
  appearance: none;
  width: 15px;
  height: 15px;
  border: 1px solid var(--twitter-blue);
  background: transparent;
  outline: 0;
  border-radius: 100%;

  &:checked,
  &[checked] {
    box-shadow: inset 0 0 0 3px var(--settings-modal-background),
      inset 0 0 0 8px var(--twitter-blue);
  }
`;

interface SettingsRadioSelectFieldProps {
  name: string;
  id: string;
  defaultChecked: boolean;
  onChange: Handler;
  className?: string;
  isDisabled?: boolean;
}
export function SettingsRadioInput(props: PropsWithChildren<SettingsRadioSelectFieldProps>) {
  return (
    <span className={props.className}>
      <input
        name={props.name}
        type="radio"
        id={props.id}
        defaultChecked={props.defaultChecked}
        className={mainInputStyles}
        onChange={props.onChange}
        disabled={props.isDisabled}
      />
      <label htmlFor={props.id}>{props.children}</label>
    </span>
  );
}
