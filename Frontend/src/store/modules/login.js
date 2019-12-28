export default {
  state: {
    username: null,
    userId: null,
    show_modal_login: false,
  },
  getters: {
    getUsername: state => {
      return state.username;
    },
    getUserId: state => {
      return state.userId;
    },
    showModalLogin: state => {
      return state.show_modal_login;
    },
  },
  mutations: {
    login(state, object) {
      state.username = object.username;
      localStorage.setItem('username', object.username);
      state.userId = object.userId;
      localStorage.setItem('userId', object.userId);
    },
    logout(state, full = true) {
      if (full === true) {
        state.username = null;
        localStorage.removeItem('username');
      }
      state.userId = null;
      localStorage.removeItem('userId');
    },
    show_modal_login(state, value) {
      state.show_modal_login = value;
    }
  },
}