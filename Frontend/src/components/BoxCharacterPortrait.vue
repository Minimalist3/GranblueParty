<template>
  <span class="relative">
    <img
      class="cursor-pointer w-full"
      style="min-height: 142px; max-height: 142px;"
      :draggable="! objectIsEmpty"
      :src="getImage"
      @click="$emit('click-portrait')"
      @dragstart="$emit('drag-portrait', $event)"
      @dragover.prevent
      @drop.prevent="$emit('drop-portrait', $event)"
    >

    <stars-line
      v-if="! objectIsEmpty"
      class="absolute top-0 bg-black/50"
      :base="object.starsbase"
      :extra="object.starsmax"
      :current="object.stars"
      @update:current="$emit('stars-changed', object, $event)"
      :max="5"
      :transcendance="true"
    ></stars-line>

    <img
      v-if="! objectIsEmpty && showRing"
      class="cursor-pointer absolute bottom-0 right-0"
      :class="object.haspring ? '' : 'grayscale-80 opacity-70'"
      src="/img/icon_pring.png"
      title="Perpetuity Ring"
      @click="$emit('click-pring')"
    >
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
    showRing: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    getImage() {
      if (this.objectIsEmpty) {
        return '/img/empty_chara.jpg';
      }
      return "/img/unit/" + this.object.characterid + "000.jpg";
    },
  },
}
</script>