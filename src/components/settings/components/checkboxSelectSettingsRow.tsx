import {css, cx} from '@emotion/css';
import React, {PropsWithChildren} from 'react';

import {BTDSettings} from '../../../types/btdSettingsTypes';
import {useSettingsSearch} from '../settingsContext';
import {reactElementToString} from '../settingsHelpers';
import {
  SettingKey,
  SettingsCheckboxSelect,
  SettingsCheckboxSelectProps,
} from './settingsCheckboxSelect';
import {SettingsRow, SettingsRowContent, SettingsRowTitle} from './settingsRow';

interface CheckboxSelectSettingsRowProps extends SettingsCheckboxSelectProps {
  ignoreSearch?: boolean;
}

export function CheckboxSelectSettingsRow(
  props: PropsWithChildren<CheckboxSelectSettingsRowProps>
) {
  const {renderAndAddtoIndex} = useSettingsSearch();

  const baseRender = (
    <SettingsRow className={cx(css``)} disabled={props.disabled}>
      <SettingsRowTitle>{props.children}</SettingsRowTitle>
      <SettingsRowContent
        className={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
        `}>
        <SettingsCheckboxSelect
          fields={props.fields}
          onChange={props.onChange}></SettingsCheckboxSelect>
      </SettingsRowContent>
    </SettingsRow>
  );

  if (!props.ignoreSearch) {
    return (
      <>
        {renderAndAddtoIndex({
          key: props.fields.map((k) => k.key).join('-'),
          keywords: props.fields
            .map((k) => reactElementToString(k.label))
            .concat(reactElementToString(props.children)),
          render: (newSettings) => {
            function getValue(key: SettingKey) {
              if (Object.keys(newSettings.tweetActions).includes(key)) {
                return newSettings.tweetActions[key as keyof BTDSettings['tweetActions']];
              } else if (Object.keys(newSettings.tweetMenuItems).includes(key)) {
                return newSettings.tweetMenuItems[key as keyof BTDSettings['tweetMenuItems']];
              }

              return newSettings[key as keyof BTDSettings];
            }

            return (
              <SettingsRow className={cx(css``)} disabled={props.disabled}>
                <SettingsRowTitle>{props.children}</SettingsRowTitle>
                <SettingsRowContent
                  className={css`
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                  `}>
                  <SettingsCheckboxSelect
                    fields={props.fields.map((f) => {
                      return {
                        ...f,
                        initialValue: getValue(f.key) as typeof f.initialValue,
                        extraContent: () =>
                          f.extraContent ? f.extraContent(newSettings) : undefined,
                      };
                    })}
                    onChange={props.onChange}></SettingsCheckboxSelect>
                </SettingsRowContent>
              </SettingsRow>
            );
          },
        })}
      </>
    );
  }

  return baseRender;
}
