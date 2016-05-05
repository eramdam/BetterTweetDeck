import CJSON from 'circular-json';
import each from 'promise-each';
import timestampOnElement from './util/timestamp';
import { send as sendMessage } from './util/messaging';
import * as Thumbnails from './util/tb';
import * as Templates from './util/templates';

import { $, TIMESTAMP_INTERVAL, on, sendEvent } from './util/util';

let settings;
const COLUMNS_MEDIA_SIZES = new Map();

sendMessage({ action: 'get_settings' }, (response) => {
  settings = response.settings;
});

const scriptEl = document.createElement('script');
scriptEl.src = chrome.extension.getURL('js/inject.js');
document.head.appendChild(scriptEl);

function _refreshTimestamps() {
  if (!$('.js-timestamp')) {
    return;
  }

  $('.js-timestamp').forEach((jsTimstp) => {
    const d = jsTimstp.getAttribute('data-time');
    $('a, span', jsTimstp).forEach((el) => timestampOnElement(el, d));
  });
}

function _tweakClassesFromVisualSettings() {
  const enabledClasses = Object.keys(settings.css)
                        .filter((key) => settings.css[key])
                        .map((cl) => `btd__${cl}`);

  document.body.classList.add(...enabledClasses);

  if (settings.no_hearts) {
    document.body.classList.remove('hearty');
  }
}

function expandURL(url, node) {
  const anchors = $(`a[href="${url.url}"]`, node);

  if (!settings.no_tco || !anchors) {
    return;
  }

  anchors.forEach((anchor) => anchor.setAttribute('href', url.expanded_url));
}

function thumbnailFromSingleURL(url, node, mediaSize) {
  const anchors = $(`a[href="${url.expanded_url}"]`, node);

  if (!anchors || !mediaSize) {
    return Promise.resolve();
  }

  const anchor = anchors[0];

  if (anchor.dataset.urlScanned === 'true' || $('.js-media', node)) {
    return Promise.resolve();
  }

  anchor.setAttribute('data-url-scanned', 'true');

  Thumbnails.thumbnailFor(url.expanded_url).then((data) => {
    if (!data) {
      return;
    }

    const tbUrl = data.thumbnail_url || data.url;
    const html = Templates.previewTemplate(tbUrl, url.expanded_url, mediaSize);

    if (mediaSize === 'large') {
      $('.tweet.js-tweet', node)[0].insertAdjacentHTML('afterend', html);
    } else {
      $('.tweet-body p', node)[0].insertAdjacentHTML('afterend', html);
    }

    $('.js-media-image-link', node)[0].addEventListener('click', (e) => {
      e.preventDefault();
    });
  });

  return Promise.resolve();
}

function thumbnailsFromURLs(urls, node, mediaSize) {
  return Promise.resolve(urls).then(each((url) => {
    if (url.type || url.sizes || Thumbnails.ignoreUrl(url.expanded_url)) {
      return false;
    }

    return thumbnailFromSingleURL(url, node, mediaSize);
  }));
}

function tweetHandler(tweet, columnKey, parent) {
  if (!parent) {
    parent = $(`.js-column[data-column="${columnKey}"]`)[0];
  }

  let nodes = $(`[data-key="${tweet.id}"]`, parent);

  if (!nodes && tweet.messageThreadId) {
    nodes = $(`[data-key="${tweet.messageThreadId}"]`, parent);
  }

  const mediaSize = COLUMNS_MEDIA_SIZES.get(columnKey);

  nodes.forEach((node) => {
    let urlsToChange = [];

    // If it got entities, it's a tweet
    if (tweet.entities) {
      urlsToChange = [...tweet.entities.urls, ...tweet.entities.media];
    } else if (tweet.targetTweet && tweet.targetUser) {
      // If it got targetTweet it's an activity on a tweet
      urlsToChange = [...tweet.targetTweet.entities.urls, ...tweet.targetTweet.entities.media];
    }

    if (urlsToChange.length > 0) {
      // We expand URLs
      urlsToChange.forEach(url => expandURL(url, node));

      const urlForThumbnail = urlsToChange.filter(url => !url.id).pop();

      if (!urlForThumbnail) {
        return;
      }
      // We pass a single URL even though the code is ready to handle multiples URLs
      // Maybe we could have a gallery or something when we have different URLs
      thumbnailsFromURLs([urlForThumbnail], node, mediaSize);
    }
  });
}

// Prepare to know when TD is ready
on('BTD_ready', () => {
  _tweakClassesFromVisualSettings();
  // Refresh timestamps once and then set the interval
  _refreshTimestamps();
  setInterval(_refreshTimestamps, TIMESTAMP_INTERVAL);

  sendEvent('fromContent', { foo: 'bar' });
});

on('DOMNodeInserted', (ev) => {
  if (!ev.target.hasAttribute || !ev.target.hasAttribute('data-key')) {
    return;
  }

  const chirpKey = ev.target.getAttribute('data-key');
  const colKey = ev.target.closest('.js-column').getAttribute('data-column');

  sendEvent('getChirpFromColumn', { chirpKey, colKey });
});

on('BTD_gotChirpForColumn', (ev) => {
  const { chirp, colKey } = CJSON.parse(ev.detail);

  tweetHandler(chirp, colKey);
});

on('BTD_uiDetailViewOpening', (ev) => {
  const detail = CJSON.parse(ev.detail);
  const tweets = detail.chirpsData;

  tweets.forEach((tweet) => tweetHandler(tweet, detail.columnKey));
});

on('BTD_columnMediaSizeUpdated', (ev) => {
  const { id, size } = CJSON.parse(ev.detail);

  COLUMNS_MEDIA_SIZES.set(id, size);
});

on('BTD_columnsChanged', (ev) => {
  const colsArray = CJSON.parse(ev.detail);

  if (COLUMNS_MEDIA_SIZES.size !== colsArray.length) {
    COLUMNS_MEDIA_SIZES.clear();
  }

  colsArray.filter(col => col).filter(col => col.model.state.settings.media_preview_size)
           .forEach(col => {
             const id = col.ui.state.columnKey;
             COLUMNS_MEDIA_SIZES.set(id, col.model.state.settings.media_preview_size);
           });
});
