import { provideModule } from '@/js/mixins'

const myStoreModule = {
  namespaced: true,
  state() {
    return {
      teams: [],
      // Default parameters. Used to determine if a request should be made
      params: {
        c: -1,
        e: -1,
        t: -1,
      }
    }
  },
  actions: {
    fetchTeams({ state, dispatch }, params = {}) {
      let reload = false;
      Object.entries(state.params).forEach(([key, p]) => {
        if ( ! params.hasOwnProperty(key)) {
          // Filter removed since last time
          if (p !== -1) {
            state.params[key] = -1;
            reload = true;
          }          
        }
        // Filter changed
        else if (params[key] !== p) {
          state.params[key] = params[key];
          reload = true;
        }
      });

      if (state.teams.length === 0 || reload) {
        return this.axios.get("/teams/list", { params: params })
          .then(response => state.teams = response.data)
          .catch(error => dispatch('addAxiosErrorMessage', error, {root: true}))
      }
    },
  }
}

const provideMyStoreModule = provideModule('teams', myStoreModule);

export default provideMyStoreModule;