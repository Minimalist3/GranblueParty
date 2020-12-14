<template>
  <div v-if="base !== undefined" class="flex flex-row flex-nowrap" title="Uncap level">
    <img
      v-for="i in getYellowStarsCount"
      :key="'y' + i"
      :class="readOnly ? '' : 'cursor-pointer'"
      :src="getImage('y', i)"
      :style="'width: ' + 100/max + '%;'"
      @click="click(i)"
    >
    <img
      v-for="i in getBlueStarsCount"
      :key="'b' + i"
      :class="readOnly ? '' : 'cursor-pointer'"
      :src="getImage('b', i+base)"
      :style="'width: ' + 100/max + '%;'"
      @click="click(i+base)"
    >
    <img
      v-for="i in getInvisibleStarsCount"
      :key="'i' + i"
      class="hidden"
      src="/img/star_b1.png"
      :style="'width: ' + 100/max + '%;'"
    >
  </div>
</template>

<script>
export default {
  props: {
    base: { // Yellow stars
      type: Number,
      required: true
    },
    extra: { // Blue stars
      type: Number,
      required: true
    },
    current: { // Number of checked stars
      type: Number,
      required: true
    },
    max: { // For line size
      type: Number,
      required: true
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getImage(type, index) {
      return '/img/star_' + type + (index <= this.current ? "1" : "0") + '.png';
    },
    click(index) {
      if (this.readOnly) {
        return;
      }

      let current_stars = index;

      if (index === 1 && this.current !== 0) {
        // First click on 1st star sets 0 stars instead of 1
        current_stars = 0;
      }
      else if (index === this.current) {
        current_stars = index - 1;
      }

      this.$emit('update:current', current_stars);
    }
  },
  computed: {
    getYellowStarsCount() {
      return this.base;
    },
    getBlueStarsCount() {
      if (this.base > this.extra) {
        return 0;
      }
      return this.extra - this.base;
    },
    getInvisibleStarsCount() {
      const baseStars = Math.max(this.base, this.extra);
      if (baseStars > this.max) {
        return 0;
      }
      return this.max - baseStars;
    },
  },
}
</script>