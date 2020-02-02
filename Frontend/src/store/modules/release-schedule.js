export default {
  namespaced: true,
  state() {
    return {
      characters: [],
      summons: [],
    }
  },
  actions: {
    fetchCharacters({ state }) {
      if (state.characters.length === 0) {
        return this.axios.get("/release/characters")
          .then(response => state.characters = response.data)
          .catch(error => console.log(error))
      }
    },
    fetchSummons({ state }) {
      if (state.summons.length === 0) {
        return this.axios.get("/release/summons")
          .then(response => state.summons = response.data)
          .catch(error => console.log(error))
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