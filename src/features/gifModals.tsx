import './gifModals.css';

import React from 'dom-chef';

import {makeFullscreenModalWrapper} from '../components/fullscreenModalWrapper';
import {listenToInternalBTDMessage} from '../helpers/communicationHelpers';
import {isHTMLElement} from '../helpers/domHelpers';
import {ChirpHandlerPayload} from '../inject/chirpHandler';
import {BTDUuidAttribute, makeBtdUuidSelector} from '../types/betterTweetDeck/btdCommonTypes';
import {BTDMessageOriginsEnum, BTDMessages} from '../types/betterTweetDeck/btdMessageTypes';
import {closeFullscreenModal, openFullscreenModal} from './thumbnails/thumbnailHelpers';

export function setupGifModals() {
  const gifUrlsCache = new Map<string, string>();
  listenToInternalBTDMessage(
    BTDMessages.CHIRP_RESULT,
    BTDMessageOriginsEnum.CONTENT,
    async ({data}) => {
      if (data.name !== BTDMessages.CHIRP_RESULT) {
        return;
      }

      const {uuid, chirp} = data.payload as ChirpHandlerPayload;

      const gifEntity = chirp.entities.media.find((m) => m.type === 'animated_gif');

      if (!gifEntity) {
        return;
      }

      const videoUrl = gifEntity.video_info.variants[0].url;
      gifUrlsCache.set(uuid, videoUrl);

      const thumbnailNode = document.querySelector(
        `.column article[${BTDUuidAttribute}="${uuid}"] .js-tweet.tweet .js-media-gif`
      );

      if (!thumbnailNode) {
        return;
      }
    }
  );

  listenToInternalBTDMessage(
    BTDMessages.CHIRP_REMOVAL,
    BTDMessageOriginsEnum.CONTENT,
    async ({data}) => {
      if (data.name !== BTDMessages.CHIRP_RESULT) {
        return;
      }

      const {uuid} = data.payload;

      gifUrlsCache.delete(uuid);
    }
  );

  document.querySelector('.js-app')?.addEventListener('click', (e) => {
    const target = isHTMLElement(e.target) && e.target;

    if (!target) {
      return;
    }

    if (!target.matches('video')) {
      return;
    }

    const chirpNode = target.closest(makeBtdUuidSelector('data-btd-uuid'));

    if (!chirpNode) {
      return;
    }

    const uuid = chirpNode.getAttribute(BTDUuidAttribute);
    if (!uuid) {
      return;
    }

    const gifUrl = gifUrlsCache.get(uuid);

    if (!gifUrl) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();
    const videoEl = <video autoPlay loop src={gifUrl}></video>;

    const videoModal = makeFullscreenModalWrapper({
      onClose: closeFullscreenModal,
      children: videoEl,
    });

    openFullscreenModal(videoModal, uuid);
  });
}
