import CJSON from 'circular-json';
import each from 'promise-each';
import timestampOnElement from './util/timestamp';
import sendMessage from './util/messaging';
import * as Thumbnails from './util/tb';
import * as Templates from './util/templates';

import { $, TIMESTAMP_INTERVAL } from './util/util';

let settings;

sendMessage({ action: 'get_settings' }, (response) => {
  settings = response.settings;
});

const scriptEl = document.createElement('script');
scriptEl.src = chrome.extension.getURL('js/inject.js');
document.head.appendChild(scriptEl);

const COLUMNS_MEDIA_SIZES = new Map();

const _refreshTimestamps = () => {
  if (!$('.js-timestamp')) {
    return;
  }

  $('.js-timestamp').forEach((jsTimstp) => {
    const d = jsTimstp.getAttribute('data-time');
    $('a, span', jsTimstp).forEach((el) => timestampOnElement(el, d));
  });
};

const _tweakClassesFromVisualSettings = () => {
  const enabledClasses = Object.keys(settings.css)
                        .filter((key) => settings.css[key])
                        .map((cl) => `btd__${cl}`);

  document.body.classList.add(...enabledClasses);

  if (settings.no_hearts) {
    document.body.classList.remove('hearty');
  }
};

// Prepare to know when TD is ready
const ready = new MutationObserver(() => {
  if (document.querySelector('.js-app-loading').style.display === 'none') {
    ready.disconnect();
    _tweakClassesFromVisualSettings();
  }
});
ready.observe(document.querySelector('.js-app-loading'), {
  attributes: true,
});

const expandURL = (url, node) => {
  if (!settings.no_tco) {
    return;
  }

  const anchors = $(`a[href="${url.url}"]`, node);

  if (!anchors) {
    return;
  }

  anchors.forEach((anchor) => anchor.setAttribute('href', url.expanded_url));
};

const thumbnailFromSingleURL = (url, node, mediaSize) => {
  const anchors = $(`a[href="${url.expanded_url}"]`, node);

  if (!anchors || !mediaSize) {
    return Promise.resolve();
  }

  anchors.forEach((anchor) => {
    if (anchor.dataset.urlScanned === 'true') {
      return;
    }

    anchor.setAttribute('data-url-scanned', 'true');

    if ($('.js-media', node)) {
      return;
    }

    Thumbnails.thumbnailFor(url.expanded_url).then((data) => {
      if (!data) {
        return;
      }

      const tbUrl = data.thumbnail_url || data.url;
      const html = Templates.previewTemplate(tbUrl, url.expanded_url, mediaSize);
      const newNode = $(`[data-key="${node.getAttribute('data-key')}"]`)[0];

      if (mediaSize === 'large') {
        $('.tweet.js-tweet', newNode)[0].insertAdjacentHTML('afterend', html);
      } else {
        $('.tweet-body p', newNode)[0].insertAdjacentHTML('afterend', html);
      }

      $('.js-media-image-link', newNode)[0].addEventListener('click', (e) => {
        e.preventDefault();
      });
    });
  });
  return Promise.resolve();
};

const thumbnailsFromURLs = (urls, node, mediaSize) => Promise.resolve(urls).then(each((url) => {
  expandURL(url, node);

  if (url.type || url.sizes || Thumbnails.ignoreUrl(url.expanded_url)) {
    return false;
  }

  return thumbnailFromSingleURL(url, node, mediaSize);
}));

const tweetHandler = (tweet, columnKey) => {
  let nodes = $(`[data-key="${tweet.id}"]`);

  if (!nodes && tweet.messageThreadId) {
    nodes = $(`[data-key="${tweet.messageThreadId}"]`);
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

    thumbnailsFromURLs(urlsToChange, node, mediaSize);
  });
};

// Refresh timestamps once and then set the interval
_refreshTimestamps();
setInterval(_refreshTimestamps, TIMESTAMP_INTERVAL);

document.addEventListener('BTD_uiDetailViewOpening', (ev) => {
  const detail = CJSON.parse(ev.detail);
  const tweets = detail.chirpsData;

  tweets.forEach((tweet) => tweetHandler(tweet, detail.columnKey));
});

document.addEventListener('BTD_uiVisibleChirps', (ev) => {
  const detail = CJSON.parse(ev.detail);
  let tweets = detail.chirpsData.map((data) => data.chirp);

  if (detail.chirpsData.some((data) => data.chirp.messages)) {
    tweets = tweets.concat(...detail.chirpsData.map((data) => data.chirp.messages[0]));
  }

  tweets.forEach((tweet) => tweetHandler(tweet, detail.columnKey));
});

document.addEventListener('BTD_newColumnContent', (ev) => {
  const detail = CJSON.parse(ev.detail);
  const tweets = detail.updateArray;

  tweets.forEach((tweet) => tweetHandler(tweet, detail.model.privateState.key));
});

document.addEventListener('BTD_columnsChanged', (ev) => {
  const colsArray = CJSON.parse(ev.detail);

  if (COLUMNS_MEDIA_SIZES.size !== colsArray.length) {
    COLUMNS_MEDIA_SIZES.clear();
  }

  colsArray.forEach(col => {
    if (!col.model.state.settings.media_preview_size) {
      return;
    }

    const id = col.ui.state.columnKey;
    COLUMNS_MEDIA_SIZES.set(id, col.model.state.settings.media_preview_size);
  });
});
