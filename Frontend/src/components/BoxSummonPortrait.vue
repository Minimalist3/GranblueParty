<template>
  <span class="relative tooltip-parent">
    <img
      class="cursor-pointer w-full"
      style="min-height: 83px; max-height: 83px;"
      :draggable="! objectIsEmpty"
      :src="getImage"
      @click="$emit('click-portrait')"
      @dragstart="$emit('drag-portrait', $event)"
      @dragover.prevent
      @drop.prevent="$emit('drop-portrait', $event)"   
    >

    <stars-line
      v-if="! objectIsEmpty"
      class="absolute bottom-0 right-0 w-4/5 bg-alpha-50"
      :base="object.starsbase"
      :extra="object.starsmax"
      :current="object.stars"
      @update:current="$emit('stars-changed', $event)"
      :max="5"
    ></stars-line>

    <span class="tooltip" v-if="object.current_data !== undefined">
      <span class="font-mono text-xs" v-for="(data, index) in object.data[object.current_data]" :key="index">
        <span class="capitalize">{{ data.aura_type }}</span> {{ data.stat }} {{ data.percent }}% <span v-if="data.slot">({{ data.slot }})</span><br>
      </span>
    </span>
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
        return '/img/empty_summon.jpg';
      }
      return "/img/unit/" + this.object.summonid + "000.jpg";
    },
  }
}
</script>