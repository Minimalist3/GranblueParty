<template>
  <div
    class="modal"
    :class="{'is-active': show}"
    v-if="show"
  >
    <div
      class="modal-background"
      @click="closeModal"
    ></div>
    <div class="modal-card has-text-dark">
      <form @submit.prevent="doLogin">
        <header class="modal-card-head">
          <div class="modal-card-title">
            Create Account
          </div>
        </header>
        <section class="modal-card-body">
          <div>
            <label for="username">Username</label>
            <input
              class="input"
              id="username"
              ref="username"
              type="text"
              v-model="username"
              required
              autofocus
            >
          </div>
          <div>
            <label for="password">Password</label>
            <input
              class="input"
              id="password"
              ref="password"
              type="password"
              minlength="1"
              required
            >
          </div>
          <div>
            <label for="password">Confirm password</label>
            <input
              class="input"
              id="password2"
              ref="password2"
              type="password"
              minlength="1"
              required
            >
          </div>
          <div class="has-text-danger">
            {{ errorMessage }}&nbsp;
          </div>
        </section>
        <footer class="modal-card-foot">
          <input
            class="button is-link"
            type="submit"
            value="Create account"
          >
        </footer>
      </form>
    </div>
    <button
      aria-label="close"
      class="modal-close is-large"      
      @click="closeModal"
    ></button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      username: "",
      errorMessage: "",
    }
  },
  props: {
    userLogged: Function,
  },
  methods: {
    showModal() {
      this.show = true;
      document.querySelector("HTML").classList.add("is-clipped");

      let self = this;
      Vue.nextTick().then(() => {
        self.$refs.username.focus();
      });      
    },
    closeModal() {
      this.show = false;
      document.querySelector("HTML").classList.remove("is-clipped");
    },
    doLogin() {
      this.errorMessage = "";

      if (this.$refs.password.value != this.$refs.password2.value) {
        this.errorMessage = "Passwords don't match";
        return;
      }
      if (/([\x00-\x1F\x7F]|\s)/.test(this.username)) {
        this.errorMessage = "Username doesn't match requirements (no whitespace or control characters)";
        return;
      }

      const body = {
        username: this.username,
        password: this.$refs.password.value,
      }

      this.$http.post('/user/register', body)
        .then(response => {
          this.closeModal();
          this.userLogged(this.username, response.data.data.userid);
        })
        .catch(error => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            this.errorMessage = error.response.data.error.message;
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser
            this.errorMessage = "Cannot contact login server";
          } else {
            // Something happened in setting up the request that triggered an Error
            this.errorMessage = error.message;
          }
        });
    },
  },
}
</script>
