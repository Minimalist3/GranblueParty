<template>
  <div v-if="show" class="fixed inset-0 z-50 flex justify-center items-start bg-alpha-80" @click.self="close()">
    <div class="w-screen h-auto md:w-3/4 xl:w-1/2 mt-8 bg-primary md:rounded flex flex-col overflow-hidden" style="max-height: calc(100vh - 4rem);">
      <div class="px-4 py-2">
        <slot name="header"></slot>
      </div>

      <div class="overflow-y-auto break-all px-4" >
        <slot></slot>
      </div>

      <div class="px-4 py-2 flex-shrink-0">
        <slot name="footer"></slot>
      </div>
    </div>

    <button class="fixed top-0 right-0 mr-10 mt-12" @click.prevent="close()">
      <fa-icon :icon="['fas', 'times-circle']" class="text-link-primary hover:text-link-hover text-2xl"></fa-icon>
    </button>
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