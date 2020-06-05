import store from 'store';
import expirePlugin from 'store/plugins/expire';
import sessionStorages from 'store/storages/sessionStorage';

store.addPlugin(expirePlugin);

function getWithExpirePlugin() {
  function getWithExpire(superFn, key, fn, expire) {
    const value = this.get(key);
    if (value) {
      return Promise.resolve(value);
    }
    return fn().then((val) => {
      this.set(key, val, Date.now() + expire);
      return val;
    });
  }
  return {
    getWithExpire,
  };
}

export default store;
export const sessionStore = store.createStore(sessionStorages);

sessionStore.addPlugin(expirePlugin);
sessionStore.addPlugin(getWithExpirePlugin);
