<template>
  <div
    @click="changeValue()"
    class="select-none flex flex-row flex-nowrap items-center"
    :class="getClasses"
  >
    <!-- Box -->
    <fa-icon v-if="value === true" :icon="['fa', 'toggle-on']" class="text-4xl"></fa-icon>
    <fa-icon v-else :icon="['fa', 'toggle-off']" class="text-4xl "></fa-icon>
    <!-- Label -->
    <span class="ml-1 my-1 text-primary">
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    changeValue() {
      if ( ! this.disabled) {
        this.$emit("input", ! this.value);
      }
    }
  },
  computed: {
    getClasses() {
      let classes = this.value ? 'text-blue-300 ' : 'text-pink-400 ';
      if (this.disabled) {
        classes += ' cursor-not-allowed grayscale-70 opacity-70 ';
      }
      else {
        classes += 'cursor-pointer hover:underline hover:decoration-2 ';
        classes += this.value ?
          'hover:text-blue-400 hover:decoration-blue-400 ' :
          'hover:text-pink-600 hover:decoration-pink-600 ';
      }
      return classes;
    }
  }
}
</script>