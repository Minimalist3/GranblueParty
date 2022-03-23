import { provideModule } from '@/js/mixins'

const myStoreModule = {
  namespaced: true,
  state() {
    return {
      party_name: "",
      video_url: null,
      current_party: null,
    }
  },
  mutations: {
    setPartyName(state, value) {
      state.party_name = value;
    },
    setCurrentParty(state, value) {
      state.current_party = value;
    },
    setVideoURL(state, value) {
      state.video_url = value;
    }
  },
}

const provideMyStoreModule = provideModule('parties', myStoreModule);

export default provideMyStoreModule;