import Vue from 'vue'

export default {
  state() {
    return {
      messages: {}, // {title: '', message: ''}
      last_message_index: 0
    }
  },
  mutations: {
    removeMessage(state, index) {
      Vue.delete(state.messages, index);
    }
  },
  actions: {
    addMessage({ state, commit }, value) {
      if (process.env.VUE_ENV !== 'server' && value.timer !== false) {
        const index = state.last_message_index;
        setTimeout(() => commit('removeMessage', index), 1000 * 4);
        value.timer = true;
      }
      Vue.set(state.messages, state.last_message_index, value);
      state.last_message_index++;
    },
    addAxiosErrorMessage({ dispatch }, error) {
      let msg = { title: 'Error', timer: false }

      if (error.response.data) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data.error && error.response.data.error.message) {
          msg.message = error.response.data.error.message;
        }
        else {
          msg.message = error.response.data;
        }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser
        msg.message = "Cannot contact API server";
      } else {
        // Something happened in setting up the request that triggered an Error
        msg.message = error.message;
      }

      dispatch('addMessage', msg);
    }
  }
}