import {css} from '@emotion/css';
import React, {PropsWithChildren} from 'react';

import {HandlerOf} from '../../../helpers/typeHelpers';
import {checkboxInputStyles} from '../settingsStyles';

interface SettingsToggleProps {
  onChange: HandlerOf<boolean>;
  defaultChecked: boolean;
  id: string;
  name: string;
}

export function SettingsToggle(props: PropsWithChildren<SettingsToggleProps>) {
  return (
    <div
      className={css`
        margin-top: 5px;
        display: grid;
        grid-auto-flow: column;
        grid-column-gap: 10px;
        justify-content: center;
        align-items: center;
      `}>
      <input
        className={checkboxInputStyles}
        type="checkbox"
        defaultChecked={props.defaultChecked}
        onChange={(e) => {
          props.onChange(e.target.checked);
        }}
        id={props.id}
      />
      <label htmlFor={props.id}>{props.children}</label>
    </div>
  );
}
