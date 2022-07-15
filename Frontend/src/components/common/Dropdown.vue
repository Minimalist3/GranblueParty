<template>
  <div class="inline-block relative">
    <select :value="value" @change="changeValue" class="block select select-sm w-full" ref="select" :disabled="disabled">
      <slot></slot>
    </select>

    <div v-if="! disabled" class="pointer-events-none absolute inset-y-0 right-0 rounded-md flex items-center px-2 text-gray-700">
      <fa-icon :icon="['fas', 'angle-down']" class="text-xl"></fa-icon>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: false
    },
    index: {
      type: Number,
      required: false,      
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    changeValue(e) {
      this.$emit('change', e);
      this.$emit('input', this.$refs.select.value);
    }
  },
  watch: {
    value() {
      // Selected index takes some time to update. Don't batch it in changeValue
      this.$nextTick().then(() => {
        this.$emit('update:index', this.$refs.select.selectedIndex);
      });
    }
  }
}
</script>