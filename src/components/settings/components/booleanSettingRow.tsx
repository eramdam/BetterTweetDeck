import {css, cx} from '@emotion/css';
import React, {PropsWithChildren} from 'react';

import {HandlerOf} from '../../../helpers/typeHelpers';
import {settingsDisabled} from '../settingsStyles';
import {featureBadgeClassname, NewFeatureBadge, NewFeatureBadgeProps} from './newFeatureBadge';
import {SettingsRow, SettingsRowContent} from './settingsRow';
import {SettingsToggle} from './settingsToggle';

interface BooleanSettingsRowProps extends Partial<NewFeatureBadgeProps> {
  initialValue: boolean;
  onChange: HandlerOf<boolean>;
  settingsKey: string;
  alignToTheLeft?: boolean;
  disabled?: boolean;
}

export function BooleanSettingsRow(props: PropsWithChildren<BooleanSettingsRowProps>) {
  return (
    <SettingsRow className={cx(props.disabled && settingsDisabled)} stretch={!props.alignToTheLeft}>
      <SettingsRowContent
        className={css`
          display: flex;
          align-items: center;

          .${featureBadgeClassname} {
            margin-left: 10px;
          }
        `}>
        <SettingsToggle
          id={props.settingsKey}
          name={props.settingsKey}
          defaultChecked={props.initialValue}
          onChange={props.onChange}>
          {props.children}
          {props.introducedIn && (
            <NewFeatureBadge introducedIn={props.introducedIn}></NewFeatureBadge>
          )}
        </SettingsToggle>
      </SettingsRowContent>
    </SettingsRow>
  );
}
