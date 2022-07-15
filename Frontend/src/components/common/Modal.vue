<template>
  <div v-if="show" class="fixed inset-0 z-40 flex justify-center items-start bg-black/80" @click.self="close()">
    <div
      class="w-screen h-auto mt-8 bg-primary md:rounded flex flex-col overflow-hidden"
      :class="large ? 'md:w-11/12' : 'md:w-3/4 xl:w-3/5 2xl:1/2'"
      style="max-height: calc(100vh - 4rem);"
    >
      <div class="px-4 py-2 flex flex-col-reverse sm:flex-row sm:justify-between">
        <slot name="header"></slot>
        <button @click.prevent="close()" class="self-end sm:self-start">
          <fa-icon :icon="['fas', 'times-circle']" class="text-link-primary hover:text-link-hover text-2xl"></fa-icon>
        </button>
      </div>

      <div class="overflow-auto break-all px-4" >
        <slot></slot>
      </div>

      <div class="px-4 py-2 flex shrink-0">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>  
</template>

<script>
export default {
  model: {
    prop: 'show',
    event: 'close'
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    large: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    close() {
      this.$emit("close", ! this.show);
    },
    toggleOverflow() {
      if (this.show === true) {
        document.querySelector("HTML").classList.add("overflow-hidden");
      }
      else {
        document.querySelector("HTML").classList.remove("overflow-hidden");
      }
    }
  },
  watch: {
    show() {
      this.toggleOverflow();
    }
  },
  mounted() {
    this.toggleOverflow();
  }
}
</script>