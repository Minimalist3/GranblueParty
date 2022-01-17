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
  head: {
    title: 'Granblue.Party - Collection Tracker',
    desc: 'Track the characters and summons you unlocked, and share your collection with your friends',
    image: 'https://www.granblue.party/img/preview_collection.png',
    keywords: 'collection, tracker, characters, summons, share'
  },
  methods: {
    goToCollection() {
      // When a user logs in, go back to collection
      if (this.getUserId !== null) {
        this.$router.push({name: "collection"}).catch(() => {});
      }
    }
  },
  computed: {
    getUserId() {
      return this.$store.getters.getUserId;
    }
  },
  mounted() {
    this.goToCollection();
  },
  watch: {
    getUserId(to, from) {
      this.goToCollection();
    },
  }
}
</script>