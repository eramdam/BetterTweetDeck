import fecha from 'fecha';
import util from './util/util.js';
const _refreshTimestamps = () => {
  util.$('.js-timestamp').forEach((jsTimstp) => {
    const d = new Date(Number(jsTimstp.getAttribute('data-time')));
    util.$('a, span', jsTimstp).forEach((el) => el.innerHTML = fecha.format(d, 'MM/DD/YY hh:mm a'));
  });
};
const ready = new MutationObserver(() => {
  if (document.querySelector('.js-app-loading').style.display === 'none')
    ready.disconnect();
});

ready.observe(document.querySelector('.js-app-loading'), {
  attributes: true
});

const InjectScript = document.createElement('script');
InjectScript.src = chrome.extension.getURL('js/inject.js');
document.head.appendChild(InjectScript);


setInterval(_refreshTimestamps, util.TIMESTAMP_INTERVAL);

document.addEventListener('BTD_dataColumnFeedUpdated', (event) => {
  const detail = event.detail;
  console.log('dataColumnFeedUpdated', detail);
});

document.addEventListener('BTD_uiColumnUpdateMediaPreview', (event) => {
  console.log('BTD_uiColumnUpdateMediaPreview', JSON.parse(event.detail));
  console.log('BTD_uiColumnUpdateMediaPreview', event);
});

document.addEventListener('BTD_uiModalShowing', (event) => {
  console.log('BTD_uiModalShowing', JSON.parse(event.detail));
});