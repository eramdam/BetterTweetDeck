// Very simply wrapper to send messages to background page easily
export function send(message, cb) {
  return chrome.runtime.sendMessage(message, cb);
}

export function on(cb) {
  return chrome.runtime.onMessage.addListener(cb);
}

/**
 * Send messages to the content window with BTDC_ prefix
 */
export const proxyEvent = (name, detail = {}) => {
  name = `BTDC_${name}`;
  let cache = [];
  detail = JSON.stringify(detail, (key, val) => {
    if (typeof val === 'object' && val !== null) {
      if (cache.indexOf(val) !== -1 && !val.screenName) {
        return null;
      }
      cache.push(val);
    }

    return val;
  });
  cache = null;
  window.postMessage({ name, detail }, 'https://tweetdeck.twitter.com');
};

export const waitForMessageEvent = (win, name) => {
  return new Promise((resolve) => {
    const listener = (ev) => {
      if (!ev.origin.includes('tweetdeck.')) {
        return false;
      }

      if (!ev || !ev.data || !ev.data.name || ev.data.name !== name) {
        return false;
      }

      win.removeEventListener('message', listener);

      return resolve(ev.data.detail);
    };
    win.addEventListener('message', listener);
  });
};
