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

export const settingsRow = css`
  display: flex;
  padding-top: 15px;
  display: grid;
  grid-template-columns: 220px auto;
  grid-column-gap: 10px;
  justify-content: flex-start;

  & + & {
    padding-top: 10px;
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
