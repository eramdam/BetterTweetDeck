import {
  extendObservable,
} from 'mobx';
import {
  settings,
} from '../js/util/browserHelper';

class Store {
  constructor() {
    extendObservable(this, {
      foo: 'bar',
      _settings: {},
      get settings() {
        return Object.assign({}, this._settings);
      },
      set settings(obj) {
        this._settings = obj;
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
