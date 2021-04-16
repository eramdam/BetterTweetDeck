import {css} from '@emotion/css';
import _ from 'lodash';
import React, {useState} from 'react';
import {SketchPicker} from 'react-color';

import rainbowEmoji from '../../../assets/accent-colors/any.svg';
import blueEmoji from '../../../assets/accent-colors/blue.svg';
import greenEmoji from '../../../assets/accent-colors/green.svg';
import orangeEmoji from '../../../assets/accent-colors/orange.svg';
import pinkEmoji from '../../../assets/accent-colors/pink.svg';
import purpleEmoji from '../../../assets/accent-colors/purple.svg';
import prideEmoji from '../../../assets/accent-colors/rainbow.svg';
import redEmoji from '../../../assets/accent-colors/red.svg';
import yellowEmoji from '../../../assets/accent-colors/yellow.svg';
import {BetterTweetDeckAccentColors} from '../../../features/themeTweaks';
import {HandlerOf} from '../../../helpers/typeHelpers';
import {Trans} from '../../trans';
import {generateInputId} from '../settingsHelpers';
import {BaseSettingsProps} from '../settingsTypes';
import {NewFeatureBadge} from './newFeatureBadge';
import {SettingsRow, SettingsRowContent, SettingsRowTitle} from './settingsRow';

interface CustomAccentColorProps extends BaseSettingsProps<'customAccentColor'> {
  customAnyAccentColor: string;
  onCustomAnyAccentColorChange: HandlerOf<string>;
}

const emojiMap = {
  [BetterTweetDeckAccentColors.DEFAULT]: blueEmoji,
  [BetterTweetDeckAccentColors.GREEN]: greenEmoji,
  [BetterTweetDeckAccentColors.ORANGE]: orangeEmoji,
  [BetterTweetDeckAccentColors.PINK]: pinkEmoji,
  [BetterTweetDeckAccentColors.PURPLE]: purpleEmoji,
  [BetterTweetDeckAccentColors.RED]: redEmoji,
  [BetterTweetDeckAccentColors.YELLOW]: yellowEmoji,
};
const possibleAccentColors = Object.entries(BetterTweetDeckAccentColors).filter(
  (v) => v[0] !== BetterTweetDeckAccentColors.CUSTOM
);

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

  input[checked] + &:before {
    transform: translate(-50%, -50%) scale(1);
  }
`;

const accentColorRow = css`
  padding-top: 30px;
  padding-bottom: 20px;
`;

export function CustomAccentColor(props: CustomAccentColorProps) {
  const anyInputId = `any-${generateInputId()}`;
  const [customColor, setCustomColor] = useState(props.customAnyAccentColor);
  const [internalCustomColor, setInternalCustomColor] = useState(customColor);
  const [isPickerOpened, setIsPickerOpened] = useState(false);
  const isPrideMonth = new Date().getMonth() === 5;

  return (
    <SettingsRow className={accentColorRow} stretch={false}>
      <SettingsRowTitle>
        <Trans id="settings_accent_color" />
        <NewFeatureBadge introducedIn="4" />
      </SettingsRowTitle>
      <SettingsRowContent
        className={css`
          display: grid;
          grid-auto-flow: column;
          grid-column-gap: 20px;

          > span > input[type='radio'] {
            display: none;
          }
        `}>
        {possibleAccentColors.map(([key, value]) => {
          const inputId = `${key}-${generateInputId()}`;
          return (
            <span key={key} className={optionStyles}>
              <input
                type="radio"
                id={inputId}
                value={key}
                name="customAccentColor"
                defaultChecked={
                  value === props.initialValue &&
                  props.initialValue !== BetterTweetDeckAccentColors.CUSTOM
                }
                onChange={() => props.onChange(value)}
              />
              <label
                style={{
                  backgroundColor: value,
                }}
                className={labelStyles}
                htmlFor={inputId}></label>
              {/* @ts-expect-error */}
              <img src={emojiMap[value]} alt="" />
            </span>
          );
        })}
        <span className={optionStyles}>
          {isPickerOpened && (
            <div
              style={{
                position: 'absolute',
                zIndex: 2,
              }}>
              <SketchPicker
                presetColors={possibleAccentColors.map((c) => {
                  return {
                    title: _.capitalize(c[0]),
                    color: c[1],
                  };
                })}
                className={css`
                  z-index: 1;
                  position: relative;
                  top: 90px;
                  left: 0;
                `}
                color={internalCustomColor}
                onChange={(c) => setInternalCustomColor(c.hex)}
                onChangeComplete={(c) => {
                  setCustomColor(c.hex);
                  props.onCustomAnyAccentColorChange(c.hex);
                }}></SketchPicker>
              <div
                style={{
                  position: 'fixed',
                  top: '0px',
                  bottom: '0px',
                  right: '0px',
                  left: '0px',
                }}
                onClick={() => {
                  setIsPickerOpened(false);
                }}></div>
            </div>
          )}
          <input
            type="radio"
            id={anyInputId}
            value={props.customAnyAccentColor}
            name="customAccentColor"
            defaultChecked={props.initialValue === BetterTweetDeckAccentColors.CUSTOM}
            onClick={() => setIsPickerOpened(true)}
            onChange={() => {
              props.onChange(BetterTweetDeckAccentColors.CUSTOM);
            }}
          />
          <label
            style={{
              backgroundColor: props.customAnyAccentColor,
              backgroundImage:
                (!props.customAnyAccentColor &&
                  `linear-gradient(#EB2027 20%, #F19020 20% 40%, #FFCB4C 40% 60%, #5C903F 60% 80%, #226798 80%)`) ||
                '',
            }}
            className={labelStyles}
            htmlFor={anyInputId}></label>
          <img src={isPrideMonth ? prideEmoji : rainbowEmoji} alt="" />
        </span>
      </SettingsRowContent>
    </SettingsRow>
  );
}
