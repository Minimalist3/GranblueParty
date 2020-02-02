const INITIAL_DATA = () => {
  return {
    parties: [],
    selected_party: -1,      // Select Option value
    current_party: null,
    party_name: "",
  }
}

export default {
  namespaced: true,
  state() {
    return INITIAL_DATA();
  },
  getters: {
    getPartiesIndexMap: state => {
      let map = {};

      for (let i=0; i < state.parties.length; i++) {
        map[state.parties[i].id] = i+1;
      }
      return map;
    },
    getSelectedPartyIndex: (state, getters) => {
      if (getters.getPartiesIndexMap.hasOwnProperty(state.selected_party)) {
        return getters.getPartiesIndexMap[state.selected_party];
      }
      return 0;
    },
  },
  mutations: {
    setParties(state, value) {
      state.parties = value;
    },
    setCurrentParty(state, value) {
      state.current_party = value;
    },
    setPartyName(state, value) {
      state.party_name = value;
    },
    clearParties(state) {
      Object.assign(state, INITIAL_DATA());
    }
  },
  actions: {
    fetchParties({ commit }) {
      return this.axios.get('/party/list')
        .then(response => commit('setParties', response.data))
        .catch(error => console.log(error));
    },
    setSelectedParty({ state, getters, commit }, value) {
      state.selected_party = value;
      if (getters.getSelectedPartyIndex > 0) {
        commit('setPartyName', state.parties[getters.getSelectedPartyIndex - 1].name);
      }
      else { // When a party is deleted, selected_party is set to -1 again
        commit('setPartyName', "");
      }
    },
  }
}