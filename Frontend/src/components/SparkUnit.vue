<template>
  <div class="flex flex-col relative" :style="'width: ' + width + 'px;'">
    <a
      class="text-xs text-primary h-5 px-1 text-center truncate"
      target="_blank"
      :href="'https://gbf.wiki/' + unit.n"
      :title="getName(unit)"
    >{{ getName(unit) }}</a>
    <img
      class="cursor-pointer"
      :style="'min-width: ' + width + 'px;'"
      :height="height"
      :width="width"
      :title="getName(unit)"
      :src="'/img/unit_small/' + unit.id + '000.jpg'"
      @click="$emit('left-click-unit')"
      @contextmenu.prevent="$emit('right-click-unit')"
    >
    <img
      v-if="isSpark === true"
      class="absolute bottom-0 right-0 pointer-events-none"
      height="39"
      width="38"
      src="/img/item/ceruleanspark.png"
    >
  </div>
</template>

<script>
import { LANGUAGES } from '@/js/lang'

export default {
  props: {
    unit: { // Yellow stars
      type: Object,
      required: true
    },
    width: {
      type: Number,
      default: 105
    },
    height: {
      type: Number,
      default: 60
    },
    isSpark: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getName(element) {
      if (this.isLangEnglish) {
        return element.n;
      }
      return element.nj;
    },
  },
  computed: {
    isLangEnglish() {
      return this.$store.getters.getLang === LANGUAGES.EN;
    }
  }
}
</script>
