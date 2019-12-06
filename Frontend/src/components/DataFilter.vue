<template>
  <div class="flex flex-row items-center">
    <span class="pr-2">{{ category }}</span>

    <span class="inline-flex flex-row flex-wrap btn-group">
      <button
        class="btn btn-sm"
        :class="all ? 'btn-blue' : 'btn-white'"
        @click="clickAll()"
      >
        All
      </button>

      <button
        class="btn btn-sm"
        :class="item.checked ? 'btn-blue ' : 'btn-white '"
        v-for="(item, index) in data_view"
        :key="index"
        @click="clickItem(index)"
      >
        {{ item.name }}
      </button>
    </span>
  </div>
</template>

<script>
import Utils from '@/js/utils.js'

export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      all: true,
      data_view: [],
    }
  },
  methods: {
    clickAll() {
      // check
      if ( ! this.all) {
        this.all = true;
        this.data_view.forEach(e => e.checked = false);
        this.data.forEach(e => e.checked = true);        
      }
    },
    clickItem(index) {
      this.data_view[index].checked = ! this.data_view[index].checked;

      if (this.all) {
        this.all = false;
        // Propagate change
        for (let i=0; i<this.data.length; i++) {
          Vue.set(this.data[i], 'checked', this.data_view[i].checked);
        }
      }
      else {
        Vue.set(this.data[index], 'checked', this.data_view[index].checked);
      }
    }
  },
  mounted() {
    // Copy data locally to deal with the All button
    this.data_view = Utils.copy(this.data);

    if (this.data_view.some(e => { return ! e.checked })) {
      this.all = false;
    }
    else {
      this.data_view.forEach(e => e.checked = false);
      this.all = true;        
    }    
  },
}
</script>