const scriptEl = document.createElement('script');
scriptEl.src = chrome.extension.getURL('js/inject.js');
document.head.appendChild(scriptEl);

import CJSON from 'circular-json';
import * as BHelper from './util/browserHelper';
import timestampOnElement from './util/timestamp';

import { $, TIMESTAMP_INTERVAL } from './util/util';

let settings;

BHelper.settings.getAll((newSettings) => {
  settings = newSettings;
});

const _refreshTimestamps = () => {
  if (!$('.js-timestamp'))
    return;

  $('.js-timestamp').forEach((jsTimstp) => {
    const d = jsTimstp.getAttribute('data-time');
    $('a, span', jsTimstp).forEach((el) => timestampOnElement(el, d));
  });
};

const _tweakClassesFromVisualSettings = () => {
  const enabledClasses = Object.keys(settings.css).filter((key) => settings.css[key]).map((cl) => `btd__${cl}`);
  document.body.classList.add(...enabledClasses);

  if (settings.no_hearts)
    document.body.classList.remove('hearty');
};

// Prepare to know when TD is ready
const ready = new MutationObserver(() => {
  if (document.querySelector('.js-app-loading').style.display === 'none') {
    ready.disconnect();
    _tweakClassesFromVisualSettings();
  }
});
ready.observe(document.querySelector('.js-app-loading'), {
  attributes: true
});

// Refresh timestamps once and then set the interval
_refreshTimestamps();
setInterval(_refreshTimestamps, TIMESTAMP_INTERVAL);

const tweetHandler = (tweet) => {
  const ts = tweet.created;
  const node = $(`[data-key="${tweet.id}"]`)[0];

  // Modify timestamp if needed
  if ($('.js-timestamp a, .js-timestamp span', node))
    $('.js-timestamp a, .js-timestamp span', node).forEach((el) => timestampOnElement(el, ts));

  // If it got entities, it's a tweet
  if (tweet.entities && tweet.entities.urls) {
    tweet.entities.urls.forEach((url) => {
      if (settings.no_tco) {
        const anchor = $(`a[href="${url.url}"]`, node);

        if (anchor)
          anchor[0].setAttribute('href', url.expanded_url);
      }

    });
  } else {
    // If not, it's an activity
  }
};

document.addEventListener('BTD_uiDetailViewOpening', (ev) => {
  const detail = CJSON.parse(ev.detail);
  const tweets = detail.chirpsData;
  const columnNode = $(`section[data-column="${detail.columnKey}"]`)[0];

  tweets.forEach((tweet) => tweetHandler(tweet, columnNode));
});

document.addEventListener('BTD_uiVisibleChirps', (ev) => {
  const detail = CJSON.parse(ev.detail);
  const tweets = detail.chirpsData.map((data) => data.chirp);
  const columnNode = $(`section[data-column="${detail.columnKey}"]`)[0];

  tweets.forEach((tweet) => tweetHandler(tweet, columnNode));
});