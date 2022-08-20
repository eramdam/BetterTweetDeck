import {css, cx} from '@emotion/css';
import convert from 'color-convert';
import React, {useState} from 'react';
import {CustomPicker} from 'react-color';
import {Hue, Saturation} from 'react-color/lib/components/common';

import rainbowEmoji from '../../../assets/accent-colors/any.svg';
import blueEmoji from '../../../assets/accent-colors/blue.svg';
import greenEmoji from '../../../assets/accent-colors/green.svg';
import orangeEmoji from '../../../assets/accent-colors/orange.svg';
import pinkEmoji from '../../../assets/accent-colors/pink.svg';
import purpleEmoji from '../../../assets/accent-colors/purple.svg';
import prideEmoji from '../../../assets/accent-colors/rainbow.svg';
import redEmoji from '../../../assets/accent-colors/red.svg';
import yellowEmoji from '../../../assets/accent-colors/yellow.svg';
import {HandlerOf} from '../../../helpers/typeHelpers';
import {BetterTweetDeckAccentColors} from '../../../types/btdSettingsEnums';
import {Trans} from '../../trans';
import {generateInputId} from '../settingsHelpers';
import {BaseSettingsProps} from '../settingsTypes';
import {NewFeatureBadge} from './newFeatureBadge';
import {SettingsRow, SettingsRowContent, SettingsRowTitle} from './settingsRow';
import {SettingsTextInputWithAnnotation} from './settingsTextInputWithAnnotation';

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
  const [customColor, setCustomColor] = useState(
    props.customAnyAccentColor || BetterTweetDeckAccentColors.DEFAULT
  );
  const [internalCustomColor, setInternalCustomColor] = useState(customColor);
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
          <input
            type="radio"
            id={anyInputId}
            value={props.customAnyAccentColor}
            name="customAccentColor"
            defaultChecked={props.initialValue === BetterTweetDeckAccentColors.CUSTOM}
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
      {props.initialValue === BetterTweetDeckAccentColors.CUSTOM && (
        <BTDColorPicker
          color={internalCustomColor}
          onChange={(c) => setInternalCustomColor(c.hex)}
          onChangeComplete={(c) => {
            setCustomColor(c.hex);
            props.onCustomAnyAccentColorChange(c.hex);
          }}></BTDColorPicker>
      )}
    </SettingsRow>
  );
}

const colorTextInputStyles = css`
  small {
    order: 1;
    margin-right: 10px;
    width: 2ch;
    text-transform: uppercase;
    text-align: center;
  }
  input {
    order: 2;
  }
`;

type BTDColorResult = {
  '#'?: string;
  r?: number;
  g?: number;
  b?: number;
};

const BTDColorPicker = CustomPicker((props) => {
  const handleChange = (data: BTDColorResult) => {
    if (data['#']) {
      const newRgb = convert.hex.rgb(data['#']);
      const newHex = convert.rgb.hex(...newRgb);

      // @ts-expect-error
      props.onChange({
        hex: newHex,
      });
    } else if (data.r || data.g || data.b) {
      // @ts-expect-error
      props.onChange({
        r: data.r || props.rgb?.r || 0,
        g: data.g || props.rgb?.g || 0,
        b: data.b || props.rgb?.b || 0,
      });
    }
  };
  return (
    <div
      className={css`
        margin-top: 30px;
        display: grid;
        grid-template-areas: 'saturation . hue . preview' 'saturation . hue . fields';
        grid-template-columns: auto 18px auto 20px 1fr;
        height: 200px;
      `}>
      <div
        className={css`
          grid-area: saturation;
          position: relative;
          height: 100%;
          width: 256px;
          border: 1px solid var(--settings-modal-separator);
        `}>
        <Saturation {...props} onChange={props.onChange || (() => {})} />
      </div>
      <div
        className={css`
          grid-area: hue;
          position: relative;
          height: 100%;
          width: 16px;
          border: 1px solid var(--settings-modal-separator);
        `}>
        <Hue {...props} direction="vertical" onChange={props.onChange || (() => {})} />
      </div>
      <div
        className={css`
          grid-area: preview;
        `}>
        <div
          className={css`
            width: 50px;
            height: 40px;
            border: 1px solid var(--settings-modal-separator);
          `}
          style={{backgroundColor: props.hex || ''}}></div>
      </div>
      <div
        className={css`
          grid-area: fields;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 10px;
          margin-left: -20px;
        `}>
        {['r', 'g', 'b'].map((k) => {
          return (
            <SettingsTextInputWithAnnotation
              key={k}
              onChange={(data) => handleChange({[k]: Number(data)})}
              annotation={k}
              className={cx(
                colorTextInputStyles,
                css`
                  input {
                    width: 46px;
                  }
                `
              )}
              // @ts-expect-error
              value={Math.round(props.rgb?.[k] || 0).toString()}></SettingsTextInputWithAnnotation>
          );
        })}
        <SettingsTextInputWithAnnotation
          onChange={(data) => handleChange({'#': data})}
          annotation={'#'}
          className={cx(
            colorTextInputStyles,
            css`
              input {
                width: 70px;
              }
            `
          )}
          value={props.hex?.replace('#', '').toUpperCase() || ''}></SettingsTextInputWithAnnotation>
      </div>
    </div>
  );
});
