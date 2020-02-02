const INITIAL_DATA = () => {
  return {
    characters: [[], [], [], [], [], [], []],      
    summons: [[], [], [], [], [], [], []],
    chara_count: {
      null: 0, 10: 0, 20: 0,
      1000: 0, 1010: 0, 1020: 0, 1030: 0, 1040: 0, 1050: 0,
      1500: 0, 1600: 0,
      'sum': 0,
    },
    chara_total: {
      null: 0, 10: 0, 20: 0,
      1000: 0, 1010: 0, 1020: 0, 1030: 0, 1040: 0, 1050: 0,
      1500: 0, 1600: 0,
      'sum': 0,
    },
    summon_count: {
      null: 0, 20: 0,
      1000: 0, 1030: 0,
      1600: 0,
      'sum': 0,
    },
    summon_total: {
      null: 0, 20: 0,
      1000: 0, 1030: 0,
      1600: 0,
      'sum': 0,
    },
    user_id: -1
  }
};

export default {
  namespaced: true,
  state() {
    return INITIAL_DATA();
  },
  actions: {
    fetchCollection({ state }, userId) {
      if (state.user_id !== userId) {
        // Reset the store
        Object.assign(state, INITIAL_DATA());
        state.user_id = userId;

        return Promise.all([
          this.axios.get("/tracker/charas/" + userId)
            .then(response => {
              response.data.forEach(chara => {
                state.characters[chara.e].push(chara);
                if (chara.owned) {
                  state.chara_count.sum++;
                  state.chara_count[chara.d]++;
                }
                state.chara_total[chara.d]++;
              });
              state.chara_total.sum = response.data.length;
            })
            .catch(error => console.log(error)),

          this.axios.get("/tracker/summons/" + userId)
            .then(response => {
              response.data.forEach(summ => {
                state.summons[summ.e].push(summ)
                if (summ.owned) {
                  state.summon_count.sum++;
                  state.summon_count[summ.d]++;
                }
                state.summon_total[summ.d]++;
              });
              state.summon_total.sum = response.data.length;
            })
            .catch(error => console.log(error))
          ]);
      }
    },
  }
}