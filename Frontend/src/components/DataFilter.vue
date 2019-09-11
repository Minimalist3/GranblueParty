<template>
  <div class="field has-addons">
    {{ category }}&nbsp;
    <p class="control">
      <button
        class="button is-small"
        :class="{'is-link': all}"
        @click="clickAll"
      >
        All
      </button>
    </p>
    <p class="control">
      <button
        v-for="item in items"
        :key="item.name"
        class="button is-small"
        :class="{'is-info': item.checked}"
        @click="clickItem(item)"      
      >
        {{ item.name }}
      </button>
    </p>
    &nbsp;
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
      items: [],
    }
  },
  methods: {
    clickItem(item) {
      item.checked = ! item.checked;
      this.all = false;
      // Propagate change
      for (let i=0; i<this.data.length; i++) {
        Vue.set(this.data[i], 'checked', this.items[i].checked);
      }
    },
    clickAll() {
      // uncheck only
      if ( ! this.all) {
        this.items.forEach(e => e.checked = false);
        this.all = true;
        for (let i=0; i<this.data.length; i++) {
          Vue.set(this.data[i], 'checked', true);
        }
      }
    },
  },
  mounted() {
    this.items = Utils.copy(this.data);
    for (let i=0; i<this.items.length; i++) {
      this.items[i].index = i;
    }
    if (this.items.some(e => { return ! e.checked })) {
      this.all = false;
    }
    else {
      this.items.forEach(e => e.checked = false);
      this.all = true;        
    }    
  },
}
</script>
