import {css} from '@emotion/css';
import React from 'react';

import {settingsRow} from '../settingsStyles';

export function SettingsSeparator() {
  return (
    <hr
      className={css`
        width: 95%;
        margin: 20px auto;
        border: 0;
        border-bottom: 2px solid var(--settings-modal-separator);
        opacity: 0.6;

        ${settingsRow} & {
          margin: 20px 0;
        }
      `}
    />
  );
}
