import './logoVariations.css';

import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

import {makeBTDModule} from '../types/btdCommonTypes';

export enum BTDLogoVariations {
  DEFAULT = 'btd',
  AGENDER = 'agender',
  ASEXUAL = 'asexual',
  ANDROGYNE = 'androgyne',
  AROMANTIC = 'aromantic',
  BIGENDER = 'bigender',
  BISEXUAL = 'bisexual',
  DEMIGIRL = 'demigirl',
  DEMIGUY = 'demiguy',
  DEMINONBINARY = 'deminonbinary',
  DEMISEXUAL = 'demisexual',
  ENBIAN = 'enbian',
  GENDERFLUID = 'genderfluid',
  GENDERQUEER = 'genderqueer',
  INTERSEX = 'intersex',
  LESBIAN = 'lesbian',
  NEUTROIS = 'neutrois',
  NON_BINARY = 'non binary',
  OMNISEXUAL = 'omnisexual',
  PANSEXUAL = 'pansexual',
  POLYAMORY = 'polyamory',
  POLYSEXUAL = 'polysexual',
  PROGRESS = 'progress',
  RAINBOW = 'rainbow',
  TRANS = 'trans',
}

export const BTDStandaloneLogo = () => {
  return (
    <div className="btd-logo-wrapper">
      <span className="btd-logo-base"></span>
      <span className="btd-logo-border"></span>
    </div>
  );
};

const BTDLogoInApp = () => (
  <h1 className="js-logo app-title btd-logo-title">
    <div className="is-hidden visible-in-contracted-header btd-logo-small">
      <BTDStandaloneLogo></BTDStandaloneLogo>
    </div>
    <div className="invisible-in-contracted-header btd-logo-full">
      <BTDStandaloneLogo></BTDStandaloneLogo>
      <div className="btd-logo-text">Better TweetDeck</div>
    </div>
  </h1>
);

export const changeLogo = makeBTDModule(({TD, settings}) => {
  const template = renderToStaticMarkup(<BTDLogoInApp></BTDLogoInApp>);
  TD.mustaches['topbar/app_title.mustache'] = template;

  const svgString = `
    <svg width="0" height="0">
      <clipPath id="btdLogoClip" clipPathUnits="objectBoundingBox">
        <path d="M0.891884 0H0.108116C0.0484009 0 0 0.0486878 0 0.108747V0.737364C0 0.797427 0.0484054 0.846111 0.108116 0.846111H0.348102L0.501076 1L0.65405 0.846111H0.891884C0.951599 0.846111 1 0.797423 1 0.737364V0.108747C1 0.0486838 0.951595 0 0.891884 0Z"></path>
      </clipPath>
      </svg>
  `;

  document.body.insertAdjacentHTML('beforeend', svgString);
  document.body.setAttribute('btd-logo', settings.logoVariation);
});
