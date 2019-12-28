import Vue from 'vue'
import Axios from 'axios'

import { library as faCore } from '@fortawesome/fontawesome-svg-core'
import { faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import {
  faAngleDown, faAngleRight, faBars, faCheck, faExclamationTriangle, faExternalLinkAlt,
  faFile, faFolderOpen, faInfoCircle, faShareAlt, faSun, faTimes, faTimesCircle, faTrash, faMoon, faSave
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as faVue } from '@fortawesome/vue-fontawesome'

import App from './App.vue'
import Config from './js/config'
import router from './router'
import store from './store'

require('./css/app.css')
require('./robots.txt')
require('./favicon.ico')
require('./favicon.png')
require('./favicon-32.png')
require('./favicon-64.png')
require('./favicon-96.png')

// FontAwesome setup
faCore.add(
  faTwitter, faGithub, faEnvelope, faAngleDown, faAngleRight, faBars, faCheck, faExclamationTriangle, faExternalLinkAlt,
  faFile, faFolderOpen, faInfoCircle, faShareAlt, faSun, faTimes, faTimesCircle, faTrash, faMoon, faSave
);
Vue.component('fa-icon', faVue);

// Use Axios globally
Vue.prototype.$http = Axios.create({
  baseURL: Config.app.baseURL,
  timeout: Config.app.timeout,
});
// Always send the cookie. This needs to be set globally, else it won't work
Vue.prototype.$http.defaults.withCredentials = true;
// Deal with 401 unauthorized
Vue.prototype.$http.interceptors.response.use(
  response => response,
  error => {
    if (error && error.response && error.response.status === 401) {
      store.commit('logout', false);
      store.commit('show_modal_login', true);
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

// Remove prod warning
Vue.config.productionTip = false;

// Load state of localStorage
const username = localStorage.getItem('username');
const userId = localStorage.getItem('userId');
if (username) {
  store.commit({
    type: 'login',
    username: username,
    userId: userId,
  });
}

new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router,
})