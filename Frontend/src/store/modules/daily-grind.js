import { provideModule } from '@/js/mixins'

class RaidList {
  constructor(name, data) {
    this.name = name;
    this.data = data;
    this.raid_index = 0;
  }
}

const INITIAL_DATA = () => {
  return {
    my_lists: [ new RaidList('Default list', []) ],
    current_list_index: 0,
    list_fetched: false,
  }
}

const myStoreModule = {
  namespaced: true,
  state() {
    return INITIAL_DATA();
  },
  mutations: {
    setMyLists(state, value) {
      state.my_lists = value;
    },
    setCurrentListIndex(state, value) {
      state.current_list_index = value;
    },
    setListFetched(state, value) {
      state.list_fetched = value;
    },
    resetMyLists(state) {
      Object.assign(state, INITIAL_DATA());
    }
  },
}

const grindStoreMixin = provideModule('daily_grind', myStoreModule);

export { grindStoreMixin, RaidList }