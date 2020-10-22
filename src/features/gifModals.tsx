import './gifModals.css';

import React from 'dom-chef';
import {saveAs} from 'file-saver';
import * as Hogan from 'hogan.js';
import qs from 'query-string';

import {makeFullscreenModalWrapper} from '../components/fullscreenModalWrapper';
import {listenToInternalBTDMessage} from '../helpers/communicationHelpers';
import {dataURItoBlob, isHTMLElement, isHtmlVideoElement} from '../helpers/domHelpers';
import {getFilenameDownloadData} from '../helpers/tweetdeckHelpers';
import {ChirpHandlerPayload} from '../inject/chirpHandler';
import {BTDUuidAttribute, makeBtdUuidSelector} from '../types/betterTweetDeck/btdCommonTypes';
import {BTDMessageOriginsEnum, BTDMessages} from '../types/betterTweetDeck/btdMessageTypes';
import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';
import {TweetDeckChirp} from '../types/tweetdeckTypes';
import {closeFullscreenModal, openFullscreenModal} from './thumbnails/thumbnailHelpers';

export function setupGifModals(settings: BTDSettings) {
  const gifChirpsCache = new Map<string, TweetDeckChirp>();
  const filenameRenderer = Hogan.compile(settings.downloadFilenameFormat);

  listenToInternalBTDMessage(
    BTDMessages.CHIRP_RESULT,
    BTDMessageOriginsEnum.CONTENT,
    async ({data}) => {
      if (data.name !== BTDMessages.CHIRP_RESULT) {
        return;
      }

      const {uuid, chirp} = data.payload as ChirpHandlerPayload;

      if (!chirp.entities) {
        return;
      }

      const gifEntity = chirp.entities.media.find((m) => m.type === 'animated_gif');

      if (!gifEntity) {
        return;
      }

      gifChirpsCache.set(uuid, chirp);

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

      gifChirpsCache.delete(uuid);
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

    const gifChirp = gifChirpsCache.get(uuid);

    if (!gifChirp) {
      return;
    }

    const gifEntity = gifChirp.entities.media.find((m) => m.type === 'animated_gif');

    if (!gifEntity) {
      return;
    }

    const videoUrl = gifEntity.video_info.variants[0].url;

    e.stopPropagation();
    e.preventDefault();
    const videoEl = <video autoPlay loop src={videoUrl}></video>;
    const videoWrapper = (
      <>
        {videoEl}
        <a
          href="#"
          style={{
            marginTop: 10,
          }}
          onClick={() => {
            const videoNode = videoEl as unknown;
            if (!isHtmlVideoElement(videoNode)) {
              return;
            }

            const gifShotOptions = {
              video: [videoNode.src],
              gifWidth: videoNode.videoWidth,
              gifHeight: videoNode.videoHeight,
              name: filenameRenderer.render(
                getFilenameDownloadData(gifChirp, videoUrl.replace('mp4', 'gif'))
              ),
              numFrames: Math.floor(videoNode.duration / 0.1),
              interval: 0.1,
              sampleInterval: 10,
            };
            const iframeUrl = `https://better.tw/gif?${qs.stringify(gifShotOptions)}`;
            console.log({iframeUrl, gifShotOptions});

            const iframeElement = document.createElement('iframe');
            iframeElement.src = iframeUrl;

            document.body.appendChild(iframeElement);
          }}>
          Download as .GIF
        </a>
      </>
    );

    const videoModal = makeFullscreenModalWrapper({
      onClose: closeFullscreenModal,
      children: videoWrapper,
    });

    openFullscreenModal(videoModal, uuid);
  });

  window.addEventListener('message', onMessageEvent);

  function onMessageEvent(ev: MessageEvent) {
    if (!ev.origin.includes('better.tw')) {
      return;
    }

    console.log(ev.data);

    if (ev.data.message === 'complete_gif') {
      const blob = dataURItoBlob(ev.data.img);

      saveAs(blob, ev.data.name);
    }
  }
}
