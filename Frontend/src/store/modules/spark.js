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
        return this.axios.get("/spark/characters")
          .then(response => state.characters = response.data)
          .catch(error => dispatch('addAxiosErrorMessage', error, {root: true}))
      }
    },
    fetchSummons({ state, dispatch }) {
      if (state.summons.length === 0) {
        return this.axios.get("/spark/summons")
          .then(response => state.summons = response.data)
          .catch(error => dispatch('addAxiosErrorMessage', error, {root: true}))
      }
    }
  }
}

const provideMyStoreModule = provideModule('spark', myStoreModule);

export default provideMyStoreModule;