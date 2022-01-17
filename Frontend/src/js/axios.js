import Axios from 'axios'
import Config from './config'

export default function getAxiosInstance(store, user) {
  let instance = Axios.create({
    baseURL: Config.app.baseURL,
    timeout: Config.app.timeout,
  });
  // Deal with 401 unauthorized
  instance.interceptors.response.use(
    response => response,
    error => {
      if (error && error.response && error.response.status === 401) {
        if (VUE_ENV === 'client') {
          store.commit('logout', false);
          store.commit('show_modal_login', true);
        }
      }
      return Promise.reject(error);
    }
  );
  // Always send the cookie. This needs to be set globally, else it won't work
  instance.defaults.withCredentials = true;

  if (user) {
    instance.defaults.headers.common['Cookie'] = 'jwt=' + user.jwt;
  }

  return instance;
}