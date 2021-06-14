import {css, cx} from '@emotion/css';
import React from 'react';

import clearBtn from '../../../assets/column-preview/clear-btn.png';
import collapseBtn from '../../../assets/column-preview/collapse-btn.png';
import mainBg from '../../../assets/column-preview/column-bg.png';
import noIcon from '../../../assets/column-preview/no-icon.png';
import {BTDSettings} from '../../../types/btdSettingsTypes';
import {SettingsRow, SettingsRowContent, SettingsRowTitle} from './settingsRow';

interface ColumnSettingsPreviewProps {
  settings: BTDSettings;
  alignToTheLeft?: boolean;
}

const mainPreview = css`
  width: 310px;
  height: 119px;
  background: url(${mainBg});
  border-radius: 8px;
  border: 2px solid var(--settings-modal-separator);
  position: relative;
`;

const noIconBlock = css`
  background-image: url(${noIcon});
  width: 202px;
  height: 47px;
  top: 0;
  left: 0;
  position: absolute;
`;

const hiddenStyles = css`
  display: none;
`;

export function ColumnSettingsPreview({settings, alignToTheLeft}: ColumnSettingsPreviewProps) {
  const {hideColumnIcons, showClearButtonInColumnsHeader, showCollapseButtonInColumnsHeader} =
    settings;
  return (
    <SettingsRow>
      <SettingsRowTitle>Preview</SettingsRowTitle>
      <SettingsRowContent
        className={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
        `}>
        <div className={mainPreview}>
          <div className={cx(noIconBlock, !hideColumnIcons && hiddenStyles)}></div>
          <div
            className={css`
              right: 39px;
              top: 13px;
              position: absolute;
              height: 22px;
              display: grid;
              grid-auto-flow: column;
              grid-auto-columns: auto;
              grid-column-gap: 4px;
            `}>
            <img
              className={cx(!showClearButtonInColumnsHeader && hiddenStyles)}
              src={clearBtn}
              alt=""
            />
            <img
              className={cx(!showCollapseButtonInColumnsHeader && hiddenStyles)}
              src={collapseBtn}
              alt=""
            />
          </div>
        </div>
      </SettingsRowContent>
    </SettingsRow>
  );
}
