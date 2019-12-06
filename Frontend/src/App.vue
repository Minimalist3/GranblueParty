<template>
  <div id="app" class="text-primary bg-primary min-h-screen" :class="theme_dark ? 'theme-dark' : 'theme-light'" @click="closePopup($event)">
    <!-- Menu -->
    <nav class="bg-secondary shadow-md h-12 flex flex-row flex-wrap justify-between items-center">
      <!-- left -->
      <div class="flex flex-row">
        <router-link to="/" class="flex items-center hover:bg-tertiary px-2">
          <img title="Home" src="/favicon-32.png" width="32" height="32">
        </router-link>

        <!-- For desktop -->
        <div class="hidden lg:flex lg:h-12">
          <router-link class="px-2 flex items-center hover:bg-tertiary text-primary hover:text-primary" to="/builder">Party Builder</router-link>
          <router-link class="px-2 flex items-center hover:bg-tertiary text-primary hover:text-primary" to="/collection">My Collection</router-link>
          <router-link class="px-2 flex items-center hover:bg-tertiary text-primary hover:text-primary" to="/release">Release Schedule</router-link>
          <router-link class="px-2 flex items-center hover:bg-tertiary text-primary hover:text-primary" to="/friendsum">Friend Summons</router-link>
          <router-link class="px-2 flex items-center hover:bg-tertiary text-primary hover:text-primary" to="/dailygrind">Daily Grind List</router-link>
          <div class="relative px-2 flex items-center hover:bg-tertiary text-primary hover:text-primary gbf-menu-hoverable">
            <span class="select-none">Calculators <fa-icon :icon="['fas', 'angle-down']" size="lg"></fa-icon></span>

            <div class="absolute left-0 top-full pb-2 bg-secondary shadow-md rounded-b border-t border-primary gbf-menu-hover z-40">
              <router-link class="p-2 pr-8 hover:bg-tertiary text-primary hover:text-primary" to="/calcevoker">Evokers</router-link>
              <router-link class="p-2 pr-8 hover:bg-tertiary text-primary hover:text-primary whitespace-no-wrap" to="/calcgw">Guild Wars Tokens</router-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- right -->
      <div class="flex flex-row items-center">
        <div v-if="getUsername === null">
          <button class="btn btn-blue mx-2" @click="show_modal_signup = true">Sign up</button>
          <button class="btn btn-white mx-2" @click="show_modal_login = true">Log in</button>
        </div>

        <!-- Burger -->
        <button class="px-2 focus:outline-none" @click="menu_popup = ! menu_popup" id="menu_burger">
          <fa-icon :icon="['fas', 'bars']" class="text-primary text-xl hover:text-link-hover"></fa-icon>
        </button>
      </div>
    </nav>

    <!-- Menu popup -->
    <div class="bg-secondary shadow-md w-full lg:w-1/3 lg:rounded-bl absolute right-0 z-50" :class="menu_popup ? 'block' : 'hidden'" id="menu_popup">
      <!-- For mobile -->
      <div class="lg:hidden flex flex-col text-primary border-b border-primary">
        <router-link class="p-2 hover:bg-tertiary text-primary hover:text-primary" to="/builder">Party Builder</router-link>
        <router-link class="p-2 hover:bg-tertiary text-primary hover:text-primary" to="/collection">My Collection</router-link>
        <router-link class="p-2 hover:bg-tertiary text-primary hover:text-primary" to="/release">Release Schedule</router-link>
        <router-link class="p-2 hover:bg-tertiary text-primary hover:text-primary" to="/friendsum">Friend Summons</router-link>
        <router-link class="p-2 hover:bg-tertiary text-primary hover:text-primary" to="/dailygrind">Daily Grind List</router-link>
        
        <span class="p-2 select-none">Calculators <fa-icon :icon="['fas', 'angle-down']" size="lg"></fa-icon></span>
        <div class="px-2 flex flex-col bg-secondary">
          <router-link class="p-2 pr-8 hover:bg-tertiary text-primary hover:text-primary" to="/calcevoker">Evokers</router-link>
          <router-link class="p-2 pr-8 hover:bg-tertiary text-primary hover:text-primary" to="/calcgw">Guild Wars Tokens</router-link>
        </div>
      </div>

      <!-- Common -->
      <div v-if="getUsername !== null" class="flex flex-col text-primary border-b border-primary">
        <span class="p-2 select-none">Account: {{ getUsername }} <fa-icon :icon="['fas', 'angle-down']" size="lg"></fa-icon></span>
        <div class="px-2 flex flex-col bg-secondary">
          <router-link class="p-2 pr-8 hover:bg-tertiary text-primary hover:text-primary" to="/account">Properties</router-link>
          <a class="p-2 pr-8 hover:bg-tertiary text-primary hover:text-primary cursor-pointer" @click="doLogout()">Log out</a>
        </div>
      </div>

      <div class="p-2"><label class="cursor-pointer select-none hover:text-link-hover">
        <input type="checkbox" v-model="theme_dark" class="hidden">
        <span v-if="theme_dark"><fa-icon :icon="['fas', 'moon']"></fa-icon> Dark theme</span>
        <span v-else><fa-icon :icon="['fas', 'sun']"></fa-icon> Light theme</span>
      </label></div>

      <div class="p-2 select-none">{{ getJST }} JST</div>
    </div>

    <!-- Main page -->
    <main class="p-4">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="pt-12 text-xs text-center">
      <p>
        <a href="https://twitter.com/GranblueParty" target="_blank" class="pr-4">
          <fa-icon :icon="['fab', 'twitter']" class="text-primary text-lg"></fa-icon> @GranblueParty
        </a>
        <a href="https://github.com/Minimalist3/GranblueParty" target="_blank">
          <fa-icon :icon="['fab', 'github']" class="text-primary text-lg"></fa-icon> Minimalist3/GranblueParty
        </a>
      </p>
      <p>
        Granblue Fantasy content and materials are trademarks and copyrights of Cygames, Inc. or its licensors. All rights reserved.
      </p>
    </footer>

    <!-- Modals -->
    <modal-login v-model="show_modal_login" @user-logged="userLogged"></modal-login>
    <modal-signup v-model="show_modal_signup" @user-logged="userLogged"></modal-signup>
  </div>
</template>

<script>
import ModalLogin from '@/components/ModalLogin.vue'
import ModalSignup from '@/components/ModalSignup.vue'

const getJST_options = {
  timeZone: 'Asia/Tokyo',
  weekday: 'short',
  hour: 'numeric',
  minute: 'numeric',
}

export default {
  components: {
    ModalLogin,
    ModalSignup,
  },
  data() {
    return {
      now: new Date(),
      menu_popup: false,
      show_modal_login: false,
      show_modal_signup: false,
      theme_dark: true,
    }
  },
  methods: {
    userLogged(username, userId) {
      this.$store.commit({
        type:'login',
        username: username,
        userId: userId,
      });
      this.menu_popup = false;
    },
    doLogout() {
      this.$http.post('/user/logout')
        .finally(() => {
          this.$store.commit('logout');
          this.menu_popup = false;
          this.$router.push({name: "home"});
        });
    },
    closePopup(e) {
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
    }
  },
  computed: {
    getUsername() {
      return this.$store.getters.getUsername;
    },
    getJST() {
      return new Intl.DateTimeFormat("default", getJST_options).format(this.now);
    },
  },
  watch: {
    '$route.path'(to) {
      this.menu_popup = false;      
    }
  },
  created() {
    setInterval(() => this.now = new Date(), 1000 * 60);
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

</style>