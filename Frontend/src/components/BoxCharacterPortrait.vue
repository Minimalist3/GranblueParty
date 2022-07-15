<template>
  <span class="relative">
    <img
      class="w-full"
      :class="party_mode === $MODE.Edit ? 'cursor-pointer' : ''"
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
      :readOnly="party_mode === $MODE.ReadOnly"
    ></stars-line>

    <img
      v-if="! objectIsEmpty && showRing"
      class="absolute bottom-0 right-0"
      :class="getPRingClasses"
      src="/img/icon_pring.png"
      title="Perpetuity Ring"
      @click="$emit('click-pring')"
    >
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
    showRing: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      party_mode: state => state.party_builder.party_mode
    }),
    getPRingClasses() {
      let classes = this.object.haspring ? '' : 'grayscale-80 opacity-70';
      if (this.party_mode !== this.$MODE.ReadOnly) {
        classes += ' cursor-pointer';
      }
      return classes;
    },
    getImage() {
      if (this.objectIsEmpty) {
        if (this.party_mode !== this.$MODE.Edit) {
          return '/img/empty_chara_ro.jpg';
        }
        return '/img/empty_chara.jpg';
      }
      return "/img/unit/" + this.object.characterid + "000.jpg";
    },
  },
}
</script>