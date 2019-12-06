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
      class="absolute top-0 bg-alpha-50"
      :base="object.starsbase"
      :extra="object.starsmax"
      :current="object.stars"
      @update:current="$emit('stars-changed', object, $event)"
      :max="5"
    ></stars-line>

    <img
      v-if="! objectIsEmpty"
      class="cursor-pointer absolute bottom-0 right-0"
      :class="object.haspring ? '' : 'ring-disabled'"
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
    object: Object,
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

<style scoped>

.ring-disabled {
  filter: grayscale(80%);
  opacity: 0.7;
}

</style>