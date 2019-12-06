import Vue from 'vue'
import Vuex from 'vuex'

import loginModule from './modules/login'
import partyBuilderModule from './modules/party-builder'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    loginModule,
    partyBuilderModule
  },
})