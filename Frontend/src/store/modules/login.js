export default {
  state: {
    username: null,
    userId: null,
  },
  getters: {
    getUsername: state => {
      return state.username;
    },
    getUserId: state => {
      return state.userId;
    },
  },
  mutations: {
    login(state, object) {
      state.username = object.username;
      localStorage.setItem('username', object.username);
      state.userId = object.userId;
      localStorage.setItem('userId', object.userId);
    },
    logout(state) {
      state.username = null;
      localStorage.removeItem('username');
      state.userId = null;
      localStorage.removeItem('userId');
    },
  },
}