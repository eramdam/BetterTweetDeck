import {css} from 'emotion';
import React from 'react';

import {HandlerOf} from '../../../helpers/typeHelpers';
import {BTDSettings} from '../../../types/betterTweetDeck/btdSettingsTypes';

interface SettingsSelectProps<T extends keyof BTDSettings> {
  fields: ReadonlyArray<{
    label: string;
    value: BTDSettings[T];
  }>;
  initialValue: BTDSettings[T];
  settingsKey: T;
  onChange: HandlerOf<BTDSettings[T]>;
}

export function SettingsSelect<T extends keyof BTDSettings>(props: SettingsSelectProps<T>) {
  return (
    <div
      className={css`
        input + label {
          padding-left: 10px;
        }

        display: grid;
        grid-auto-flow: row;
        grid-row-gap: 10px;
      `}>
      {props.fields.map((field) => {
        return (
          <span key={String(field.value)}>
            <input
              name={props.settingsKey}
              type="radio"
              id={String(field.value)}
              defaultChecked={field.value === props.initialValue}
            />
            <label htmlFor={String(field.value)}>{field.label}</label>
          </span>
        );
      })}
    </div>
  );
}
