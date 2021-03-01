<template>
  <modal :show="show" @close="close()">
    <template v-slot:header>
      <span class="flex flex-row flex-wrap items-center">
        <input class="input input-sm" placeholder="Name" ref="nameField" type="text" v-model="name_searched">
        <button class="btn btn-sm btn-red mx-2" @click="name_searched = ''">Clear</button>

        <data-filter
          class="my-2 mr-2"
          v-for="(category, index) in getFilters"
          :key="index"
          :category="category.name"
          :data="data_model[category.key].data">
        </data-filter>
      </span>
    </template>

    <div v-if="message.length < 1">
      Loading...
    </div>
    <div v-else>      
      <table class="table">
        <thead>
          <tr>
            <th v-for="(category, index) in getColumns" :key="index">{{ category.name }}</th>
          </tr>
        </thead>
        <tbody>
          <tr @click="selectItem(null)">
            <td v-for="index in getColumns.length" :key="index">-</td>
          </tr>
          <tr v-for="item in getData" :key="item.id" @click="selectItem(item.id)">
            <td v-for="(val, index) in getColumn(item)" :key="index">{{ val }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <template v-slot:footer>
      {{ getResultsCount }}
    </template>
  </modal>
</template>

<script>
import DataModel from '@/js/data-model'
import Utils from '@/js/utils'

import Modal from './common/Modal.vue'
import DataFilter from './DataFilter.vue'

export default {
  model: {
    prop: 'show',
    event: 'close'
  },
  components: {
    Modal,
    DataFilter
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    route: {
      type: String,
      required: true
    },
    routeParameters: {
      type: String,
      default: undefined
    },
    categories: {
      type: Array,
      required: true
    },
    dataModel: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      message: [],
      previousRoute: '',
      data_model: {},
      name_searched: '',
    }
  },
  methods: {
    selectItem(id) {
      this.$emit('item-selected', id);
      this.close();
    },
    close() {
      this.$emit('close', false);
    },
    getColumn(item) {
      return this.getColumns.map(c => {
        return this.data_model[c.key].expand(item, this.getLang);
      });
    }
  },
  computed: {
    getData() {
      return this.message.filter(item => {
        return item.n.toLowerCase().includes(this.name_searched.toLowerCase()) &&
          this.getFilters.every(f => {
            return this.data_model[f.key].show(item[f.key])
          });
      });
    },
    getResultsCount() {
      if (this.getData.length == 1) {
        return this.getData.length + ' result'
      }
      return this.getData.length + ' results'
    },
    getColumns() {
      return this.categories.filter(c => { return c.isColumn });
    },
    getFilters() {
      return this.categories.filter(c => { return c.isFilter });
    },
    getLang() {
      return this.$store.getters.getLang;
    }
  },
  watch: {
    show() {
      if (this.show) {
        let currentRoute = this.route;
        if (this.routeParameters !== undefined) {
          currentRoute += '?' + this.routeParameters;
        }
        
        // Fetch the message again if the route changed
        if (this.previousRoute !== currentRoute) {
          this.message = [];
        }
        this.previousRoute = currentRoute;

        if (this.message.length === 0) {
          this.axios.get(currentRoute)
                    .then(response => this.message = response.data)
                    .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
        }

        let self = this;
        this.$nextTick().then(() => {
          self.name_searched = '';
          self.$refs.nameField.focus();
        });
      }
    }
  },
  mounted() {
    // Copy the data model locally to modify "checked" properties
    this.categories.forEach(c => {
      this.$set(this.data_model, c.key, Utils.copy(DataModel[c.key]));
    });

    // Overload data model if specified
    if (this.dataModel !== undefined) {
      for (let [key, data] of Object.entries(this.dataModel)) {
        this.$set(this.data_model, key, data);
      }
    }
  }
}
</script>