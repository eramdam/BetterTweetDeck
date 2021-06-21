import {css} from '@emotion/css';

import {featureBadgeClassname} from './components/newFeatureBadge';

export const settingsRowTitle = css`
  line-height: 1.7;
  font-size: 20px;

  padding: 6px 0;
  text-align: left;
  display: flex;
  align-items: center;

  .${featureBadgeClassname} {
    margin-left: 10px;
  }
`;

export const settingsDisabled = css`
  opacity: 0.6;
  pointer-events: none;
`;

export const settingsRow = css`
  display: flex;
  padding-top: 15px;
  display: grid;
  grid-auto-rows: auto;
  grid-auto-flow: row;
  padding-left: 40px;
  justify-content: stretch;

  & + & {
    padding-top: 15px;
  }

  hr + & {
    padding-top: 0;
  }
`;

export const checkboxInputStyles = css`
  appearance: none;
  width: 15px;
  height: 15px;
  border: 1px solid var(--twitter-blue);
  background: transparent;
  outline: 0;

  &:checked,
  &[checked] {
    box-shadow: inset 0 0 0 3px var(--settings-modal-background),
      inset 0 0 0 8px var(--twitter-blue);
  }
`;

export function maybeAlignToTheLeft(alignToTheLeft?: boolean) {
  if (!alignToTheLeft) {
    return '';
  }

  return css`
    grid-template-columns: minmax(20px, auto) auto;
  `;
}

export const settingsLink = css`
  text-decoration: none;
  color: var(--twitter-blue);

  &:hover {
    color: var(--twitter-darkblue);
  }
`;

export const settingsRegularText = css`
  margin: 40px;
  overflow: hidden;

  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 50px;
  grid-auto-rows: auto;

  h3 {
    margin: 10px 0;
  }

  h3 + p + h3 {
    margin-top: 2em;
  }

  p {
    margin-top: 1em;
    margin-bottom: 1em;
    line-height: 1.8;
  }

  ul {
    padding-left: 10px;
  }

  ul li {
    list-style-type: none;
    line-height: 2;
    margin: 12px 0;
  }

  a {
    ${settingsLink};
  }
`;

export const SettingsSmall = css`
  font-size: 12px;
  opacity: 0.8;
`;
