<template>
  <modal :show="show" @close="close()">
    <template v-slot:header>
      <h1>Select a skill key</h1>
    </template>

    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Key</th>
        </tr>
      </thead>
      <tbody>
        <tr @click="selectItem(null)">
          <td>-</td>
          <td>Remove current key</td>
        </tr>
        <tr
          v-for="(item, index) in getData"
          :key="index"
          @click="selectItem(item)"
        >
          <td>{{ item.name }}</td>
          <td>{{ item.desc }}</td>
        </tr>
      </tbody>
    </table>
  </modal>
</template>

<script>
import KeyData from '@/js/key-data.js'
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
    keyId: {
      type: Number,
      required: true
    },
  },
  methods: {
    selectItem(item) {
      this.$emit('key-selected', item);
      this.close();
    },
    close() {
      this.$emit('close', false);
    }
  },
  computed: {
    getData() {
      return KeyData.data[this.keyId];
    }
  }
}
</script>