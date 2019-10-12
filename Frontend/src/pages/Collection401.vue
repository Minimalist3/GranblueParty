<template>
  <div>
    <h1 class="title is-unselectable has-text-light">My Collection</h1>
    <img src="@/img/preview_collection.jpg">
    <div>
      Create a free account to gain access to "My Collection".<br><br>
      Choose the characters and summons you own, then hit the "Save changes" button.<br>
      You can share your collection by clicking the "Share" button and giving the unique URL of the page to your friends.
    </div>
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