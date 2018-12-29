export const getUA = () => window.navigator.userAgent;

export const setClipboard = (text) => {
  const tc = $('.compose-text-container .js-compose-text');
  const orig = tc.val();
  const active = document.activeElement;
  tc.val(text);
  tc[0].focus();
  tc[0].setSelectionRange(0, text.length);
  document.execCommand('copy');
  tc.val(orig);
  active.focus();
};

// From https://github.com/lorenwest/node-config/blob/master/lib/config.js#L131-L152
const getKey = (object, property) => {
  const elems = Array.isArray(property) ? property : property.split('.');
  const name = elems[0];
  const value = object[name];

  if (elems.length <= 1) {
    return value;
  }

  if (typeof value !== 'object') {
    return undefined;
  }

  return getKey(value, elems.slice(1));
};

export const getExtensionUrl = (...args) => chrome.extension.getURL(...args);
export const isFirefox = getUA().includes('Firefox/');
export const isChrome = getUA().includes('Chrome/');

export const getBrowser = () => {
  if (isFirefox) {
    return 'firefox';
  } else if (isChrome) {
    return 'chrome';
  }
  // TODO: make sure we're right, else, return false
  return 'opera';
};

const storage = isFirefox ? chrome.storage.local : chrome.storage.sync;

export const getVersion = () =>
  chrome.runtime.getManifest().version_name ||
  chrome.runtime.getManifest().version;
export const getName = () => chrome.runtime.getManifest().name;
export const getIcons = () => {
  const icons = chrome.runtime.getManifest().icons;
  Object.keys(icons).forEach((key) => {
    icons[key] = getExtensionUrl(icons[key]);
  });

  return icons;
};

export const getMessage = (msg) => {
  const string = chrome.i18n.getMessage(msg);

  if (string === '') {
    throw new Error(`No Message found for ${msg} in locales`);
  }

  return string;
};
export const getUpgradeMessage = () =>
  getMessage('notification_upgrade').replace('{{version}}', getVersion());

export const settings = {
  get(property, cb, local) {
    return this.getAll((settingsVal) => {
      cb(getKey(settingsVal, property));
    }, local);
  },
  set(obj, cb, local) {
    this.getAll((currSettings) => {
      (local ? chrome.storage.local : storage).set(
        Object.assign(currSettings, obj),
        () => {
          if (cb) {
            return this.getAll(cb);
          }

          return false;
        },
      );
    }, local);
  },
  getAll(done, local) {
    (local ? chrome.storage.local : storage).get(null, (obj) => {
      done(obj);
    });
  },
};

export function getRandomToken() {
  // E.g. 8 * 32 = 256 bits token
  const randomPool = new Uint8Array(32);
  crypto.getRandomValues(randomPool);
  let hex = '';
  for (let i = 0; i < randomPool.length; i += 1) {
    hex += randomPool[i].toString(16);
  }
  // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
  return hex;
}
