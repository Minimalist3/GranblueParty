<template>
  <div @click="changeValue()" class="select-none flex flex-row flex-nowrap items-center cursor-pointer hover:text-link-hover">
    <!-- Box -->
    <span v-if="value === true" class="w-5 h-8">
      <fa-icon :icon="['fas', 'check']" class="text-2xl text-blue-400"></fa-icon>
    </span>
    <span v-else class="w-5 h-8">
      <fa-icon :icon="['fas', 'times']" class="text-3xl text-red-400"></fa-icon>
    </span>
    <!-- Label -->
    <span class="ml-1 my-1">
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
    }
  },
  methods: {
    changeValue() {
      this.$emit("input", ! this.value);
    }
  }
}
</script>