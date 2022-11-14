<template>
  <div>
    <h1>My Collection</h1>
    <picture>
      <source type="image/webp" srcset="/img/preview_collection.webp">
      <img src="/img/preview_collection.png">
    </picture>

    <p>
      Create a free account to gain access to "My Collection".
    </p>
    <p class="pt-4">
      Keep a list of your characters and summons and share it with your friends.<br>
      You can track the uncap and awakening level of each unit.
    </p>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Granblue.Party - Collection Tracker',
    desc: 'Track the characters and summons you unlocked, and share your collection with your friends',
    image: 'https://www.granblue.party/img/card_collection.jpg',
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