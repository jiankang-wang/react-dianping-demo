/* global window */
import { sessionStore } from '../../store';
const redirect = (() => {
  let doing = false;
  return (url) => {
    if (!doing) {
      doing = true;
      window.location.replace(url);
    }
  };
})();

export default function redirectLogin(axios) {
  axios.interceptors.response.use((res) => {
    if (res.data && [401, 403].includes(res.data.code)) {
      sessionStore.remove('loginStatus');
      redirect(`https://login.weidiango.com?from=${encodeURIComponent(window.location.href)}`);
    }
    return res;
  }, (error) => {
    if ([401, 403].includes(error.response.status)) {
      sessionStore.remove('loginStatus');
      redirect(`https://login.weidiango.com?from=${encodeURIComponent(window.location.href)}`);
    }
    return Promise.reject(error);
  })
}