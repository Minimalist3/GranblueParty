import Vue from 'vue'
import Axios from 'axios'

import App from '@/App.vue'
import Config from '@/js/config'
import router from '@/js/router'
import store from '@/store'

require('./app.css')
require('./robots.txt')
require('./favicon.ico')
require('./favicon.png')
require('./favicon-32.png')
require('./favicon-64.png')
require('./favicon-96.png')

// Use Axios globally
Vue.prototype.$http = Axios.create({
  baseURL: Config.app.baseURL,
  timeout: Config.app.timeout,
});
// Always send the cookie. This needs to be set globally, else it won't work
Vue.prototype.$http.defaults.withCredentials = true;

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