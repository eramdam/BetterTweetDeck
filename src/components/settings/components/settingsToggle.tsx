import {css} from 'emotion';
import React from 'react';

import {HandlerOf} from '../../../helpers/typeHelpers';

interface SettingsToggleProps {
  onChange: HandlerOf<boolean>;
  defaultChecked: boolean;
  id: string;
  name: string;
}

const toggleInput = css`
  display: none;
`;

const toggleLabel = css`
  display: inline-block;
  box-shadow: inset 0 0 0 2px var(--twitter-blue);
  border-radius: 20px;
  height: 20px;
  width: 40px;
  position: relative;
  overflow: hidden;

  input:checked + & {
    background: var(--twitter-blue);
  }

  &:after {
    content: '';
    color: black;
    position: absolute;
    display: block;
    left: 0;
    top: 0;
    background: var(--settings-modal-background);
    border: 2px solid var(--twitter-blue);
    border-radius: 50%;
    height: 20px;
    width: 20px;
  }

  input:checked + &:after {
    transform: translateX(20px);
  }

  span {
    height: 100%;
    position: absolute;
    width: 100%;
  }
`;

export function SettingsToggle(props: SettingsToggleProps) {
  return (
    <div
      className={css`
        margin-top: 5px;
      `}>
      <input
        className={toggleInput}
        type="checkbox"
        defaultChecked={props.defaultChecked}
        onChange={(e) => {
          props.onChange(e.target.checked);
        }}
        id={props.id}
        name={props.name}
      />
      <label className={toggleLabel} htmlFor={props.id}></label>
    </div>
  );
}
