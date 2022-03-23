<template>
  <modal :show="show" @close="$emit('close', false)">
    <template v-slot:header>
      <h2>Are you sure?</h2>
    </template>

    <p class="my-8">
      <fa-icon :icon="['fas', 'exclamation-triangle']" class="text-red-400"></fa-icon> {{ text }}
    </p>

    <div class="flex flex-row justify-between">
      <button class="btn btn-red" @click="confirmAction()">{{ button }}</button>
      <button class="btn btn-blue" @click="$emit('close', false)">Close</button>
    </div>
  </modal>
</template>

<script>
import Modal from './common/Modal.vue'

export default {
  model: {
    prop: 'show',
    event: 'close'
  },
  components: {
    Modal
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    confirm: {
      type: Function,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    button: {
      type: String,
      required: true
    }
  },
  methods: {
    confirmAction() {
      this.confirm();
      this.$emit('close', false);
    },
  },
}
</script>