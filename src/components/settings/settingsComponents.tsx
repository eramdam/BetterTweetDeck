import {css, cx} from '@emotion/css';
import {DateTime} from 'luxon';
import React, {PropsWithChildren, ReactNode} from 'react';

import {HandlerOf, RendererOf} from '../../helpers/typeHelpers';
import {BTDSettings} from '../../types/btdSettingsTypes';
import {settingsIndent} from './settingsStyles';

export function makeSettingsRow<T extends keyof BTDSettings>(
  key: T,
  render: RendererOf<BTDSettings[T]>
) {
  return {
    render,
    id: key,
  };
}

export type SettingsRow<T extends keyof BTDSettings> = {
  render: RendererOf<BTDSettings[T]>;
  id: T;
};

export interface SettingsSection {
  id: string;
  content: readonly SettingsRow<keyof BTDSettings>[];
}

export type SettingsMenuRenderer = (
  settings: BTDSettings,
  makeOnSettingsChange: <T extends keyof BTDSettings>(key: T) => (val: BTDSettings[T]) => void,
  setEditorHasErrors: HandlerOf<boolean>
) => ReactNode;

export interface SettingsMenuSectionProps {
  settings: BTDSettings;
  makeOnSettingsChange: <T extends keyof BTDSettings>(key: T) => (val: BTDSettings[T]) => void;
  setEditorHasErrors: HandlerOf<boolean>;
}

export function formatDateTime(format: string) {
  return DateTime.local().toFormat(format, {
    locale: 'en',
  });
}

export const SettingsSmallText = (props: PropsWithChildren<{}>) => {
  return (
    <div
      className={cx(
        css`
          font-size: 12px;
          opacity: 0.8;
        `,
        settingsIndent
      )}>
      {props.children}
    </div>
  );
};
