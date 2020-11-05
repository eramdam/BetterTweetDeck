import {css} from 'emotion';
import React, {PropsWithChildren} from 'react';

import {BTDSettings} from '../../../types/betterTweetDeck/btdSettingsTypes';
import {settingsRow, settingsRowTitle} from '../settingsStyles';
import {SettingsRadioSelect, SettingsRadioSelectProps} from './settingsRadioSelect';

interface RadioSelectSettingsRowProps<T extends keyof BTDSettings>
  extends SettingsRadioSelectProps<T> {}

export function RadioSelectSettingsRow<T extends keyof BTDSettings>(
  props: PropsWithChildren<RadioSelectSettingsRowProps<T>>
) {
  return (
    <div
      className={css`
        ${settingsRow};
        align-items: flex-start;
      `}>
      <span className={settingsRowTitle}>{props.children}</span>
      <div
        className={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
        `}>
        <SettingsRadioSelect
          settingsKey={props.settingsKey}
          onChange={props.onChange}
          initialValue={props.initialValue}
          fields={props.fields}
        />
      </div>
    </div>
  );
}
