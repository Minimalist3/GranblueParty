<template>
  <div class="flex flex-col">
    <span class="flex flex-row justify-between items-center mt-1">
      <button class="btn btn-blue" @click="clickAttack">Attack</button>
      <p v-if="editMode" class="text-sm text-center mx-2">Uncheck <i>Edit Grid</i> to click and add skills and summons below</p>
      <span class="flex flex-row">
        <button class="btn btn-white mr-1" @click="clickUndo">Undo</button>
        <button class="btn btn-red" @click="clickClear">Clear</button>
      </span>
    </span>

    <textarea class="w-full h-full appearance-none text-primary bg-primary" v-model="getActionsText" readonly></textarea>
  </div>
</template>

<script>
export default {
  props: {
    editMode: {
      type: Boolean,
      default: true
    },
  },
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