<template>
  <div class="flex flex-col">

    <div class="flex flex-row mb-4">
      <!-- Items -->
      <div class="h-96 w-1/3 overflow-y-scroll">

        <div class="flex flex-row">
          <input class="input input-sm" placeholder="Search" type="text" v-model="search">
          <label>Quantity
            <input class="input input-sm" size="4" type="number" v-model="quantity">
          </label>
        </div>

        <div v-for="(item, group) in getGroups" :key="group">
          <a @click="addGroup(group)" class="cursor-pointer">
            <div class="h-1"></div>{{ group }}
          </a>
        </div>

        <div v-for="(item, ref) in getItems" :key="ref">
          <a @click="addItem(ref)" class="cursor-pointer">
            <img :src="'/img/item/' + ref + (item.animated ? '.gif' : '.jpg')" style="max-height: 40px; max-width: 40px;"> {{ item.name }}<br>
          </a>
        </div>

      </div>

      <!-- JSON -->
      <div class="h-96 w-2/3 overflow-y-scroll">
        <textarea class="font-mono text-primary bg-tertiary w-full h-full"
         spellcheck="false" v-model.lazy="getObjectJSON" id="textarea_id">
        </textarea>
      </div>
    </div>

    <!-- Preview -->
    <div class="flex flex-row flex-wrap space-x-2">
      <div v-for="(item, key) in items" :key="key" class="border-secondary border-2 rounded">
        <calc-preview-item
          v-if="item.item"
          :tag="item.item"
          :name="getItem(item.item).name"
          :quantity.sync="progress[item.item]"
          :max="item.q"
          :animated="getItem(item.item).animated"
        ></calc-preview-item>
        <div v-else-if="item.group">
          Group: {{ item }}
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import supplies from '@/js/supplies'
import utils from '@/js/utils'

import StatInput from '@/components/common/StatInput.vue'
import CalcPreviewItem from '@/components/CalcPreviewItem.vue'

export default {
  components: {
    StatInput,
    CalcPreviewItem
  },
  head: {
    title: 'Granblue.Party - Admin - Calculator',
    desc: '',
    image: '',
    keywords: ''
  },
  data() {
    return {
      search: "",
      quantity: 1,
      items: [],
      progress: {}
    };
  },
  methods: {
    addItem(ref) {
      this.items.push( {
        item: ref,
        q: parseInt(this.quantity)
      });
      this.$set(this.progress, ref, 0);
    },
    getItem(ref) {
      return supplies.items[ref];
    },
    addGroup(group) {
      this.items.push( {
        group: group,
        q: parseInt(this.quantity)
      });
      this.$set(this.progress, group, 0);
    },
  },
  computed: {
    getItems() {
      return utils.filterObject(supplies.items, 
        (([key, value]) => 
          value.name.toLowerCase().includes(this.search.toLowerCase()) &&
          ! this.items.some(item => item.item == key)
        )
      );
    },
    getGroups() {
      return utils.filterObject(supplies.groups, 
        (([key, value]) => 
          key.toLowerCase().includes(this.search.toLowerCase()) &&
          ! this.items.some(group => group.group == key)
        )
      );
    },
    getObjectJSON: {
      get() {
        return JSON.stringify(this.items);
      },
      set(value) {
        this.$set(this, 'items', []);

        for (let val of (JSON.parse(value))) {
          this.items.push(val);
          if (val.item) {
            this.$set(this.progress, val.item, 0);
          }
        }
      },
    }, 
  }
};
</script>