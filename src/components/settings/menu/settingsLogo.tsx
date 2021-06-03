import '../../../features/logoTweaks.css';

import {css} from '@emotion/css';
import React, {FC} from 'react';

import {BTDLogoVariations, BTDStandaloneLogo} from '../../../features/logoTweaks';
import {getTransString} from '../../trans';
import {NewFeatureBadge} from '../components/newFeatureBadge';
import {BTDRadioSelectSettingsRow} from '../components/radioSelectSettingsRow';
import {SettingsMenuSectionProps} from '../settingsComponents';
import {settingsRegularText} from '../settingsStyles';

const variations = Object.values(BTDLogoVariations);
const variationLabels: {[k in BTDLogoVariations]: string} = {
  [BTDLogoVariations.DEFAULT]: getTransString('settings_default'),
  [BTDLogoVariations.AGENDER]: 'Agender',
  [BTDLogoVariations.ASEXUAL]: 'Asexual',
  [BTDLogoVariations.ANDROGYNE]: 'Androgyne',
  [BTDLogoVariations.AROMANTIC]: 'Aromantic',
  [BTDLogoVariations.BIGENDER]: 'Bigender',
  [BTDLogoVariations.BISEXUAL]: 'Bisexual',
  [BTDLogoVariations.DEMIGIRL]: 'Demigirl',
  [BTDLogoVariations.DEMIGUY]: 'Demiguy',
  [BTDLogoVariations.DEMINONBINARY]: 'Deminonbinary',
  [BTDLogoVariations.DEMISEXUAL]: 'Demisexual',
  [BTDLogoVariations.ENBIAN]: 'Enbian',
  [BTDLogoVariations.GENDERFLUID]: 'Genderfluid',
  [BTDLogoVariations.GENDERQUEER]: 'Genderqueer',
  [BTDLogoVariations.INTERSEX]: 'Intersex',
  [BTDLogoVariations.LESBIAN]: 'Lesbian (OG)',
  [BTDLogoVariations.LESBIAN_2]: 'Lesbian',
  [BTDLogoVariations.NEUTROIS]: 'Neutrois',
  [BTDLogoVariations.NON_BINARY]: 'Non-binary',
  [BTDLogoVariations.OMNISEXUAL]: 'Omnisexual',
  [BTDLogoVariations.PANSEXUAL]: 'Pansexual',
  [BTDLogoVariations.POLYAMORY]: 'Polyamory',
  [BTDLogoVariations.POLYSEXUAL]: 'Polysexual',
  [BTDLogoVariations.RAINBOW]: 'Rainbow',
  [BTDLogoVariations.TRANS]: 'Transgender',
};

const logoStyles = css`
  .settings-row-content {
    padding-top: 20px;
  }

  .settings-row-content > div {
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-auto-rows: auto;
    grid-gap: 20px;
    width: 100%;
    max-width: 850px;

    & > span {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-column-gap: 20px;
      align-items: center;
    }
  }
`;

const radioInputContentStyles = css`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 14px;
  align-items: center;
`;

export const SettingsLogo: FC<SettingsMenuSectionProps> = (props) => {
  const {settings, makeOnSettingsChange} = props;

  return (
    <div>
      <BTDRadioSelectSettingsRow
        className={logoStyles}
        settingsKey="logoVariation"
        onChange={makeOnSettingsChange('logoVariation')}
        initialValue={settings.logoVariation}
        fields={variations.map((logo) => {
          return {
            value: logo,
            searchTerm: variationLabels[logo],
            label: (
              <div className={radioInputContentStyles}>
                <div
                  btd-logo={logo}
                  className={css`
                    .btd-logo-wrapper,
                    .btd-logo-wrapper > .btd-logo-base,
                    .btd-logo-wrapper > span.btd-logo-border {
                      width: 52px !important;
                      height: 52px !important;
                    }

                    .btd-logo-wrapper > span.btd-logo-border {
                      display: none;
                    }

                    filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.5)) !important;
                  `}>
                  <BTDStandaloneLogo></BTDStandaloneLogo>
                </div>
                <div
                  className={css`
                    margin-top: -10px;
                    font-weight: 500;
                  `}>
                  {variationLabels[logo]}
                </div>
              </div>
            ),
          };
        })}>
        Logo variation <NewFeatureBadge introducedIn="4.1" />
      </BTDRadioSelectSettingsRow>
      <div className={settingsRegularText}>
        <p>
          The flags variations are based on the flags from{' '}
          <a href="https://mutant.tech">Mutant Standard emoji</a>, which are licensed under a{' '}
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
            Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
          </a>
          .
        </p>
      </div>
      <svg width="0" height="0">
        <clipPath id="btdLogoClip" clipPathUnits="objectBoundingBox">
          <path d="M0.891884 0H0.108116C0.0484009 0 0 0.0486878 0 0.108747V0.737364C0 0.797427 0.0484054 0.846111 0.108116 0.846111H0.348102L0.501076 1L0.65405 0.846111H0.891884C0.951599 0.846111 1 0.797423 1 0.737364V0.108747C1 0.0486838 0.951595 0 0.891884 0Z"></path>
        </clipPath>
      </svg>
    </div>
  );
};
