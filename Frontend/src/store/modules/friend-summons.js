
import Vue from 'vue'

import Utils from '@/js/utils.js'

const DEFAULT_VALUES = {
  summons: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
}
// Helper to match categories with proper default values
const getDefaultValues = (data, category) => {
  if (Utils.isEmpty(data[category])) {
    return Utils.copy(DEFAULT_VALUES[category]);
  }
  if (data[category] instanceof Array) {          
    return data[category].map(e => Utils.isEmpty(e) ? {} : e);
  }
  return data[category];
};

export default {
  namespaced: true,
  state() {
    return {
      id: 1,
      summons: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    }
  },
  mutations: {
    setId(state, value) {
      state.id = value;
    },
  },
  actions: {
    fetchSummons({ state, dispatch }, data) {
      return this.axios.post('/party/load', { summons: data.s })
        .then(response => {
          state.summons = getDefaultValues(response.data, 'summons');

          while (state.summons.length < DEFAULT_VALUES.summons.length) {
            state.summons.push({});
          }

          if (data.ss) {
            for (let i=0; i<state.summons.length; i++) {
              if ( ! Utils.isEmpty(state.summons[i])) {
                Vue.set(state.summons[i], 'stars', data.ss[i]);
              }
            }
          }
        })
        .catch(error => dispatch('addAxiosErrorMessage', error, {root: true}))
    }
  }
}