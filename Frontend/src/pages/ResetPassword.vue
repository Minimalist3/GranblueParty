<template>
  <div class="flex flex-col items-center gap-y-8">
    <h1>Set a new password</h1>

    <!-- Reset password -->
    <form @submit.prevent="resetPassword()" class="m-1">
      <div class="mt-4">
        <label for="email" class="">Email address</label>
        <input class="input w-full" id="email" type="email" placeholder="Email address" v-model="email" disabled>
      </div>

      <div>
        <label for="password">Password</label>
        <input class="input w-full" id="password" ref="password" placeholder="Password" type="password" minlength="1" required autofocus>
      </div>
      <div class="pb-2">
        <label for="password2">Confirm password</label>
        <input class="input w-full" id="password2" ref="password2" placeholder="Password" type="password" minlength="1" required>
      </div>

      <!-- Honeypot -->
      <input type="checkbox" name="captcha" v-model="captcha" style="display:none !important" tabindex="-1" autocomplete="off">

      <p v-if="error_message.length > 0">
        <fa-icon :icon="['fas', 'exclamation-triangle']" class="text-red-400"></fa-icon>
        {{ error_message }}
      </p>
      <p v-else>&nbsp;</p>
      
      <input class="btn btn-blue mt-6" type="submit" value="Change password">
    </form>
  </div>
</template>

<script>
import Utils from '@/js/utils.js'

export default {
  head: {
    title: 'Granblue.Party - Reset your password',
  },
  data() {
    return {
      email: "",
      token: "",
      captcha: false,
      error_message: "",
    }
  },
  methods: {
    resetPassword() {
      const body = {
        email: this.email,
        token: this.token,
        password: this.$refs.password.value,
        captcha: this.captcha
      }
      
      this.error_message = "";

      if (this.$refs.password.value != this.$refs.password2.value) {
        this.error_message = "Passwords don't match";
        this.$refs.password.value = "";
        this.$refs.password2.value = "";
        return;
      }

      this.axios.post('/user/reset', body)
        .then(_ => {
          this.$router.push({name: "home"})
            .then(_ => this.$store.commit('show_modal_login', true))
            .catch(_ => {})
        })
        .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
    }
  },
  mounted() {
    if (Utils.isEmpty(this.$route.query.t) || Utils.isEmpty(this.$route.query.e)) {
      this.$router.push({name: "home"}).catch(() => {});
    }
    else {
      this.email = this.$route.query.e;
      this.token = this.$route.query.t;
    }
  },
}
</script>