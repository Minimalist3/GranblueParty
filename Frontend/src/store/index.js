import Vue from 'vue'
import Vuex from 'vuex'

import { LANGUAGES } from '@/js/lang'
import loginModule from './modules/login'
import partyBuilderModule from './modules/party-builder'
import popupsModule from './modules/popups'

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state () {
      return {
        lang: LANGUAGES.EN,
      }
    },
    getters: {
      getLang: state => {
        return state.lang;
      },
    },
    mutations: {
      setLang(state, value) {
        state.lang = value;
      },
    },
    modules: {
      login: loginModule,
      party_builder: partyBuilderModule,
      popups: popupsModule,
    },
  })
}