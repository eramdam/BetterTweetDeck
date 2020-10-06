import React from 'react';

import {SettingsModal} from '../components/settings/settingsModal';
import {openFullscreenModal} from '../features/thumbnails/thumbnailHelpers';
import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export const setupSettings = makeBTDModule(({jq, settings}) => {
  jq(document).off('uiShowGlobalSettings');
  jq(document).on('uiShowGlobalSettings', () => {
    const settingsModal = <SettingsModal settings={settings}></SettingsModal>;

    console.log(settingsModal);
    openFullscreenModal(settingsModal);
  });
});
