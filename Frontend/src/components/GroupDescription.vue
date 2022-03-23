<template>
  <textarea class="w-full h-full appearance-none text-primary bg-secondary" v-model="description"></textarea>
</template>

<script>
export default {
  computed: {
    description: {
      get() { return this.$store.state.party_builder.description },
      set(value) { this.$store.commit('setDescription', value) }
    },
  }
}
</script>