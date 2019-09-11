<template>
  <div>
    <h1 class="is-size-2">Account properties</h1>
    <p>
      Account name: {{ $store.getters.getUsername }}
    </p>
    <br>
    <p>
      <button
        class="button is-danger is-outlined"
        @click="deleteAccount"
      >
        Delete account
      </button>
      <br>
      This action cannot be reverted
    </p>
  </div>
</template>

<script>
export default {
  methods: {
    deleteAccount() {
      this.$http.post('/user/delete')
        .then(response => {
          this.$store.commit('logout');
          this.$router.push({name: "home"});
        })
        .catch(() => {});
    },
  },
}
</script>
