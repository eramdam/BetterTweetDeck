import {css} from 'emotion';
import React from 'react';

import {BTDScrollbarsMode} from '../../../features/changeScrollbars';
import {settingsRow, settingsRowTitle} from '../settingsStyles';
import {BaseSettingsProps} from '../settingsTypes';
import {SettingsSelect} from './settingsSelect';

interface ScrollbarsModeProps extends BaseSettingsProps<'scrollbarsMode'> {}

export function ScrollbarsMode(props: ScrollbarsModeProps) {
  return (
    <div
      className={css`
        ${settingsRow};
        align-items: flex-start;
      `}>
      <span className={settingsRowTitle}>Style of scrollbars:</span>
      <div
        className={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
        `}>
        <SettingsSelect
          settingsKey="scrollbarsMode"
          onChange={props.onChange}
          initialValue={props.initialValue}
          fields={[
            {label: 'Default', value: BTDScrollbarsMode.DEFAULT},
            {label: 'Thin', value: BTDScrollbarsMode.SLIM},
            {label: 'Hidden', value: BTDScrollbarsMode.HIDDEN},
          ]}
        />
      </div>
    </div>
  );
}
