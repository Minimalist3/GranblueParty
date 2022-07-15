<template>
  <span class="relative">
    <img
      class="w-full"
      :class="party_mode === $MODE.Edit ? 'cursor-pointer' : ''"
      style="max-height: 60px;"
      :draggable="! objectIsEmpty"
      :src="getImage"
      @click="$emit('click-portrait')"
      @dragstart="$emit('drag-portrait', $event)"
      @dragover.prevent
      @drop.prevent="$emit('drop-portrait', $event)"
    >

    <stars-line
      v-if="! objectIsEmpty"
      class="absolute bottom-0 right-0 w-3/4 bg-black/50"
      :base="object.starsbase"
      :extra="object.starsmax"
      :current="object.stars"
      @update:current="$emit('stars-changed', object, $event)"
      :max="5"
      :readOnly="party_mode === $MODE.ReadOnly"
    ></stars-line>
  </span>
</template>

<script>
import { objectIsEmpty } from "@/js/mixins"
import { mapState } from 'vuex'

import StarsLine from '@/components/StarsLine.vue'

export default {
  components: {
    StarsLine,
  },
  mixins: [
    objectIsEmpty
  ],
  props: {
    object: {
      type: Object,
      required: true
    },
    isArcarum: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    ...mapState({
      party_mode: state => state.party_builder.party_mode
    }),
    getImage() {
      if (this.objectIsEmpty) {
        if (this.party_mode !== this.$MODE.Edit) {
          return '/img/empty_weapon_ro.jpg';
        }
        if (this.isArcarum) {
          return '/img/empty_weapon_arcarum.jpg';
        }
        return '/img/empty_weapon.jpg';
      }
      return '/img/weapon/' +  this.object.weaponid + '00.jpg';
    },
  }
}
</script>