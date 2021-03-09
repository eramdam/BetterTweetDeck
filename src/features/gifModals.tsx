import './gifModals.css';

import React from 'dom-chef';
import {saveAs} from 'file-saver';
import * as Hogan from 'hogan.js';
import qs from 'query-string';

import {makeFullscreenModalWrapper} from '../components/fullscreenModalWrapper';
import {dataURItoBlob, isHTMLElement, isHtmlVideoElement} from '../helpers/domHelpers';
import {closeFullscreenModal, openFullscreenModal} from '../helpers/modalHelpers';
import {getChirpFromElement, getFilenameDownloadData} from '../helpers/tweetdeckHelpers';
import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';
import {TweetDeckObject} from '../types/tweetdeckTypes';

export function setupGifModals(TD: TweetDeckObject, settings: BTDSettings) {
  const filenameRenderer = Hogan.compile(settings.downloadFilenameFormat);

  document.querySelector('.js-app')?.addEventListener('click', (e) => {
    const target = isHTMLElement(e.target) && e.target;

    if (!target) {
      return;
    }

    if (!target.matches('video')) {
      return;
    }

    const chirpNode = target.closest('[data-key]');

    if (!chirpNode) {
      return;
    }

    const chirp = getChirpFromElement(TD, chirpNode)?.chirp;

    if (!chirp) {
      return;
    }

    const gifEntity = chirp.entities.media.find((m) => m.type === 'animated_gif');

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
                getFilenameDownloadData(chirp, videoUrl.replace('mp4', 'gif'))
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

    openFullscreenModal(videoModal, chirp.id);
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
