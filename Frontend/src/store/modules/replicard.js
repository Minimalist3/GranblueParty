import Vue from 'vue'

import { provideModule } from '@/js/mixins'

const INITIAL_DATA = () => {
  return {
    progression: {
      'E': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      'F': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      'G': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      'H': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    data_fetched: false,
  }
}

const myStoreModule = {
  namespaced: true,
  state() {
    return INITIAL_DATA();
  },
  mutations: {
    setReplicardData(state, value) {
      Vue.set(state, 'progression', value);
    },
    setReplicardFetched(state, value) {
      state.data_fetched = value;
    },
    resetReplicard(state) {
      Object.assign(state, INITIAL_DATA());
    }
  },
};

const provideMyStoreModule = provideModule('replicard', myStoreModule);

export default provideMyStoreModule;