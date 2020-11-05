import {css} from 'emotion';
import React from 'react';
import {Object} from 'ts-toolbelt';

import {BTDSettings} from '../../../types/betterTweetDeck/btdSettingsTypes';

// There's probably a wau to do this without having to do a manual union ¯\(ツ)/¯
type SettingKey =
  | Object.Keys<BTDSettings>
  | Object.Keys<BTDSettings['tweetActions']>
  | Object.Keys<BTDSettings['tweetMenuItems']>;

export interface SettingsCheckboxSelectProps {
  onChange: (key: SettingKey, value: boolean) => void;
  fields: ReadonlyArray<{
    key: SettingKey;
    label: string;
    initialValue: boolean;
  }>;
}

const mainInputStyles = css`
  appearance: none;
  width: 15px;
  height: 15px;
  border: 1px solid var(--twitter-blue);
  background: transparent;
  outline: 0;

  &:checked {
    box-shadow: inset 0 0 0 3px var(--settings-modal-background),
      inset 0 0 0 8px var(--twitter-blue);
  }
`;

export function SettingsCheckboxSelect(props: SettingsCheckboxSelectProps) {
  return (
    <div
      className={css`
        padding-top: 4px;

        input + label {
          padding-left: 10px;
        }

        display: grid;
        grid-auto-flow: row;
        grid-row-gap: 10px;
      `}>
      {props.fields.map((field) => {
        return (
          <span key={String(field.key)}>
            <input
              name={field.key}
              type="checkbox"
              id={'input-' + String(field.key)}
              defaultChecked={field.initialValue}
              className={mainInputStyles}
              onChange={() => props.onChange(field.key, !field.initialValue)}
            />
            <label htmlFor={'input-' + String(field.key)}>{field.label}</label>
          </span>
        );
      })}
    </div>
  );
}
