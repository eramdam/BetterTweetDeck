import {css} from 'emotion';
import React from 'react';

interface SettingsSelectProps {}

export function SettingsSelect(props: SettingsSelectProps) {
  return (
    <div
      className={css`
        input + label {
          padding-left: 10px;
        }

        display: grid;
        grid-auto-flow: row;
        grid-row-gap: 10px;
      `}>
      <span>
        <input name="scrollbarMode" type="radio" id="blah1" />
        <label htmlFor="blah1">Thin</label>
      </span>
      <span>
        <input name="scrollbarMode" type="radio" id="blah2" />
        <label htmlFor="blah2">Hidden</label>
      </span>
    </div>
  );
}
