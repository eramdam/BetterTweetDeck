import './gifModals.css';

import React from 'react';

import {FullscreenModal} from '../components/fullscreenModalWrapper';
import {maybeSetOverlayColorForMediaUrlInChirp} from '../helpers/colorHelpers';
import {closeFullscreenModal, openFullscreenModal} from '../helpers/modalHelpers';
import {getChirpFromElement} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const setupGifModals = makeBTDModule(({TD, settings, jq}) => {
  jq(document).on('click', 'video.js-media-gif', (e) => {
    const target = e.target instanceof HTMLVideoElement && e.target;

    if (!target) {
      return;
    }

    if (!target.closest('[data-key]')) {
      return;
    }

    const chirpData = getChirpFromElement(TD, target);

    if (!chirpData) {
      return;
    }

    const {chirp} = chirpData;

    const gifEntity = chirp.entities.media.find((m) => m.type === 'animated_gif');
    if (!gifEntity) {
      return;
    }

    const videoUrl = gifEntity.video_info.variants[0].url;

    e.stopPropagation();
    e.preventDefault();

    openFullscreenModal(
      <FullscreenModal onClose={closeFullscreenModal}>
        <video autoPlay loop src={videoUrl}></video>
      </FullscreenModal>
    );
    if (settings.useModernFullscreenImage) {
      maybeSetOverlayColorForMediaUrlInChirp(chirp, gifEntity.media_url_https);
    }
  });
});
