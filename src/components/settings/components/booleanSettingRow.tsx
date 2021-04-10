import {css, cx} from '@emotion/css';
import React, {PropsWithChildren} from 'react';

import {HandlerOf} from '../../../helpers/typeHelpers';
import {useSettingsSearch} from '../settingsContext';
import {reactElementToString} from '../settingsHelpers';
import {settingsDisabled} from '../settingsStyles';
import {featureBadgeClassname, NewFeatureBadge, NewFeatureBadgeProps} from './newFeatureBadge';
import {SettingsRow, SettingsRowContent} from './settingsRow';
import {SettingsToggle} from './settingsToggle';

interface BooleanSettingsRowProps extends Partial<NewFeatureBadgeProps> {
  initialValue: boolean;
  onChange: HandlerOf<boolean>;
  settingsKey: string;
  alignToTheLeft?: boolean;
  noPaddingTop?: boolean;
  disabled?: boolean;
  ignoreInSearch?: boolean;
}

export function BooleanSettingsRow(props: PropsWithChildren<BooleanSettingsRowProps>) {
  const {addToIndex} = useSettingsSearch();
  const render = () => (
    <SettingsRow
      className={cx(props.disabled && settingsDisabled)}
      stretch={!props.alignToTheLeft}
      noPaddingTop={props.noPaddingTop}>
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

  if (!props.ignoreInSearch) {
    addToIndex(
      {
        keywords: [reactElementToString(props.children)],
        key: props.settingsKey,
        render: () => render(),
      },
      {} as any
    );
  }

  return render();
}
