import createEmotion from '@emotion/css/create-instance';
import {darken, lighten, transparentize} from 'polished';

import {makeBTDModule} from '../types/btdCommonTypes';

export const applyCustomAccentColor = makeBTDModule(() => {
  const containerStyle = document.createElement('style');
  const container = document.head.appendChild(containerStyle);
  const {css} = createEmotion({
    key: 'btd',
    container,
  });

  const baseColor = `rgb(0,255,255)`;
  const colors = {
    base: baseColor,
    dark100: darken(0.2, baseColor),

    light100: lighten(0.1, baseColor),
    light200: lighten(0.2, baseColor),
    light300: lighten(0.3, baseColor),
  };

  document.body.classList.add(css`
    .r-oo8a77 {
      background-color: ${colors.dark100} !important;
    }
    .r-5c1b6u {
      color: ${colors.base} !important;

      & svg {
        stroke: currentColor !important;
      }
    }

    .r-2r9icm {
      background-color: ${colors.base} !important;

      &[style*='border-color'] {
        border-color: ${colors.base} !important;
      }
    }

    [aria-selected='true'][role='tab'] [style*='background-color'] {
      background-color: ${colors.base} !important;
    }

    [aria-label='Compose Tweet'][role='button'] {
      background-color: ${colors.base} !important;

      &:hover {
        background-color: ${colors.dark100} !important;
      }
    }

    .r-1nvazc9,
    .r15azkrj {
      background-color: ${transparentize(0.9, baseColor)} !important;
    }

    .css-1dbjc4n.r-sdzlij.r-7dny9e.r-tbmifm.r-16eto9q,
    .css-1dbjc4n.r-1awozwy.r-1xfd6ze.r-18u37iz.r-16y2uox.r-1hlnpa {
      background-color: ${colors.light300} !important;
    }

    .css-1dbjc4n.r-1awozwy.r-z2wwpe.r-d045u9.r-1loqt21.r-13awgt0.r-18u37iz.r-1bq2mok.r-adacv.r-1ny4l3l.r-d9fdf6 {
      border-color: ${colors.base} !important;
    }

    /* Loader */
    .css-1dbjc4n.r-17bb2tj.r-1muvv40.r-127358a.r-1ldzwu0 > svg {
      & > circle {
        stroke: ${colors.base} !important;
      }
    }
  `);
});
