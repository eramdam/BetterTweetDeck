import {css} from 'emotion';
import React from 'react';

import defaultDarkTheme from '../../../assets/dark-themes/default-dark.png';
import lightsOut from '../../../assets/dark-themes/lights-out.png';
import oldDark from '../../../assets/dark-themes/old-dark.png';
import {BetterTweetDeckDarkThemes} from '../../../features/themeTweaks';
import {settingsRow, settingsRowTitle} from '../settingsStyles';
import {BaseSettingsProps} from '../settingsTypes';

interface CustomDarkThemeProps extends BaseSettingsProps<'customDarkTheme'> {}

const darkThemeRow = css`
  ${settingsRow};
  align-items: flex-start;
  margin-top: 20px;
`;

const themeBlock = css`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 14px;
`;

const optionBlock = css`
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: auto;
  grid-gap: 10px;
  justify-content: center;

  input {
    display: none;
  }
`;

const optionLabel = css`
  text-align: center;
  font-size: 14px;
`;

const optionImageBlock = css`
  width: 160px;
  height: 80px;
  border-radius: 8px;
  background-size: 320px;
  position: relative;
  border: 2px solid var(--settings-modal-separator);

  input:checked + & {
    border-color: var(--twitter-blue);
  }
`;

const themes = [
  {
    value: BetterTweetDeckDarkThemes.DEFAULT,
    label: 'Default',
    image: defaultDarkTheme,
  },
  {
    value: BetterTweetDeckDarkThemes.LEGACY,
    label: 'Old Gray',
    image: oldDark,
  },
  {
    value: BetterTweetDeckDarkThemes.ULTRA_DARK,
    label: 'Super Black',
    image: lightsOut,
  },
];

export function CustomDarkTheme(props: CustomDarkThemeProps) {
  return (
    <div className={darkThemeRow}>
      <span
        className={css`
          ${settingsRowTitle};
          padding-top: 50px;
        `}>
        Dark theme variant
      </span>
      <div className={themeBlock}>
        {themes.map((theme) => {
          return (
            <label key={theme.value} className={optionBlock} htmlFor={theme.value}>
              <input
                type="radio"
                name="customDarkTheme"
                id={theme.value}
                onChange={() => props.onChange(theme.value)}
                defaultChecked={props.initialValue === theme.value}
              />
              <div
                className={optionImageBlock}
                style={{backgroundImage: `url(${theme.image})`}}></div>
              <span className={optionLabel}>{theme.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
