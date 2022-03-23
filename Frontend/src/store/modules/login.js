// Always loaded

export default {
  state () {
    return {
      userId: null,
      username: null,
      email: null,
      show_modal_login: false,
    }
  },
  getters: {
    getUserId: state => {
      return state.userId;
    },
    getUsername: state => {
      return state.username;
    },
    getEmail: state => {
      return state.email;
    },
    showModalLogin: state => {
      return state.show_modal_login;
    },
  },
  mutations: {
    setUserId(state, userId) {
      state.userId = userId;
    },
    setEmail(state, email) {
      state.email = email;
    },
    logout(state, full = true) {
      if (full === true) {
        state.username = null;
      }
      state.userId = null;
      state.email = null;
    },
    show_modal_login(state, value) {
      state.show_modal_login = value;
    }
  },
  actions: {
    fetchUserInfos({ state, dispatch }) {
      if (state.userId !== null && state.username === null) {
        return this.axios.post("/user/infos")
          .then(response => {
            state.username = response.data.username;
            state.email = response.data.email;
          })
          .catch(error => dispatch('addAxiosErrorMessage', error, {root: true}))
      }
    },
  }
}