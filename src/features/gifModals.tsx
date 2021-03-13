import './gifModals.css';

import React from 'dom-chef';
import {saveAs} from 'file-saver';

import {makeFullscreenModalWrapper} from '../components/fullscreenModalWrapper';
import {maybeSetOverlayColorForMediaUrlInChirp} from '../helpers/colorHelpers';
import {dataURItoBlob, isHtmlVideoElement} from '../helpers/domHelpers';
import {closeFullscreenModal, openFullscreenModal} from '../helpers/modalHelpers';
import {getChirpFromElement} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export const setupGifModals = makeBTDModule(({TD, settings, jq}) => {
  // const filenameRenderer = Hogan.compile(settings.downloadFilenameFormat);

  jq(document).on('click', 'video.js-media-gif', (e) => {
    const target = isHtmlVideoElement(e.target) && e.target;

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
    console.log(gifEntity);
    if (!gifEntity) {
      return;
    }

    const videoUrl = gifEntity.video_info.variants[0].url;

    e.stopPropagation();
    e.preventDefault();
    const videoEl = <video autoPlay loop src={videoUrl}></video>;

    const videoModal = makeFullscreenModalWrapper({
      onClose: closeFullscreenModal,
      children: videoEl,
    });

    openFullscreenModal(videoModal);
    if (settings.useModernFullscreenImage) {
      maybeSetOverlayColorForMediaUrlInChirp(chirp, gifEntity.media_url_https);
    }
  });

  window.addEventListener('message', onMessageEvent);

  function onMessageEvent(ev: MessageEvent) {
    if (!ev.origin.includes('better.tw')) {
      return;
    }

    if (ev.data.message === 'complete_gif') {
      const blob = dataURItoBlob(ev.data.img);

      saveAs(blob, ev.data.name);
    }
  }
});

{
  /* <a
href="#"
data-key={chirp.id}
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

  const iframeElement = document.createElement('iframe');
  iframeElement.src = iframeUrl;

  document.body.appendChild(iframeElement);
}}>
Download as .GIF
</a> */
}
