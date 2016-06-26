// This module is used by the background page

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

const settingsKey = 'BTD_Settings';
const storage = chrome.storage.sync || chrome.storage.local;

export const getVersion = () => chrome.app.getDetails().version;
export const getUA = () => window.navigator.userAgent;

export const settings = {
  get(property, cb) {
    return this.getAll((settingsVal) => {
      cb(getKey(settingsVal, property));
    });
  },
  set(obj, cb) {
    this.getAll((currSettings) => {
      storage.set({
        [settingsKey]: Object.assign(currSettings, obj),
      }, () => {
        if (cb) {
          return cb();
        }

        return false;
      });
    });
  },
  getAll(done) {
    storage.get(settingsKey, (obj) => {
      done(obj[settingsKey]);
    });
  },
  setAll(newSettings, done, getBack = false) {
    storage.set({
      [settingsKey]: newSettings,
    }, () => {
      if (getBack) {
        return this.getAll(done);
      }

      return done();
    });
  },
};
