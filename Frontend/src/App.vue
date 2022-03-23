<template>
  <div id="app" class="flex flex-col text-primary bg-primary min-h-screen" :class="getTheme" @click="closeMenu($event)">
    <!-- Menu -->
    <nav class="bg-tertiary shadow-md flex flex-row justify-between items-center">
      <!-- left -->
      <div class="flex flex-row">
        <router-link to="/" class="flex items-center hover:bg-tertiary px-2">
          <img title="Home" src="/favicon-32.png" max-width="initial" width="32" height="32">
        </router-link>

        <!-- For desktop: Compact menu -->
        <div v-if="menu_compact" class="hidden md:flex">
          <!-- Tools -->
          <div class="relative px-2 h-12 flex items-center hover:bg-tertiary text-primary hover:text-primary gbf-menu-hoverable">
            <span class="select-none">Tools <fa-icon :icon="['fas', 'angle-down']" size="lg"></fa-icon></span>

            <div class="absolute left-0 top-full pb-2 bg-tertiary shadow-md rounded-b border-t border-primary gbf-menu-hover z-30">
              <router-link class="gbf-menu-link" to="/builder">Party Builder</router-link>
              <router-link class="gbf-menu-link" to="/collection">My Collection</router-link>
              <router-link class="gbf-menu-link" to="/dailygrind">Daily Grind List</router-link>
              <router-link class="gbf-menu-link" to="/roomname">Room Name Generator</router-link>
              <router-link class="gbf-menu-link" to="/friendsum">Friend Summons</router-link>
              <router-link class="gbf-menu-link" to="/spark">Spark Maker</router-link>
            </div>
          </div>
          <!-- Data -->
          <div class="relative px-2 h-12 flex items-center hover:bg-tertiary text-primary hover:text-primary gbf-menu-hoverable">
            <span class="select-none">Data <fa-icon :icon="['fas', 'angle-down']" size="lg"></fa-icon></span>

            <div class="absolute left-0 top-full pb-2 bg-tertiary shadow-md rounded-b border-t border-primary gbf-menu-hover z-30">
              <router-link class="gbf-menu-link" to="/teams">Public Teams</router-link>
              <router-link class="gbf-menu-link" to="/release">Release Schedule</router-link>
              <router-link class="gbf-menu-link" to="/search">Search</router-link>
              <router-link class="gbf-menu-link" to="/replicard">Replicard Sandbox</router-link>
            </div>
          </div>
          <!-- Calculators -->
          <div class="relative px-2 h-12 flex items-center hover:bg-tertiary text-primary hover:text-primary gbf-menu-hoverable">
            <span class="select-none">Calculators <fa-icon :icon="['fas', 'angle-down']" size="lg"></fa-icon></span>

            <div class="absolute left-0 top-full pb-2 bg-tertiary shadow-md rounded-b border-t border-primary gbf-menu-hover z-30">
              <router-link class="gbf-menu-link" to="/calceternal">Eternals</router-link>
              <router-link class="gbf-menu-link" to="/calcevoker">Evokers</router-link>
              <router-link class="gbf-menu-link" to="/calcgw">Guild Wars Tokens</router-link>
              <router-link class="gbf-menu-link" to="/calcevent">New Event Tokens</router-link>
            </div>
          </div>
        </div>

        <!-- For desktop: Expanded menu -->
        <div v-else class="hidden md:flex md:flex-wrap">
          <router-link class="flex items-center gbf-menu-link h-12" to="/builder">Party Builder</router-link>
          <router-link class="flex items-center gbf-menu-link h-12" to="/collection">My Collection</router-link>
          <router-link class="flex items-center gbf-menu-link h-12" to="/dailygrind">Daily Grind List</router-link>
          <router-link class="flex items-center gbf-menu-link h-12" to="/roomname">Room Name Gen.</router-link>
          <router-link class="flex items-center gbf-menu-link h-12" to="/friendsum">Friend Summons</router-link>
          <router-link class="flex items-center gbf-menu-link h-12" to="/spark">Spark Maker</router-link>
          <router-link class="flex items-center gbf-menu-link h-12" to="/teams">Public Teams</router-link>
          <router-link class="flex items-center gbf-menu-link h-12" to="/release">Release Schedule</router-link>
          <router-link class="flex items-center gbf-menu-link h-12" to="/search">Search</router-link>
          <router-link class="flex items-center gbf-menu-link h-12" to="/replicard">Replicard Sandbox</router-link>
          <router-link class="flex items-center gbf-menu-link h-12" to="/calceternal">Eternals Calc.</router-link>
          <router-link class="flex items-center gbf-menu-link h-12" to="/calcevoker">Evokers Calc.</router-link>
          <router-link class="flex items-center gbf-menu-link h-12" to="/calcgw">Guild Wars Tokens Calc.</router-link>
          <router-link class="flex items-center gbf-menu-link h-12" to="/calcevent">New Event Tokens Calc.</router-link>
        </div>
      </div>
      
      <!-- right -->
      <div class="flex flex-row items-center">
        <div v-if="getUserId === null">
          <button class="btn btn-blue mx-2" @click="show_modal_signup = true">Sign up</button>
          <button class="btn btn-white mx-2" @click="show_modal_login = true">Log in</button>
        </div>

        <!-- Burger -->
        <button class="px-2 focus:outline-none" @click="menu_popup = ! menu_popup" id="menu_burger">
          <fa-icon :icon="['fas', 'bars']" class="text-primary text-xl hover:text-link-hover"></fa-icon>
        </button>
      </div>
    </nav>

    <!-- Main page -->
    <main class="p-4 grow relative">
      <!-- Menu popup -->
      <div class="bg-tertiary shadow-md w-full md:w-1/3 md:rounded-bl absolute right-0 top-0 z-40" :class="menu_popup ? 'block' : 'hidden'" id="menu_popup">
        <!-- For mobile -->
        <div class="md:hidden flex flex-col text-primary border-b border-primary">
          <span class="p-2 select-none">Tools <fa-icon :icon="['fas', 'angle-down']" size="lg"></fa-icon></span>
          <div class="px-2 flex flex-col bg-tertiary">
            <router-link class="gbf-menu-link" to="/builder">Party Builder</router-link>
            <router-link class="gbf-menu-link" to="/collection">My Collection</router-link>
            <router-link class="gbf-menu-link" to="/dailygrind">Daily Grind List</router-link>
            <router-link class="gbf-menu-link" to="/roomname">Room Name Generator</router-link>
            <router-link class="gbf-menu-link" to="/friendsum">Friend Summons</router-link>
            <router-link class="gbf-menu-link" to="/spark">Spark Maker</router-link>
          </div>
          
          <span class="p-2 select-none">Data <fa-icon :icon="['fas', 'angle-down']" size="lg"></fa-icon></span>
          <div class="px-2 flex flex-col bg-tertiary">
            <router-link class="gbf-menu-link" to="/teams">Public Teams</router-link>
            <router-link class="gbf-menu-link" to="/release">Release Schedule</router-link>
            <router-link class="gbf-menu-link" to="/search">Search</router-link>
            <router-link class="gbf-menu-link" to="/replicard">Replicard Sandbox</router-link>
          </div>

          <span class="p-2 select-none">Calculators <fa-icon :icon="['fas', 'angle-down']" size="lg"></fa-icon></span>
          <div class="px-2 flex flex-col bg-tertiary">
            <router-link class="gbf-menu-link" to="/calceternal">Eternals</router-link>
            <router-link class="gbf-menu-link" to="/calcevoker">Evokers</router-link>
            <router-link class="gbf-menu-link" to="/calcgw">Guild Wars Tokens</router-link>
            <router-link class="gbf-menu-link" to="/calcevent">New Events Tokens</router-link>
          </div>
        </div>

        <!-- Common -->
        <div v-if="getUserId !== null" class="flex flex-col text-primary border-b border-primary">
          <span class="p-2 select-none">Account: {{ getUsername }} <fa-icon :icon="['fas', 'angle-down']" size="lg"></fa-icon></span>
          <div class="px-2 flex flex-col bg-tertiary">
            <router-link class="gbf-menu-link" to="/account">Properties</router-link>
            <a class="gbf-menu-link cursor-pointer" @click="doLogout()">Log out</a>
          </div>
        </div>

        <div class="p-2 hidden md:block"><label class="cursor-pointer select-none hover:text-link-hover">
          <input type="checkbox" v-model="menu_compact" class="hidden">
          <span>Main menu: {{ menu_compact ? 'Compact' : 'Expanded' }}</span>
        </label></div>

        <div class="p-2"><label class="cursor-pointer select-none hover:text-link-hover">
          <input type="checkbox" v-model="lang" class="hidden">
          <span>{{ getLangLabel }}</span>
        </label></div>

        <div class="p-2 flex flex-row gap-x-4">
          Theme:
          <div class="cursor-pointer select-none hover:text-link-hover" title="Dark mode" @click="theme_dark = true"><fa-icon :icon="['fas', 'moon']"></fa-icon></div>
          <div class="cursor-pointer select-none hover:text-link-hover" title="Blue" @click="theme_dark = 'blue'"><fa-icon :icon="['fas', 'water']"></fa-icon></div>
          <div class="cursor-pointer select-none hover:text-link-hover" title="Light mode" @click="theme_dark = false"><fa-icon :icon="['fas', 'sun']"></fa-icon></div>
        </div>

        <div class="p-2 select-none">{{ getJST }} JST</div>
      </div>
      
      <router-view></router-view>
    </main>

    <!-- horizontal -->
    <google-ads
      class="self-center mt-12 mb-4"
      :adSlot="1279266386"
    ></google-ads>

    <!-- Footer -->
    <footer class="flex flex-col items-center bg-tertiary shadow-md w-full py-4 text-xs text-center">
      <p class="flex flex-wrap place-content-center">
        <a href="https://twitter.com/GranblueParty" target="_blank" class="pr-4">
          <fa-icon :icon="['fab', 'twitter']" class="text-primary text-lg"></fa-icon> @GranblueParty
        </a>
        <a href="https://github.com/Minimalist3/GranblueParty" target="_blank" class="pr-4">
          <fa-icon :icon="['fab', 'github']" class="text-primary text-lg"></fa-icon> Minimalist3/GranblueParty
        </a>
        <a href="https://www.minimalist.codes" target="_blank">
          <fa-icon :icon="['fas', 'external-link-alt']" class="text-primary text-lg"></fa-icon> minimalist.codes
        </a>
      </p>
      <p>
        <router-link to="/cookies">Cookie Policy</router-link> -
        <router-link to="/privacy">Privacy Policy</router-link> -
        <a href="#" @click.prevent="managePrivacy()">Manage Privacy Options</a>
      </p>
      <p>
        Granblue Fantasy content and materials are trademarks and copyrights of Cygames, Inc. or its licensors. All rights reserved.
      </p>
    </footer>

    <!-- Popups -->
    <div class="fixed bottom-0 right-0 z-50" data-nosnippet>
      <div @click="killPopup(key)" class="w-48 bg-secondary rounded border border-primary m-4 p-2 flex flex-col break-words" v-for="(msg, key) in getPopups" :key="key">
        <div class="flex justify-between">
          <span>{{ msg.title }}</span>
          <fa-icon @click="killPopup(key)" :icon="['fas', 'times-circle']" class="text-link-primary hover:text-link-hover text-xl cursor-pointer"></fa-icon>
        </div>
        <span class="text-sm">{{ msg.message }}</span>
        <div class="h-2 bg-tertiary rounded progress-animation" v-if="msg.timer"></div>
      </div>
    </div>

    <!-- Modals -->
    <modal-login v-model="show_modal_login" @user-logged="userLogged"></modal-login>
    <modal-signup v-model="show_modal_signup" @user-logged="userLogged"></modal-signup>
  </div>
</template>

<script>
import GoogleAds from '@/components/common/GoogleAds.vue'
import ModalLogin from '@/components/ModalLogin.vue'
import ModalSignup from '@/components/ModalSignup.vue'

import { LANGUAGES } from './js/lang'
import Utils from '@/js/utils.js'

const lsMgt = new Utils.LocalStorageMgt('App');

const getJST_options = {
  timeZone: 'Asia/Tokyo',
  weekday: 'short',
  hour: 'numeric',
  minute: 'numeric',
}

export default {
  components: {
    GoogleAds,
    ModalLogin,
    ModalSignup,
  },
  data() {
    return {
      now: new Date(),
      menu_popup: false,
      show_modal_signup: false,
      theme_dark: true,
      menu_compact: true,
    }
  },
  methods: {
    userLogged(username, userId) {
      this.$store.commit('setUserId', userId);
      this.$store.dispatch('fetchUserInfos');
      this.menu_popup = false;
    },
    doLogout() {
      this.axios.post('/user/logout')
        .catch(error => this.$store.dispatch('addAxiosErrorMessage', error))
        .finally(() => {
          this.$store.commit('logout');
          this.menu_popup = false;
        });
    },
    closeMenu(e) {
      if (this.menu_popup === true) {
        const isPopup = (elem) => {
          if (elem.id === 'menu_popup' || elem.id === 'menu_burger') {
            return true;
          }
          if (elem.parentElement === null) {
            return false;
          }
          return isPopup(elem.parentElement);
        }

        if ( ! isPopup(e.target)) {
          this.menu_popup = false;
        }
      }
    },
    killPopup(index) {
      this.$store.commit('removeMessage', index);
    },
    managePrivacy() {
      __tcfapi('displayConsentUi', 2, function() {});
    }
  },
  computed: {
    getUsername() {
      return this.$store.getters.getUsername;
    },
    getUserId() {
      return this.$store.getters.getUserId;
    },
    getPopups() {
      return this.$store.state.popups.messages;
    },
    getLangLabel() {
      if (this.$store.getters.getLang === LANGUAGES.EN) {
        return 'Display names in: English';
      }
      return '名: 日本語';
    },
    getTheme() {
      if (this.theme_dark === true) {
        return 'theme-dark';
      }
      if (this.theme_dark === false) {
        return 'theme-light';
      }
      return 'theme-blue';
    },
    lang: {
      get() {
        return this.$store.state.lang === LANGUAGES.EN;
      },
      set(value) {
        this.$store.commit('setLang', value ? LANGUAGES.EN : LANGUAGES.JP);
      }
    },
    show_modal_login: {
      get() {
        return this.$store.getters.showModalLogin;
      },
      set(value) {
        this.$store.commit('show_modal_login', value);
      }
    },
    getJST() {
      return new Intl.DateTimeFormat("default", getJST_options).format(this.now);
    },
  },
  serverPrefetch() {
    return this.$store.dispatch('fetchUserInfos');
  },
  watch: {
    '$route.path'(to, from) {
      this.menu_popup = false;
    },
    lang() {
      lsMgt.setValue('lang', this);
    },
    theme_dark() {
      lsMgt.setValue('theme_dark', this);
    },
    menu_compact() {
      lsMgt.setValue('menu_compact', this);
    },
  },
  mounted() {
    setInterval(() => this.now = new Date(), 1000 * 60);

    lsMgt.getValue(this, 'lang');
    lsMgt.getValue(this, 'theme_dark');
    lsMgt.getValue(this, 'menu_compact');

    // Undo adsense ruining page layout
    let wrapper = document.getElementById('app')
    const observer = new MutationObserver(function (mutations, observer) {
      wrapper.style.height = ''
      wrapper.style.minHeight = ''
    })
    observer.observe(wrapper, {
      attributes: true,
      attributeFilter: ['style']
    });
  }
}
</script>

<style scoped>

.gbf-menu-hoverable > .gbf-menu-hover {
  @apply hidden;
}

.gbf-menu-hoverable:hover > .gbf-menu-hover {
  @apply flex;
  @apply flex-col;
}

.gbf-menu-link {
  @apply p-2;
  @apply text-primary;
  @apply whitespace-nowrap;
}

.gbf-menu-link:hover {
  @apply bg-secondary;
  @apply text-primary;
}

.progress-animation {
  animation: progressAnimation 4s linear;
}

@keyframes progressAnimation {
  0%   { width: 100%; }
  100% { width: 0%; }
}

</style>