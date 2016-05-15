export function $(sel, parent = document) {
  const arr = [].slice.call(parent.querySelectorAll(sel));

  return arr.length >= 1 ? arr : null;
}

export const TIMESTAMP_INTERVAL = 1e3 * 8;

export function on(...args) {
  return document.addEventListener(...args);
}

export function sendEvent(name, detail) {
  name = `BTDC_${name}`;
  window.postMessage({ name, detail }, 'https://tweetdeck.twitter.com');
}
