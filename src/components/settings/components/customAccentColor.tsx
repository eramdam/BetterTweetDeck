import {css} from 'emotion';
import React from 'react';

import blueEmoji from '../../../assets/accent-colors/blue.svg';
import greenEmoji from '../../../assets/accent-colors/green.svg';
import orangeEmoji from '../../../assets/accent-colors/orange.svg';
import pinkEmoji from '../../../assets/accent-colors/pink.svg';
import purpleEmoji from '../../../assets/accent-colors/purple.svg';
import redEmoji from '../../../assets/accent-colors/red.svg';
import yellowEmoji from '../../../assets/accent-colors/yellow.svg';
import {BetterTweetDeckAccentColors} from '../../../features/themeTweaks';
import {settingsRow, settingsRowTitle} from '../settingsStyles';
import {BaseSettingsProps} from '../settingsTypes';

interface CustomAccentColorProps extends BaseSettingsProps<'customAccentColor'> {}

const emojiMap = {
  [BetterTweetDeckAccentColors.DEFAULT]: blueEmoji,
  [BetterTweetDeckAccentColors.GREEN]: greenEmoji,
  [BetterTweetDeckAccentColors.ORANGE]: orangeEmoji,
  [BetterTweetDeckAccentColors.PINK]: pinkEmoji,
  [BetterTweetDeckAccentColors.PURPLE]: purpleEmoji,
  [BetterTweetDeckAccentColors.RED]: redEmoji,
  [BetterTweetDeckAccentColors.YELLOW]: yellowEmoji,
};
const possibleAccentColors = Object.entries(BetterTweetDeckAccentColors);

const optionStyles = css`
  display: grid;
  grid-template-rows: auto 12px 24px;
  grid-template-areas:
    'dot'
    '.'
    'emoji';
  justify-items: center;

  img {
    grid-area: emoji;
    width: 24px;
    height: 24px;
  }
`;

const labelStyles = css`
  grid-area: dot;
  display: inline-block;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  position: relative;

  &:after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    transform: translateY(100%);
    opacity: 0;
  }

  &:before {
    content: '';
    display: block;
    position: absolute;
    background: white;
    border-radius: 50%;
    width: 50%;
    height: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: transform 200ms ease;
  }

  input:checked + &:before {
    transform: translate(-50%, -50%) scale(1);
  }
`;

const accentColorRow = css`
  ${settingsRow};
  align-items: flex-start;
`;

export function CustomAccentColor(props: CustomAccentColorProps) {
  return (
    <div className={accentColorRow}>
      <span className={settingsRowTitle}>Accent color</span>
      <div
        className={css`
          display: grid;
          grid-auto-flow: column;
          grid-column-gap: 20px;

          input {
            display: none;
          }
        `}>
        {possibleAccentColors.map(([key, value]) => {
          return (
            <span key={key} className={optionStyles}>
              <input
                type="radio"
                id={key}
                value={key}
                name="customAccentColor"
                defaultChecked={value === props.initialValue}
                onChange={() => props.onChange(value)}
              />
              <label
                style={{
                  backgroundColor: value,
                }}
                className={labelStyles}
                htmlFor={key}></label>
              <img src={emojiMap[value]} alt="" />
            </span>
          );
        })}
      </div>
    </div>
  );
}
