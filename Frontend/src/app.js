import Vue from 'vue'

import { library as faCore, config as faConfig } from '@fortawesome/fontawesome-svg-core'
import { faTwitter, faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import {
  faAngleDown, faAngleRight, faBars, faCheck, faExclamationTriangle, faExternalLinkAlt,
  faFile, faFolderOpen, faInfoCircle, faSearch, faShareAlt, faSun, faTimes, faTimesCircle, faTrash, faMoon, faSave,
  faToggleOn, faToggleOff, faWater, faUser, faClock, faFilePen, faFileLines,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as faVue } from '@fortawesome/vue-fontawesome'
import faCSS from '@fortawesome/fontawesome-free/css/svg-with-js.min.css'

require('./ads.txt')
require('./robots.txt')
require('./favicon.ico')
require('./favicon.png')
require('./favicon-32.png')
require('./favicon-64.png')
require('./favicon-96.png')
require('./css/app.css')

import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import HeadMixin from '@/js/mixin-head'
import getAxiosInstance from '@/js/axios'

// FontAwesome setup
faConfig.autoAddCss = false;
faCore.add(
  faTwitter, faGithub, faEnvelope, faAngleDown, faAngleRight, faBars, faCheck, faExclamationTriangle, faExternalLinkAlt,
  faFile, faFolderOpen, faInfoCircle, faSearch, faShareAlt, faSun, faTimes, faTimesCircle, faTrash, faMoon, faSave,
  faToggleOn, faToggleOff, faWater, faUser, faClock, faFilePen, faYoutube, faFileLines
);
Vue.component('fa-icon', faVue);

// Mixin for <Head> tags
Vue.mixin(HeadMixin);

// Set axios globally
Vue.mixin({
  beforeCreate () {
    this.axios = this.$root.axios;
  }
});

Vue.prototype.$isDebug = process.env.NODE_ENV !== 'production';

// Remove prod warning
Vue.config.productionTip = false;

export function createApp(userId = null, jwt = null) {
  // create router and store instances
  const store = createStore()

  const router = createRouter(store)

  const axios = getAxiosInstance(store, jwt);
  store.axios = axios;

  if (userId !== null) {
    store.commit('setUserId', userId);
  }

  // create the app instance, injecting both the router and the store
  const app = new Vue({
    router,
    store,
    render: h => h(App),
    data: {
      axios: axios
    }
  });

  // expose the app, the router and the store.
  return { app, router, store }
}