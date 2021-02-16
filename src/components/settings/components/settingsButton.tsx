import React, {PropsWithChildren} from 'react';
import {Handler} from '../../../helpers/typeHelpers';

interface SettingsButtonProps {
  onClick: Handler;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}
export function SettingsButton(props: PropsWithChildren<SettingsButtonProps>) {
  return (
    <button
      className={`btd-settings-button ${props.variant || 'secondary'}`}
      disabled={props.disabled}
      onClick={props.onClick}>
      {props.children}
    </button>
  );
}
