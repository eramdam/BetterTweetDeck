import {css} from '@emotion/css';
import {DateTime} from 'luxon';
import React, {FC, ReactNode} from 'react';

import {HandlerOf, RendererOf} from '../../helpers/typeHelpers';
import {BTDSettings} from '../../types/btdSettingsTypes';

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

export const SettingsSmallText: FC = (props) => {
  return (
    <div
      className={css`
        color: var(--settings-modal-muted-text);
      `}>
      {props.children}
    </div>
  );
};
