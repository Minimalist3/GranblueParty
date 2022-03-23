<template>
  <span class="relative tooltip-parent">
    <img
      class="w-full"
      :class="readOnly ? '' : 'cursor-pointer'"
      style="min-height: 83px; max-height: 83px;"
      :draggable="! objectIsEmpty"
      :src="getImage"
      @click="tryToEmit('click-portrait')"
      @dragstart="tryToEmit('drag-portrait', $event)"
      @dragover.prevent
      @drop.prevent="tryToEmit('drop-portrait', $event)"   
    >

    <stars-line
      v-if="! objectIsEmpty"
      class="absolute bottom-0 right-0 w-4/5 bg-black/50"
      :base="object.starsbase"
      :extra="object.starsmax"
      :current="object.stars"
      @update:current="$emit('stars-changed', $event)"
      :max="5"
      :readOnly="readOnly"
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
    object: {
      type: Object,
      required: true
    },
    readOnly: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    tryToEmit(name, event) {
      if ( ! this.readOnly) {
        this.$emit(name, event);
      }
    }
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