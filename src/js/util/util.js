const listeners = {};

export function $(sel, parent = document) {
  const arr = [].slice.call(parent.querySelectorAll(sel));

  return arr.length >= 1 ? arr : null;
}

export const TIMESTAMP_INTERVAL = 1e3 * 8;

export function on(name, cb) {
  listeners[name] = (ev, data) => cb(ev, data);
}

export function sendEvent(name, detail) {
  name = `BTDC_${name}`;
  window.postMessage({ name, detail }, 'https://tweetdeck.twitter.com');
}

function initPostMessageListener() {
  window.addEventListener('message', (ev) => {
    if (ev.origin.indexOf('tweetdeck.') === -1) {
      return false;
    }

    if (!ev.data.name.startsWith('BTDC_') || !listeners[ev.data.name]) {
      return false;
    }

    return listeners[ev.data.name](ev, JSON.parse(ev.data.detail));
  });
}

initPostMessageListener();
