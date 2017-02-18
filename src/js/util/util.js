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

    if (!ev.data.name || !ev.data.name.startsWith('BTDC_') || !listeners[ev.data.name]) {
      return false;
    }

    return listeners[ev.data.name](ev, JSON.parse(ev.data.detail));
  });
}

initPostMessageListener();


// element-closest | CC0-1.0 | github.com/jonathantneal/closest
if (typeof Element.prototype.matches !== 'function') {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector || function matches(selector) {
    const element = this;
    const elements = (element.document || element.ownerDocument).querySelectorAll(selector);
    let index = 0;

    while (elements[index] && elements[index] !== element) {
      ++index;
    }

    return Boolean(elements[index]);
  };
}

if (typeof Element.prototype.closest !== 'function') {
  Element.prototype.closest = function closest(selector) {
    let element = this;

    while (element && element.nodeType === 1) {
      if (element.matches(selector)) {
        return element;
      }

      element = element.parentNode;
    }

    return null;
  };
}
