<template>
  <div>
    <h1>Account properties</h1>

    <p class="pt-8">
      Account name: {{ $store.getters.getUsername }}
    </p>

    <p class="pt-8">
      <button class="btn btn-red" @click="deleteAccount">Delete account</button>
      <br>
      <fa-icon :icon="['fas', 'exclamation-triangle']" class="text-red-400"></fa-icon> This action cannot be reverted
    </p>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Granblue.Party - My Account',
  },
  methods: {
    deleteAccount() {
      this.axios.post('/user/delete')
        .then(response => {
          this.$store.commit('logout');
          this.$router.push({name: "home"});
        })
        .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
    },
  },
}
</script>