<template>
  <modal :show="show" @close="$emit('close', false)">
    <template v-slot:header>
      <h1>Create an account</h1>
    </template>

    <form @submit.prevent="doLogin()" class="m-1">
      <div>
        <label for="username" class="">Username</label>
        <input class="input w-full" id="username" ref="username" type="text" placeholder="Username" v-model="username" required autofocus>
      </div>
      <div>
        <label for="password">Password</label>
        <input class="input w-full" id="password" ref="password" placeholder="Password" type="password" minlength="1" required>
      </div>
      <div class="pb-2">
        <label for="password2">Confirm password</label>
        <input class="input w-full" id="password2" ref="password2" placeholder="Password" type="password" minlength="1" required>
      </div>

      <p v-if="error_message.length > 0">
        <fa-icon :icon="['fas', 'exclamation-triangle']" class="text-red-400"></fa-icon>
        {{ error_message }}
      </p>
      <p v-else>&nbsp;</p>

      <input class="btn btn-blue pt-2" type="submit" value="Create">
    </form>
  </modal>
</template>

<script>
import Modal from './common/Modal.vue'

export default {
  model: {
    prop: 'show',
    event: 'close'
  },
  components: {
    Modal
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      username: "",
      error_message: "",
    }
  },
  methods: {
    doLogin() {
      this.error_message = "";

      if (this.$refs.password.value != this.$refs.password2.value) {
        this.error_message = "Passwords don't match";
        this.$refs.password.value = "";
        this.$refs.password2.value = "";
        return;
      }
      if (/([\x00-\x1F\x7F]|\s)/.test(this.username)) {
        this.error_message = "Username doesn't match requirements (no whitespace or control characters)";
        return;
      }

      const body = {
        username: this.username,
        password: this.$refs.password.value,
      }

      this.$http.post('/user/register', body)
        .then(response => {
          this.$emit('close', false);
          this.$emit('user-logged', this.username, response.data.data.userid);
        })
        .catch(error => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            this.error_message = error.response.data.error.message;
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser
            this.error_message = "Cannot contact login server";
          } else {
            // Something happened in setting up the request that triggered an Error
            this.error_message = error.message;
          }
        });
    },
  },
  watch: {
    show() {
      if (this.show === true) {
        let self = this;
        Vue.nextTick().then(() => {
          self.$refs.username.focus();
        });
      }
    }
  }
}
</script>