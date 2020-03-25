import { observable } from 'mobx';

export class AppStore {
  @observable
  appVersion: string = '1.0.1';
}

export class UserStore {
  @observable
  name: string = 'React';
}

export class Store {
  @observable
  user: UserStore = new UserStore();
  @observable
  app: AppStore = new AppStore();

  constructor(initialState?: Store) {
    if (initialState) {
      Object.keys(initialState).forEach(key => {
        const model = initialState[key];
        Object.keys(model).forEach(prop => {
          if (this[key].hasOwnProperty(prop)) {
            this[key][prop] = model[prop];
          }
        });
      });
    }
  }
}

function createStore(initialState) {
  const stores = new Store(initialState);

  return stores;
}

export default createStore;
