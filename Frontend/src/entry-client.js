import { createApp } from './app'

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
  // We initialize the store state with the data injected from the server
  store.replaceState(window.__INITIAL_STATE__)
}

// Load state of localStorage
const username = localStorage.getItem('username');
if (username) {
  store.commit({
    type: 'login_client',
    username: username,
  });
}

router.onReady(() => {
  app.$mount('#app')
})