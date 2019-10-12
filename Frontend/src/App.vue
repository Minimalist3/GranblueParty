<template>
    <div id="app">

      <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <div class="navbar-item has-dropdown is-hoverable">
            <router-link to="/" class="navbar-link is-arrowless">
              <img title="Home" src="/favicon-32.png" width="32" height="32">
            </router-link>

            <div class="navbar-dropdown">
              <div class="navbar-item is-unselectable">
                {{ getJST }} JST
              </div>
            </div>
          </div>

          <a role="button" class="navbar-burger burger" :class="navbar_active ? 'is-active' : ''" @click="navbar_active = ! navbar_active" aria-label="menu" aria-expanded="false" data-target="navbarParty">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarParty" class="navbar-menu" :class="navbar_active ? 'is-active' : ''">
          <div class="navbar-start">
            <router-link class="navbar-item" to="/builder">Party Builder</router-link>
            <router-link class="navbar-item" to="/collection">My Collection</router-link>
            <router-link class="navbar-item" to="/release">Release Schedule</router-link>
            <router-link class="navbar-item" to="/friendsum">Friend Summons</router-link>
            <router-link class="navbar-item" to="/dailygrind">Daily Grind List</router-link>

            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                Calculators
              </a>

              <div class="navbar-dropdown">
                <router-link class="navbar-item" to="/calcevoker">Evokers</router-link>
                <router-link class="navbar-item" to="/calcgw">Guild Wars Tokens</router-link>
              </div>
            </div>
          </div>

          <div class="navbar-end">
            <transition name="fade" mode="out-in">
              <div class="navbar-item" v-if="getUsername === null" key="1">
                <div class="buttons">
                  <a class="button is-info" @click="showCreateAccountModal()">
                    <strong>Sign up</strong>
                  </a>
                  <a class="button is-light" @click="showLoginModal()">
                    Log in
                  </a>
                </div>
              </div>
              <div class="navbar-item has-dropdown is-hoverable" v-else key="2">
                <a class="navbar-link">
                  Account: {{ getUsername }}
                </a>

                <div class="navbar-dropdown is-right">
                  <router-link class="navbar-item" to="/account">Properties</router-link>
                  <a class="navbar-item" @click="doLogout()">Log out</a>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </nav>
      
      <section :class="add_padding ? 'section' : ''">
        <router-view></router-view>
      </section>

      <footer class="footer has-background-dark">
        <div class="content has-text-centered is-small">
          <a href="https://twitter.com/GranblueParty" target="_blank">
            <img src="/img/twitter.png" class="valign-img">
            @GranblueParty
          </a>
          &nbsp;&nbsp;
          <a href="https://github.com/Minimalist3/GranblueParty" target="_blank">
            <img src="/img/github.png" class="valign-img">
            Minimalist3/GranblueParty
          </a>
          <br>
          Granblue Fantasy content and materials are trademarks and copyrights of Cygames, Inc. or its licensors. All rights reserved.</div>
      </footer>

      <modal-login ref="modalLogin" :userLogged="userLogged"></modal-login>
      <modal-create-account ref="modalCreateAccount" :userLogged="userLogged"></modal-create-account>

    </div>
</template>

<script>
import ModalLogin from '@/components/ModalLogin.vue'
import ModalCreateAccount from '@/components/ModalCreateAccount.vue'

import '#/bulma-switch/dist/css/bulma-switch.min.css'

const getJST_options = {
  timeZone: 'Asia/Tokyo',
  weekday: 'short',
  hour: 'numeric',
  minute: 'numeric',
}

export default {
  components: {
    ModalLogin,
    ModalCreateAccount,
  },
  data() {
    return {
      now: new Date(),
      navbar_active: false,
      add_padding: false,
    }
  },
  methods: {
    showLoginModal() {
      this.$refs.modalLogin.showModal();
    },
    showCreateAccountModal() {
      this.$refs.modalCreateAccount.showModal();
    },
    userLogged(username, userId) {
      this.$store.commit({
        type:'login',
        username: username,
        userId: userId,
      });
      this.navbar_active = false;
    },
    doLogout() {
      this.$http.post('/user/logout')
        .finally(() => {
          this.$store.commit('logout');
          this.navbar_active = false;
          this.$router.push({name: "home"});
        });
    },
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
      this.navbar_active = false;
      
      this.add_padding = (to !== '/');
    }
  },
  created() {
    setInterval(() => this.now = new Date(), 1000 * 60)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .25s
}
.fade-enter,
.fade-leave-to {
  opacity: 0
}

.section {
  padding: 1.5rem 1.5rem;
}

.navbar-item {
  color: #f5f5f5;
}
.navbar-item:hover {
  color: #f5f5f5;
  background-color: #363636;
}
.navbar-brand {
  background-color: #292929;
}
.navbar.is-dark .navbar-start > .navbar-item:hover {
  color: #f5f5f5;
  background-color: #363636;
}
.navbar-link {
  color: #f5f5f5;
}
.navbar-link:hover {
  color: #292929;
}
.navbar.is-dark .navbar-item.has-dropdown:hover .navbar-link {
  color: #f5f5f5;
  background-color: #363636;
}
.navbar-menu {
  background-color: #292929;
}
.navbar-dropdown {
  background-color: #292929;
}
</style>