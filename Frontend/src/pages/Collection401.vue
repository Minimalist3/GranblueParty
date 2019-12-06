<template>
  <div>
    <h1>My Collection</h1>
    <img src="/img/preview_collection.png">
    <p>
      Create a free account to gain access to "My Collection".
    </p>
    <p class="pt-4">
      Choose the characters and summons you own, then hit the "Save changes" button.<br>
      You can share your collection by clicking the "Share" button and giving the unique URL of the page to your friends.
    </p>
  </div>
</template>

<script>
export default {
  computed: {
    getUsername() {
      return this.$store.getters.getUsername;
    }
  },
  watch: {
    getUsername(to, from) {
      // When a user logs in, go back to collection
      this.$router.push({name: "collection"});
    },
  }
}
</script>