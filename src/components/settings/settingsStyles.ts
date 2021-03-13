import {css} from '@emotion/css';

export const settingsRowTitle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.7;
  font-size: 14px;

  padding: 0 20px;
  text-align: right;
`;

export const settingsDisabled = css`
  opacity: 0.6;
  pointer-events: none;
`;

export const settingsRow = css`
  display: flex;
  padding-top: 15px;
  display: grid;
  grid-template-columns: 150px auto;
  grid-column-gap: 10px;
  justify-content: flex-start;

  & + & {
    padding-top: 20px;
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

  &:checked {
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

export const settingsRegularText = css`
  margin: 40px;
  overflow: hidden;

  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 50px;
  grid-auto-rows: auto;

  h3 {
    margin-bottom: 10px;
  }

  p {
    margin-top: 1em;
    margin-bottom: 1em;
  }

  ul {
    padding-left: 10px;
  }

  ul li {
    list-style-type: none;
    line-height: 2;
    margin: 12px 0;
  }
`;
