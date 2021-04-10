import {css, cx} from '@emotion/css';
import React, {ReactNode} from 'react';

import {AbstractTweetDeckSettings} from '../../../types/abstractTweetDeckSettings';
import {BTDSettings} from '../../../types/btdSettingsTypes';
import {generateInputId} from '../settingsHelpers';
import {checkboxInputStyles, settingsDisabled} from '../settingsStyles';
import {featureBadgeClassname, NewFeatureBadge, NewFeatureBadgeProps} from './newFeatureBadge';

// There's probably a wau to do this without having to do a manual union ¯\(ツ)/¯
export type SettingKey =
  | keyof BTDSettings
  | keyof AbstractTweetDeckSettings
  | keyof BTDSettings['tweetActions']
  | keyof BTDSettings['tweetMenuItems'];

export interface SettingsCheckboxSelectProps {
  onChange: (key: SettingKey, value: boolean) => void;
  disabled?: boolean;
  fields: ReadonlyArray<
    {
      key: SettingKey;
      label: ReactNode;
      initialValue: boolean;
      isDisabled?: boolean;
    } & Partial<NewFeatureBadgeProps>
  >;
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

        .${featureBadgeClassname} {
          margin-left: 10px;
        }

        display: grid;
        grid-auto-flow: row;
        grid-row-gap: 10px;
      `}>
      {props.fields.map((field) => {
        const inputId = `${field.key}-${generateInputId()}`;
        return (
          <span key={String(field.key)} className={cx(field.isDisabled && settingsDisabled)}>
            <input
              name={field.key}
              type="checkbox"
              disabled={field.isDisabled}
              id={inputId}
              defaultChecked={field.initialValue}
              className={checkboxInputStyles}
              onChange={() => props.onChange(field.key, !field.initialValue)}
            />
            <label htmlFor={inputId}>
              {field.label}
              {field.introducedIn && (
                <NewFeatureBadge introducedIn={field.introducedIn}></NewFeatureBadge>
              )}
            </label>
          </span>
        );
      })}
    </div>
  );
}
