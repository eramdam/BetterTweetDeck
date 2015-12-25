import fecha from 'fecha';
// import * as BHelper from './util/browserHelper';
// import * as logger from './util/logger';

import { $, TIMESTAMP_INTERVAL } from './util/util';

const injectScript = () => {
  const scriptEl = document.createElement('script');
  scriptEl.src = chrome.extension.getURL('js/inject.js');
  document.head.appendChild(scriptEl);
};

const _refreshTimestamps = () => {
  if (!$('.js-timestamp'))
    return;

  $('.js-timestamp').forEach((jsTimstp) => {
    const d = new Date(Number(jsTimstp.getAttribute('data-time')));
    $('a, span', jsTimstp).forEach((el) => el.innerHTML = fecha.format(d, 'MM/DD/YY hh:mm a'));
  });
};

// Prepare to know when TD is ready
const ready = new MutationObserver(() => {
  if (document.querySelector('.js-app-loading').style.display === 'none')
    ready.disconnect();
});
ready.observe(document.querySelector('.js-app-loading'), {
  attributes: true
});

// Inject script in the TD's page
injectScript();

// Refresh timestamps once and then set the interval
_refreshTimestamps();
setInterval(_refreshTimestamps, TIMESTAMP_INTERVAL);