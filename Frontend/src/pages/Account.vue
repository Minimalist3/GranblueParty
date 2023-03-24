<template>
  <div class="flex flex-col items-center gap-y-8">
    <h1>My account</h1>

    <form @submit.prevent="changeEmail()" class="grid auto-cols-min">
      <label for="username" class="">Username</label>
      <input class="input" id="username" type="text" :value="$store.getters.getUsername" disabled>

      <label for="email" class="">Email address (optional)</label>
      <input class="input" id="email" ref="email" type="email" placeholder="Email address" v-model="email">

      <p class="mt-4">
        <input class="btn btn-blue" type="submit" value="Save" :disabled="! emailModified">
      </p>
    </form>

    <p class="bg-secondary rounded p-4">
      To reset your password, log out, then in the "Log in" panel,<br>
      click on "Forgot password?" to receive a link to change your password.
    </p>

    <p class="bg-secondary rounded p-4">
      We will never send you spam or sell your email address.<br>
      Its only use is to recover your password if you forget it.
    </p>

    <button class="btn btn-red" @click="show_modal_delete = true">Delete account</button>

    <!-- Modal -->
    <modal-confirm
      v-model="show_modal_delete"
      :confirm="deleteAccount"
      text="This action cannot be reverted"
      button="Delete account"
    ></modal-confirm>
  </div>
</template>

<script>
import ModalConfirm from '@/components/ModalConfirm.vue'

export default {
  components: {
    ModalConfirm,
  },
  head: {
    title: 'Granblue.Party - My Account',
  },
  data() {
    return {
      email: null,
      show_modal_delete: false,
    }
  },
  methods: {
    changeEmail() {
      this.axios.post('/user/email', { email: this.email })
        .then(_ => {
          this.$store.commit('setEmail', this.email);
          this.$store.dispatch('addMessage', {message: 'Email saved successfully'})
        })
        .catch(error => this.$store.dispatch('addAxiosErrorMessage', error))
    },
    deleteAccount() {
      this.axios.post('/user/delete')
        .then(_ => {
          this.$store.commit('logout');
          this.$router.push({name: "home"});
        })
        .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
    },
  },
  computed: {
    emailModified() {
      return this.$store.getters.getEmail != this.email;
    },
  },
  mounted() {
    this.email = this.$store.getters.getEmail;
  },
  watch: {
    '$store.getters.getUserId'(id) {
      if (id === null) {
        this.$router.push({name: "home"}).catch(() => {});
      }
    },
  }
}
</script>