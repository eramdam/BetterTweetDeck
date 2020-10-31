import {css} from 'emotion';

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
  padding-top: 20px;
  display: grid;
  grid-template-columns: 220px auto;
  grid-column-gap: 10px;
  justify-content: flex-start;
`;
