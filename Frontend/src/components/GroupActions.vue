<template>
  <div class="flex flex-col">
    <span class="flex flex-row justify-between items-center mt-1">
      <button class="btn btn-blue" @click="clickAttack">Attack</button>
      <p v-if="party_mode === $MODE.Edit" class="text-sm text-center mx-2">Uncheck <i>Edit Grid</i> to click and add skills and summons below</p>
      <span class="flex flex-row">
        <button class="btn btn-white mr-1" @click="clickUndo">Undo</button>
        <button class="btn btn-red" @click="clickClear">Clear</button>
      </span>
    </span>

    <textarea class="w-full h-full appearance-none text-primary bg-primary" v-model="getActionsText" readonly></textarea>
  </div>
</template>

<script>
import { mapState } from 'vuex'

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
    ...mapState({
      party_mode: state => state.party_builder.party_mode
    }),
    getActionsText() {
      return this.$store.getters.getActionsText;
    }
  }
}
</script>