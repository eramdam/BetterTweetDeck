import {css} from '@emotion/css';
import React from 'react';

import {AbstractTweetDeckSettings} from '../../../types/abstractTweetDeckSettings';
import {BTDSettings} from '../../../types/betterTweetDeck/btdSettingsTypes';
import {checkboxInputStyles} from '../settingsStyles';

// There's probably a wau to do this without having to do a manual union ¯\(ツ)/¯
type SettingKey =
  | keyof BTDSettings
  | keyof AbstractTweetDeckSettings
  | keyof BTDSettings['tweetActions']
  | keyof BTDSettings['tweetMenuItems'];

export interface SettingsCheckboxSelectProps {
  onChange: (key: SettingKey, value: boolean) => void;
  disabled?: boolean;
  fields: ReadonlyArray<{
    key: SettingKey;
    label: string;
    initialValue: boolean;
  }>;
}

export function SettingsCheckboxSelect(props: SettingsCheckboxSelectProps) {
  return (
    <div
      className={css`
        padding-top: 4px;

        input + label {
          padding-left: 10px;
          line-height: 1.6;
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
              className={checkboxInputStyles}
              onChange={() => props.onChange(field.key, !field.initialValue)}
            />
            <label htmlFor={'input-' + String(field.key)}>{field.label}</label>
          </span>
        );
      })}
    </div>
  );
}
