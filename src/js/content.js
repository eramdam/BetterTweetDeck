import CJSON from 'circular-json';
import * as BHelper from './util/browserHelper';
import timestampOnElement from './util/timestamp';

import { $, TIMESTAMP_INTERVAL } from './util/util';

let settings;

BHelper.settings.getAll((newSettings) => {
  settings = newSettings;
});

const scriptEl = document.createElement('script');
scriptEl.src = chrome.extension.getURL('js/inject.js');
document.head.appendChild(scriptEl);

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

const expandURL = (url, node) => {
  if (!settings.no_tco)
    return;

  const anchors = $(`a[href="${url.url}"]`, node);

  if (!anchors)
    return;

  anchors.forEach((anchor) => anchor.setAttribute('href', url.expanded_url));
};

const tweetHandler = (tweet) => {
  let ts;

  if (tweet.targetTweet && tweet.targetUser)
    ts = tweet.targetTweet.created;
  else
    ts = tweet.created;

  let nodes = $(`[data-key="${tweet.id}"]`);

  if (!nodes && tweet.messageThreadId)
    nodes = $(`[data-key="${tweet.messageThreadId}"]`);

  nodes.forEach((node) => {
    // Modify timestamp if needed
    if ($('.js-timestamp a, .js-timestamp span', node))
      $('.js-timestamp a, .js-timestamp span', node).forEach((el) => timestampOnElement(el, ts));

    // If it got entities, it's a tweet
    if (tweet.entities) {
      const urlsToChange = [...tweet.entities.urls, ...tweet.entities.media];
      urlsToChange.forEach((url) => expandURL(url, node));
    } else if (tweet.targetTweet && tweet.targetUser) {
      // If it got targetTweet it's an activity on a tweet
      const urlsToChange = [...tweet.targetTweet.entities.urls, ...tweet.targetTweet.entities.media];
      urlsToChange.forEach((url) => expandURL(url, node));
    }
  });
};

document.addEventListener('BTD_uiDetailViewOpening', (ev) => {
  const detail = CJSON.parse(ev.detail);
  const tweets = detail.chirpsData;
  const columnNode = $(`section[data-column="${detail.columnKey}"]`)[0];

  tweets.forEach((tweet) => tweetHandler(tweet, columnNode));
});

document.addEventListener('BTD_uiVisibleChirps', (ev) => {
  const detail = CJSON.parse(ev.detail);
  let tweets = detail.chirpsData.map((data) => data.chirp);
  const columnNode = $(`section[data-column="${detail.columnKey}"]`)[0];

  if (detail.chirpsData.some((data) => data.chirp.messages))
    tweets = tweets.concat(...detail.chirpsData.map((data) => data.chirp.messages[0]));


  tweets.forEach((tweet) => tweetHandler(tweet, columnNode));
});
