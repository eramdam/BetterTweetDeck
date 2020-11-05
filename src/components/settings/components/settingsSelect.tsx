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
              id={'input-' + String(field.value)}
              defaultChecked={field.value === props.initialValue}
              className={css`
                appearance: none;
                border-radius: 100%;
                width: 15px;
                height: 15px;
                border: 1px solid var(--twitter-blue);
                background: transparent;
                outline: 0;

                &:checked {
                  box-shadow: inset 0 0 0 3px var(--settings-modal-background),
                    inset 0 0 0 8px var(--twitter-blue);
                }
              `}
            />
            <label htmlFor={'input-' + String(field.value)}>{field.label}</label>
          </span>
        );
      })}
    </div>
  );
}
