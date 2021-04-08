<template>
  <span class="relative">
    <img
      class="cursor-pointer w-full"
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
      class="absolute bottom-0 right-0 w-3/4 bg-alpha-50"
      :base="object.starsbase"
      :extra="object.starsmax"
      :current="object.stars"
      @update:current="$emit('stars-changed', object, $event)"
      :max="5"
    ></stars-line>
  </span>
</template>

<script>
import { objectIsEmpty } from "@/js/mixins"

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
    getImage() {
      if (this.objectIsEmpty) {
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