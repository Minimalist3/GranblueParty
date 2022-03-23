<template>
  <div class="flex flex-row items-center">
    <span class="pr-2">{{ category }}</span>

    <span class="inline-flex flex-row flex-wrap btn-group">
      <button
        v-if="hasAll"
        class="btn btn-sm"
        :class="all ? 'btn-blue' : 'btn-white'"
        @click="clickAll()"
      >
        All
      </button>

      <button
        class="btn btn-sm relative"
        :class="getClassesForItem(item)"
        v-for="(item, index) in data_view"
        :key="index"
        @click="clickItem(index)"
      >
        {{ item.name }}
        <div
          v-if="count"
          class="absolute w-5 -top-2 -right-1 z-10 rounded-full text-xs leading-5 tracking-tight bg-tertiary text-primary"
        >
          {{ count[index] > 0 ? count[index] : '-' }}
        </div>
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
    count: {
      type: Array,
      default: undefined
    },
    category: {
      type: String,
      required: true,
    },
    hasAll: {
      type: Boolean,
      default: true,
    }
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

      if (this.all === true) {
        this.all = false;
        // Propagate change
        for (let i=0; i<this.data.length; i++) {
          this.$set(this.data[i], 'checked', this.data_view[i].checked);
        }
      }
      else {
        this.$set(this.data[index], 'checked', this.data_view[index].checked);
      }
    },
    getClassesForItem(item) {
      let classes = item.checked ? 'btn-blue ' : 'btn-white ';
      if (this.count) {
        classes += 'pr-3 ';
      }
      return classes;
    },
  },
  created() {
    if (this.hasAll === true) {
      // Copy data locally to deal with the All button
      this.data_view = Utils.copy(this.data);

      if (this.data_view.some(e => ! e.checked)) {
        this.all = false;
      }
      else {
        this.data_view.forEach(e => e.checked = false);
        this.all = true;        
      }
    }
    else {
      // Data view is the same as the data
      this.data_view = this.data;

      // Disable All button
      this.all = false;
    }
  },
}
</script>