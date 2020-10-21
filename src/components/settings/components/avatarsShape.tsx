import {css, cx} from 'emotion';
import React, {Fragment} from 'react';

import {BTDAvatarShapes} from '../../../features/changeAvatarShape';
import {BaseSettingsProps} from '../settingsTypes';

const settingsRowTitle = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;

  padding: 20px;
`;

const avatarChoiceStyle = css`
  display: grid;
  grid-template-rows: auto 10px auto;
  grid-template-areas: 'shape' '.' 'text';
  padding: 12px 14px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  color: white;

  input:checked + & {
    box-shadow: 0 0 0 1px var(--twitter-blue), 0 0 6px var(--twitter-blue);
  }
`;

const avatarChoiceStyleLabel = css`
  grid-area: text;
  text-align: center;
`;

const avatarChoiceStyleShape = css`
  grid-area: shape;
  display: inline-block;
  background: var(--twitter-blue);
  width: 50px;
  height: 50px;

  &.square {
    border-radius: 4px;
  }

  &.circle {
    border-radius: 50%;
  }
`;

const avatarShapesStyle = css`
  display: flex;
  padding-top: 20px;
  input {
    display: none;
  }
`;

const avatarShapesWrapperStyle = css`
  display: grid;
  grid-auto-columns: auto;
  grid-column-gap: 20px;
  grid-auto-flow: column;
`;

interface AvatarsShapeProps extends BaseSettingsProps<'avatarsShape'> {}

export function AvatarsShape(props: AvatarsShapeProps) {
  return (
    <div className={avatarShapesStyle}>
      <span className={settingsRowTitle}>Avatar shape:</span>
      <div className={avatarShapesWrapperStyle}>
        {Object.values(BTDAvatarShapes).map((value) => {
          return (
            <Fragment key={value}>
              <input
                type="radio"
                id={value}
                value={value}
                name="avatarShape"
                defaultChecked={value === props.initialValue}
                onChange={(e) => props.onChange(e.target.value as typeof props.initialValue)}
              />
              <label htmlFor={value} className={avatarChoiceStyle}>
                <span className={cx(avatarChoiceStyleShape, value)}></span>
                <span className={avatarChoiceStyleLabel}>{value}</span>
              </label>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
