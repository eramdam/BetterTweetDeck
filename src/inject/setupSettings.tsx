import {css} from '@emotion/css';
import React from 'react';
import {browser} from 'webextension-polyfill-ts';

import {makeSettingsButton} from '../components/openBtdSettingsButton';
import {openFullscreenModalWithReactElement} from '../features/thumbnails/thumbnailHelpers';
import {insertDomChefElement} from '../helpers/typeHelpers';
import {AbstractTweetDeckSettings} from '../types/abstractTweetDeckSettings';
import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';

export type OnSettingsUpdateAsync = (
  newBtdSettings: BTDSettings,
  newTdSettings: AbstractTweetDeckSettings
) => void;
export type OnSettingsUpdate = (
  newBtdSettings: BTDSettings,
  newTdSettings: AbstractTweetDeckSettings
) => void;

export const setupSettings = () => {
  const settingsButton = makeSettingsButton({
    onClick: () => {
      const settingsModal = (
        <iframe
          src={browser.extension.getURL('./options/index.html')}
          className={css`
            position: fixed;
            z-index: 999;
            height: 75vh;
            width: 75vw;
            max-width: 980px;
            border: 0;
            border-radius: 10px;
            @media (min-height: 640px) {
              min-width: 980px;
              max-height: 1100px;
            }
            @media (max-height: 640px) {
              width: 100vw;
              height: 80vh;
            }
          `}
        />
      );
      openFullscreenModalWithReactElement(settingsModal);
    },
  });

  document
    .querySelector('.app-navigator [data-action="settings-menu"]')
    ?.insertAdjacentElement('beforebegin', insertDomChefElement(settingsButton));
};
