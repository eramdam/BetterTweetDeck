import {css} from 'emotion';
import React from 'react';

import {settingsRow, settingsRowTitle} from '../settingsStyles';
import {SettingsSelect} from './settingsSelect';

export function ScrollbarsMode() {
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
        <SettingsSelect />
      </div>
    </div>
  );
}
