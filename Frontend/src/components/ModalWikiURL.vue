<template>
  <modal :show="show" @close="$emit('close', false)">
    <template v-slot:header>
      <h2>Please copy your gbf.wiki collection URL below</h2>
    </template>

    <form @submit.prevent="getURL()" class="m-1">
      <div class="mb-2">
        <label for="url" class="">URL</label>
        <input class="input w-full" id="url" ref="url" type="text" placeholder="Username" v-model="url" required autofocus>
      </div>

      <input class="btn btn-blue pt-2" type="submit" value="Import">
    </form>
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
  },
  data() {
    return {
      url: "",
    }
  },
  methods: {
    getURL() {
      this.$emit('import', this.url);
      this.$emit('close', false);
    },
  },
  watch: {
    show() {
      if (this.show === true) {
        let self = this;
        Vue.nextTick().then(() => {
          self.url = '';
          self.$refs.url.focus();
        });
      }
    }
  }
}
</script>