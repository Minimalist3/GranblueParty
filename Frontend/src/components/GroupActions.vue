<template>
  <div class="flex flex-col">
    <span class="flex flex-row justify-between mt-1">
      <button class="btn btn-blue" @click="clickAttack">Attack</button>
      <span>
        <button class="btn btn-white" @click="clickUndo">Undo</button>
        <button class="btn btn-red" @click="clickClear">Clear</button>
      </span>
    </span>

    <textarea class="w-full h-40 appearance-none text-primary bg-primary" v-model="getActionsText" readonly></textarea>
  </div>
</template>

<script>
export default {
  methods: {
    clickAttack() {
      this.$store.commit('addActionAttack');
    },
    clickUndo() {
      this.$store.commit('undoAction');
    },
    clickClear() {
      this.$store.commit('clearActions');
    }
  },
  computed: {
    getActionsText() {
      return this.$store.getters.getActionsText;
    }
  }
}
</script>