// From https://github.com/lorenwest/node-config/blob/master/lib/config.js#L131-L152
const getKey = (object, property) => {
  const elems = Array.isArray(property) ? property : property.split('.');
  const name = elems[0];
  const value = object[name];

  if (elems.length <= 1)
    return value;

  if (typeof value !== 'object')
    return undefined;

  return getKey(value, elems.slice(1));
};

const _settingKey = 'BTD3Settings';

export const getVersion = () => chrome.app.getDetails().version;

export const settings = {
  get(property, cb) {
    return this.getAll((settings) => {
      cb(getKey(settings, property));
    });
  },
  set(obj, cb) {
    this.getAll((currSettings) => {
      chrome.storage.sync.set({
        [_settingKey]: Object.assign(currSettings, obj)
      }, () => {
        if (cb)
          return cb();
      });
    });
  },
  getAll(done) {
    chrome.storage.sync.get(_settingKey, (obj) => {
      done(obj[_settingKey]);
    });
  },
  setAll(settings, done, getBack = false) {
    chrome.storage.sync.set({
      [_settingKey]: settings
    }, () => {
      if (getBack)
        return this.getAll(done);

      return done();
    });
  }
};