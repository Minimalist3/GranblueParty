<template>
  <div
    @click="changeValue()"
    class="select-none flex flex-row flex-nowrap items-center"
    :class="getClasses"
  >
    <!-- Box -->
    <fa-icon v-if="value === true" :icon="on" :class="iconSize"></fa-icon>
    <fa-icon v-else :icon="off" :class="iconSize"></fa-icon>
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
    on: {
      type: Array,
      default: () => ['fa', 'toggle-on']
    },
    off: {
      type: Array,
      default: () => ['fa', 'toggle-off']
    },
    iconSize: {
      type: String,
      default: 'text-4xl'
    }
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
      let classes = this.value ? 'text-blue-300 ' : 'text-rose-400 ';
      if (this.disabled) {
        classes += ' cursor-not-allowed grayscale-70 opacity-70 ';
      }
      else {
        classes += 'cursor-pointer hover:underline hover:decoration-2 ';
        classes += this.value ?
          'hover:text-blue-400 hover:decoration-blue-400 ' :
          'hover:text-rose-600 hover:decoration-rose-600 ';
      }
      return classes;
    }
  }
}
</script>