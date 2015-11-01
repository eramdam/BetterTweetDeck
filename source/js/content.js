// var ready = new MutationObserver(() => {
//   if (document.querySelector('.js-app-loading').style.display === 'none') {
//     ready.disconnect();

//   }
// });

// ready.observe(document.querySelector('.js-app-loading'), {
//   attributes: true
// });

const _$ = (sel, parent=null) => {
  let arr;

  if (!parent)
    arr = [].slice.call(document.querySelectorAll(sel));
  else
    arr = [].slice.call(parent.querySelectorAll(sel));


  if (arr.length >= 1)
    return arr;

  return null;
};
const log = (...args) => {
  console.log(...args);
};
// const TIMESTAMP_INTERVAL = 1e3 * 8;
// const _refreshTimestamps = () => {
//   _$('.js-timestamp').forEach((jsTimstp) => {
//     let d = new Date(Number(jsTimstp.getAttribute('data-time')));
//     _$('a, span', jsTimstp).forEach((el) => el.innerHTML = fecha.format(d, 'MM/DD/YY hh:mm a'));
//   });
// };
// import fecha from 'fecha';
// console.log(fecha.format(new Date(Number(1446349356000)), 'MM/DD/YY hh:mm a'));

let InjectScript = document.createElement('script');
InjectScript.src = chrome.extension.getURL('js/inject.js');
document.head.appendChild(InjectScript);


// setInterval(_refreshTimestamps, TIMESTAMP_INTERVAL);

// document.addEventListener('BTD_dataColumnFeedUpdated', (event) => {
//   let detail = event.detail;

//   console.log('dataColumnFeedUpdated', detail);
// });

// document.addEventListener('BTD_uiColumnUpdateMediaPreview', (event) => {
//   console.log('BTD_uiColumnUpdateMediaPreview', JSON.parse(event.detail));
//   console.log('BTD_uiColumnUpdateMediaPreview', event);
// });

document.addEventListener('BTD_uiModalShowing', (event) => {
  console.log('BTD_uiModalShowing', JSON.parse(event.detail));
});