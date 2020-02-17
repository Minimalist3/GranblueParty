<template>
  <modal :show="show" @close="$emit('close', false)">
    <template v-slot:header>
      <h1>Login</h1>
    </template>

    <form @submit.prevent="doLogin()" class="m-1">
      <div>
        <label for="username" class="">Username</label>
        <input class="input w-full" id="username" ref="username" type="text" placeholder="Username" v-model="username" required autofocus>
      </div>
      <div class="pb-2">
        <label for="password">Password</label>
        <input class="input w-full" id="password" ref="password" placeholder="Password" type="password" minlength="1" required>
      </div>

      <p v-if="error_message.length > 0">
        <fa-icon :icon="['fas', 'exclamation-triangle']" class="text-red-400"></fa-icon>
        {{ error_message }}
      </p>
      <p v-else>&nbsp;</p>

      <input class="btn btn-blue pt-2" type="submit" value="Login">
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