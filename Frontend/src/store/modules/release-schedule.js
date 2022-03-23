import { provideModule } from '@/js/mixins'

const myStoreModule = {
  namespaced: true,
  state() {
    return {
      characters: [],
      summons: [],
    }
  },
  actions: {
    fetchCharacters({ state, dispatch }) {
      if (state.characters.length === 0) {
        return this.axios.get("/release/characters")
          .then(response => state.characters = response.data)
          .catch(error => dispatch('addAxiosErrorMessage', error, {root: true}))
      }
    },
    fetchSummons({ state, dispatch }) {
      if (state.summons.length === 0) {
        return this.axios.get("/release/summons")
          .then(response => state.summons = response.data)
          .catch(error => dispatch('addAxiosErrorMessage', error, {root: true}))
      }
    },
    makeDates({ state }) {
      state.characters.forEach(element => {
        element.rd = new Date(element.rd);
      });
      state.summons.forEach(element => {
        element.rd = new Date(element.rd);
      });
    }
  }
}

const provideMyStoreModule = provideModule('release', myStoreModule);

export default provideMyStoreModule;