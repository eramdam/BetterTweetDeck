import {css} from '@emotion/css';
import React, {ReactNode} from 'react';

import defaultDarkTheme from '../../../assets/dark-themes/default-dark.png';
import lightsOut from '../../../assets/dark-themes/lights-out.png';
import oldDark from '../../../assets/dark-themes/old-dark.png';
import {BetterTweetDeckThemes} from '../../../features/themeTweaks';
import {HandlerOf} from '../../../helpers/typeHelpers';
import {Trans} from '../../trans';
import {featureBadgeClassname, NewFeatureBadge} from './newFeatureBadge';
import {SettingsRow, SettingsRowContent, SettingsRowTitle} from './settingsRow';

interface CustomDarkThemeProps {
  initialValue: BetterTweetDeckThemes | 'light';
  onChange: HandlerOf<BetterTweetDeckThemes | 'light'>;
  disabled?: boolean;
  onlyDark?: boolean;
  label?: ReactNode;
}

const themeBlockWidth = '180px';

const themeBlock = css`
  display: grid;
  /* grid-template-columns: repeat(2, auto); */
  grid-template-columns: repeat(auto-fill, minmax(auto, ${themeBlockWidth}));
  grid-gap: 20px;
  justify-items: flex-start;
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

  .${featureBadgeClassname} {
    margin-left: 10px;
    vertical-align: middle;
  }
`;

const optionImageBlock = css`
  width: ${themeBlockWidth};
  height: 0;
  padding-top: calc(60 / 120 * 100%);
  border-radius: 10px;
  background-size: 135%;
  position: relative;
  border: 2px solid var(--settings-modal-separator);

  input:checked + & {
    border-color: var(--twitter-blue);
    box-shadow: 0 0 8px rgba(29, 161, 242, 0.6);
  }
`;

const themes = [
  {
    value: BetterTweetDeckThemes.DARK,
    label: <Trans id="settings_default_dark_theme" />,
    image: defaultDarkTheme,
  },
  {
    value: BetterTweetDeckThemes.LEGACY_DARK,
    label: <Trans id="settings_old_gray" />,
    image: oldDark,
  },
  {
    value: BetterTweetDeckThemes.ULTRA_DARK,
    label: (
      <>
        <Trans id="settings_super_black" />
        <NewFeatureBadge introducedIn="4"></NewFeatureBadge>
      </>
    ),
    image: lightsOut,
  },
];

let id = 0;
const generateId = () => {
  id++;
  return id;
};

export function ThemeSelector(props: CustomDarkThemeProps) {
  const inputId = generateId();
  return (
    <SettingsRow disabled={props.disabled}>
      <SettingsRowTitle>
        <Trans id="settings_custom_dark_theme" />
      </SettingsRowTitle>
      <SettingsRowContent className={themeBlock}>
        {themes.map((theme) => {
          return (
            <label
              key={theme.value + inputId}
              className={optionBlock}
              htmlFor={theme.value + inputId}>
              <input
                type="radio"
                name={`customDarkTheme-${inputId}`}
                id={theme.value + inputId}
                onChange={() => props.onChange(theme.value)}
                checked={props.initialValue === theme.value}
                disabled={props.disabled}
              />
              <div
                className={optionImageBlock}
                style={{backgroundImage: `url(${theme.image})`}}></div>
              <span className={optionLabel}>{theme.label}</span>
            </label>
          );
        })}
      </SettingsRowContent>
    </SettingsRow>
  );
}
