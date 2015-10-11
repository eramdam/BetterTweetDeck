console.debug(`Hello World`);
var ready = new MutationObserver(() => {
  if (document.querySelector('.js-app-loading').style.display === 'none') {
    ready.disconnect();
    let InjectScript = document.createElement('script');
    InjectScript.src = chrome.extension.getURL('js/inject.js');
    document.head.appendChild(InjectScript);
    console.debug(localStorage);
  }
});

ready.observe(document.querySelector('.js-app-loading'), {
  attributes: true
});
// console.debug(localStorage.currentAuthType);
