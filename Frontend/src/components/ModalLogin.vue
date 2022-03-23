<template>
  <modal :show="show" @close="$emit('close', false)">
    <template v-slot:header>
      <h1 v-if="reset_password">Reset password</h1>
      <h1 v-else>Login</h1>
    </template>

    <!-- Reset password -->
    <form v-if="reset_password" @submit.prevent="resetPassword()" class="m-1">
      <p class="p-4 bg-secondary rounded">
        Which email address did you link your account to?<br>
        We'll send you an email with a link to reset your password.
      </p>

      <div class="mt-4">
        <label for="email" class="">Email address</label>
        <input class="input w-full" id="email" ref="email" type="email" placeholder="Email address" v-model="email" required autofocus>
      </div>

      <p class="mt-4">
        <!-- Honeypot -->
        <input type="checkbox" name="captcha" v-model="captcha" style="display:none !important" tabindex="-1" autocomplete="off">
        <a class="cursor-pointer" @click="reset_password = false">Back to login</a>
      </p>

      <input class="btn btn-blue mt-6" type="submit" value="Send Email">
    </form>

    <!-- Login -->
    <form v-else @submit.prevent="doLogin()" class="m-1">
      <div>
        <label for="username" class="">Username</label>
        <input class="input w-full" id="username" ref="username" type="text" placeholder="Username" v-model="username" required autofocus>
      </div>
      <div class="pb-2">
        <label for="password">Password</label>
        <input class="input w-full" id="password" ref="password" placeholder="Password" type="password" minlength="1" required>
      </div>

      <p class="mt-4">
        <a class="cursor-pointer" @click="reset_password = true">Forgot password?</a>
      </p>

      <input class="btn btn-blue mt-6" type="submit" value="Login">
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
      email: "",
      reset_password: false,
      captcha: false,
    }
  },
  methods: {
    doLogin() {
      const body = {
        username: this.username,
        password: this.$refs.password.value,
      }

      this.axios.post('/user/login', body)
        .then(response => {
          this.$emit('close', false);
          this.$emit('user-logged', this.username, response.data.data.userid);
        })
        .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
    },
    resetPassword() {
      const body = {
        email: this.email,
        captcha: this.captcha
      }

      this.reset_password = false;
      this.email = "";
      this.axios.post('/user/sendreset', body)
        .then(response => this.$store.dispatch('addMessage', {message: 'Email sent'}))
        .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
    }
  },
  mounted() {
    this.username = this.$store.getters.getUsername;
  },
  watch: {
    show() {
      if (this.show === true) {
        let self = this;
        this.$nextTick().then(() => {
          self.$refs.username.focus();
        });
      }
    },
    '$store.getters.getUsername'() {
      this.username = this.$store.getters.getUsername;
    }
  }
}
</script>