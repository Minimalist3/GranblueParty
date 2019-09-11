<template>
    <div>
      <div class="columns">

        <aside class="menu column is-narrow">
          <p class="tag is-black">
            {{ getJST }} JST
          </p>
          <transition name="fade" mode="out-in">
            <span v-if="getUsername === null" key="1">
              <p class="menu-label">
                Account
              </p>
              <ul class="menu-list">
                <li><a @click="showLoginModal">🔑 Login</a></li>
                <li><a @click="showCreateAccountModal">📝 Create account</a></li>
              </ul>
            </span>
            <span v-else key="2">
              <p class="menu-label">
                {{ getUsername }}
              </p>
              <ul class="menu-list">
                <li><router-link to="/account">📖 Account</router-link></li>
                <li><a @click="doLogout">🔓 Logout</a></li>
              </ul>
            </span>
          </transition>

          <p class="menu-label">
            Menu
          </p>
          <ul class="menu-list">
            <li><router-link to="/">🏠 Home</router-link></li>
            <li><router-link to="/builder">Party Builder</router-link></li>
            <li><router-link to="/collection">My Collection</router-link></li>
            <li><router-link to="/release">Release Schedule</router-link></li>
            <li><router-link to="/friendsum">Friend Summons</router-link></li>
            <li><router-link to="/dailygrind">Daily Grind List</router-link></li>
          </ul>

          <p class="menu-label">
            Calculator
          </p>
          <ul class="menu-list">
            <li><router-link to="/calcevoker">Evokers</router-link></li>
            <li><router-link to="/calcgw">Guild Wars Tokens</router-link></li>
          </ul>
        </aside>

        <div class="column">
          <router-view></router-view>

          <footer class="footer has-background-dark">
            <div class="content has-text-centered is-small">
              Follow me on Twitter: <a href="https://twitter.com/GranblueParty" target="_blank">@GranblueParty</a><br>
              Granblue Fantasy content and materials are trademarks and copyrights of Cygames, Inc. or its licensors. All rights reserved.</div>
          </footer>
        </div>

      </div>

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
      now: new Date()
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
    },
    doLogout() {
      this.$http.post('/user/logout')
        .finally(() => {
          this.$store.commit('logout');
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
</style>
