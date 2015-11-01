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
const TIMESTAMP_INTERVAL = 1e3 * 8;


let InjectScript = document.createElement('script');
InjectScript.src = chrome.extension.getURL('js/inject.js');
document.head.appendChild(InjectScript);


// setInterval(() => {
//   log('refreshing timestamps', new Date());
//   _$('.js-timestamp').forEach((jsTimstp) => {
//     _$('a, span', jsTimstp).forEach((el) => el.innerHTML = 'Hello');
//   });
// }, TIMESTAMP_INTERVAL);


// document.addEventListener('BTD_uiVisibleChirps', (event) => {
//   console.log('BTD_uiVisibleChirps', JSON.parse(event.detail));
// });

// document.addEventListener('BTD_uiModalShowing', (event) => {
//   console.log('BTD_uiModalShowing', JSON.parse(event.detail));
// });