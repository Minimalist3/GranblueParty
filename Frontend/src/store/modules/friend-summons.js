import { provideModule } from '@/js/mixins'

const INITIAL_DATA = () => {
  return {
    id: 0,
    userId: null,
    summons: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    updated: 0,
    found: true,
  }
};

const myStoreModule = {
  namespaced: true,
  state() {
    return INITIAL_DATA();
  },
  mutations: {
    setId(state, value) {
      state.id = value;
    },
  },
  actions: {
    loadSummons({ state }, userId) {
      if ( ! userId) {
        Object.assign(state, INITIAL_DATA());
      }
      else if (userId !== state.userId) {
        Object.assign(state, INITIAL_DATA());

        return this.axios.get('/friendsum/load/' + userId)
        .then(response => {
          while (response.data.data.length < state.summons.length) {
            response.data.data.push({});
          }

          state.summons = response.data.data;
          state.id = response.data.gbfid;
          state.updated = response.data.updated;
          state.found = true;
          state.userId = userId;
        })
        .catch(_ => {
          state.found = false;
          state.userId = userId;
        });
      }
    },
  }
}

const provideMyStoreModule = provideModule('friends', myStoreModule);

export default provideMyStoreModule;