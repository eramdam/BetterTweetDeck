import {
  extendObservable,
} from 'mobx';
import {
  settings,
} from '../js/util/browserHelper';

class Store {
  constructor() {
    extendObservable(this, {
      _settings: {},
      get settings() {
        return this._settings;
      },
      set settings(obj) {
        this._settings = obj;
      },
      saveSettings() {
        settings.set(this._settings);
      },
    });
  }
}

const store = new Store();
window.store = store;

settings.getAll((val) => {
  store.settings = val;
});

export default store;
