import Vue from 'vue'
import Vuex from 'vuex'

import loginModule from './modules/login'
import partyBuilderModule from './modules/party-builder'

Vue.use(Vuex);

export function createStore () {
  return new Vuex.Store({
    modules: {
      login: loginModule,
      party_builder: partyBuilderModule,
    },
  })
}