<template>
  <label :title="longName">
    {{ shortName }}
    <input
      class="appearance-none text-primary bg-transparent"
      :class="alignRight ? 'text-right' : ''"
      type="tel"
      :style="'width: ' + length + 'ch;'"
      v-model.number.lazy="localProp"
      @keydown.arrow-up="incrementProp()"
      @keydown.arrow-down="decrementProp()"
    >
  </label>
</template>

<script>
export default {
  props: {
    prop: Number,
    shortName: String,
    longName: String,
    length: Number,
    max: Number,
    alignRight: Boolean,
  },
  methods: {
    incrementProp() {
      if (this.max === undefined || this.max > this.localProp) {
        this.localProp++;
      }
    },
    decrementProp() {
      if (this.localProp > 0) {
        this.localProp--;
      }
    },
  },
  computed: {
    localProp: {
      get() {
        return this.prop;
      },
      set(value) {
        this.$emit('update:prop', value);
      }
    }
  }
}
</script>