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
  // Render the logo as a static string
  const template = renderToStaticMarkup(<BTDLogoInApp></BTDLogoInApp>);
  // Change the template into said string
  TD.mustaches['topbar/app_title.mustache'] = template;

  // Set the logo variation attribute
  document.body.setAttribute('btd-logo', settings.logoVariation);
});
