const fs = require('fs');

const packageJson = JSON.parse(fs.readFileSync(`${__dirname}/../../../package.json`, 'utf8'));

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

export const getVersion = () => packageJson.extension_version;

export const getMessage = (msg) => {
  const string = chrome.i18n.getMessage(msg);

  if (string === '') {
    throw new Error(`No Message found for ${msg} in locales`);
  }

  return string;
};
export const getUpgradeMessage = () => getMessage('notification_upgrade').replace('{{version}}', getVersion());

export const settings = {
  get(property, cb) {
    return this.getAll((settingsVal) => {
      cb(getKey(settingsVal, property));
    });
  },
  set(obj, cb) {
    this.getAll((currSettings) => {
      storage.set(Object.assign(currSettings, obj), () => {
        if (cb) {
          return this.getAll(cb);
        }

        return false;
      });
    });
  },
  getAll(done) {
    storage.get(null, (obj) => {
      done(obj);
    });
  },
};
