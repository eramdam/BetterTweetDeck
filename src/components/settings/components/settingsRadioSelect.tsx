import {css, cx} from '@emotion/css';
import React, {ReactNode} from 'react';

import {HandlerOf} from '../../../helpers/typeHelpers';
import {AbstractTweetDeckSettings} from '../../../types/abstractTweetDeckSettings';
import {BTDSettings} from '../../../types/btdSettingsTypes';
import {settingsDisabled} from '../settingsStyles';
import {SettingsRadioInput} from './settingsRadioInput';

export interface SettingsRadioSettingsSelectProps<S extends object, T extends keyof S> {
  fields: ReadonlyArray<{
    label: ReactNode;
    searchTerm?: string;
    value: S[T];
  }>;
  initialValue: S[T];
  settingsKey: T;
  onChange: HandlerOf<S[T]>;
  ignoreSearch?: boolean;
  className?: string;
  isDisabled?: boolean;
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

export function SettingsRadioSettingSelect<S extends object, T extends keyof S>(
  props: SettingsRadioSettingsSelectProps<S, T>
) {
  return (
    <div className={cx(wrapperStyles, props.isDisabled && settingsDisabled, props.className)}>
      {props.fields.map((field) => {
        return (
          <SettingsRadioInput
            key={String(field.value)}
            id={String(field.value)}
            name={String(props.settingsKey)}
            defaultChecked={field.value === props.initialValue}
            onChange={() => props.onChange(field.value)}
            isDisabled={props.isDisabled}>
            {field.label}
          </SettingsRadioInput>
        );
      })}
    </div>
  );
}

export function BTDSettingsRadioSettingSelect<T extends keyof BTDSettings>(
  props: SettingsRadioSettingsSelectProps<BTDSettings, T>
) {
  return SettingsRadioSettingSelect(props);
}

export function TDSettingsRadioSettingSelect<T extends keyof AbstractTweetDeckSettings>(
  props: SettingsRadioSettingsSelectProps<AbstractTweetDeckSettings, T>
) {
  return SettingsRadioSettingSelect(props);
}
