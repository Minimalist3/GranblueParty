const INITIAL_DATA = () => {
  return {
    my_lists: [{name: 'Default list', data: []}],
    list_index: 0,
    list_fetched: false,
  }
}

export default {
  namespaced: true,
  state() {
    return INITIAL_DATA();
  },
  mutations: {
    setMyLists(state, value) {
      state.my_lists = value;
    },
    setListIndex(state, value) {
      state.list_index = value;
    },
    setListFetched(state, value) {
      state.list_fetched = value;
    },
    resetMyLists(state) {
      Object.assign(state, INITIAL_DATA());
    }
  },
}