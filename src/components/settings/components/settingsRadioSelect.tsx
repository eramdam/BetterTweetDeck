import {css} from 'emotion';
import React from 'react';

import {HandlerOf} from '../../../helpers/typeHelpers';
import {BTDSettings} from '../../../types/betterTweetDeck/btdSettingsTypes';
import {SettingsRadioInput} from './settingsRadioInput';

export interface SettingsRadioSettingSelectProps<T extends keyof BTDSettings> {
  fields: ReadonlyArray<{
    label: string;
    value: BTDSettings[T];
  }>;
  initialValue: BTDSettings[T];
  settingsKey: T;
  onChange: HandlerOf<BTDSettings[T]>;
}

const wrapperStyles = css`
  padding-top: 4px;

  input + label {
    padding-left: 10px;
  }

  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 10px;
`;

export function SettingsRadioSettingSelect<T extends keyof BTDSettings>(
  props: SettingsRadioSettingSelectProps<T>
) {
  return (
    <div className={wrapperStyles}>
      {props.fields.map((field) => {
        return (
          <SettingsRadioInput
            key={String(field.value)}
            id={String(field.value)}
            name={props.settingsKey}
            defaultChecked={field.value === props.initialValue}
            onChange={() => props.onChange(field.value)}>
            {field.label}
          </SettingsRadioInput>
        );
      })}
    </div>
  );
}
