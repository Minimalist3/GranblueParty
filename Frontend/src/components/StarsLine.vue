<template>
  <span
    v-if="base !== undefined"
    id="starsLine"
    class="columns is-gapless is-marginless is-mobile"
    title="Uncap level"
  >
    <img
      v-for="i in getYellowStarsCount"
      :key="'y' + i"
      class="column"
      :src="getImage('y', i)"
      :style="'width: ' + 100/max + '%;'"
      @click="click(i)"
    >
    <img
      v-for="i in getBlueStarsCount"
      :key="'b' + i"
      class="column"
      :src="getImage('b', i+base)"
      :style="'width: ' + 100/max + '%;'"
      @click="click(i+base)"
    >
    <img
      v-for="i in getInvisibleStarsCount"
      :key="'i' + i"
      class="column is-invisible"
      src="@/img/star_b1.png"
      :style="'width: ' + 100/max + '%;'"
    >
  </span>
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
  data() {
    return {
      current_stars: this.current,
    }
  },
  methods: {
    getImage(type, index) {
      return '/img/star_' + type + (index <= this.current_stars ? "1" : "0") + '.png';
    },
    click(index) {
      if (this.readOnly) {
        return;
      }

      if (index === 1 && this.current_stars !== 0) {
        // First click on 1st star sets 0 stars instead of 1
        this.current_stars = 0;
      }
      else if (index === this.current_stars) {
        this.current_stars = index - 1;
      }
      else {
        this.current_stars = index;
      }

      this.$emit('update:current', this.current_stars);
    },
    clear() {
      if (this.readOnly) {
        return;
      }
      this.state.fill(false);
      this.click();
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
  watch: {
    current() {
      this.current_stars = this.current;
    }
  },
}
</script>

<style>

#starsLine {
  background-color: rgba(0, 0, 0, 0.5);
}

</style>
