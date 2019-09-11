<template>
  <div
    class="modal"
    :class="{'is-active': show}"
    v-if="show"
  >
    <div
      class="modal-background"
      @click="closeModal"
    ></div>
    <div class="modal-card has-text-dark">
      <header class="modal-card-head">
        <div class="field is-grouped is-grouped-multiline">
          <div class="field has-addons">
            <input
              class="input is-small"
              placeholder="Name"
              ref="nameField"
              type="text"
              v-model="nameSearched"
            >
            &nbsp;
            <button
              class="button is-small is-danger is-outlined"
              @click="nameSearched = ''"
            >
              Clear
            </button>
            &nbsp;
          </div>
          <data-filter
            v-for="category in filters"
            :key="category.name"
            :data="dataModel[category.key].data"
            :category="category.name"
          ></data-filter>
        </div>
      </header>
      <section class="modal-card-body">
        <div v-if="message.length > 0">
          <table class="table is-hoverable is-narrow is-fullwidth">
            <thead>
              <tr>
                <th
                  v-for="(category, index) in colums"
                  :key="index"
                >
                  {{ category.name }}
                </th>
              </tr>
            </thead>
            <tbody class="is-unselectable">
              <tr
                v-for="item in filteredData"
                :key="item.id"
                @click="selectItem(item.id)"
              >
                <td
                  v-for="(val, index) in filterColumn(item)"
                  :key="index"
                >
                  {{ val }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          Loading...
        </div>
      </section>
      <footer class="modal-card-foot">
        {{ getResultsCount }}
      </footer>
    </div>
    <button
      aria-label="close"
      class="modal-close is-large"      
      @click="closeModal"
    ></button>
  </div>
</template>

<script>

import Utils from '@/js/utils.js'
import DataModel from '@/js/dataModel.js'

import DataFilter from '@/components/DataFilter.vue'

export default {
  components: {
    DataFilter,
  },
  props: {
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
    selected: {
      type: Function,
      required: true
    },
  },
  data() {
    return {
      show: false,
      message: [],
      dataModel: [],
      filters: [],
      colums: [],
      nameSearched: '',
      previousRoute: '',
      slot: 0,
      resultsCount: 0,
    }
  },
  methods: {
    showModal(slot) {
      this.slot = slot;
      this.show = true;
      document.querySelector("HTML").classList.add("is-clipped");
    },
    closeModal() {
      this.show = false;
      document.querySelector("HTML").classList.remove("is-clipped");
    },
    selectItem(e) {
      this.closeModal();
      this.selected(e, this.slot);
    },
    filterColumn(item) {      
      return this.colums.map(c => {
        return this.dataModel[c.key].expand(item[c.key]);
      });
    },
  },
  computed: {
    filteredData() {      
      // Filter list
      const res = this.message.filter(message => {
        return message.n.toLowerCase().includes(this.nameSearched.toLowerCase()) &&
               this.filters.every(f => {
                 return this.dataModel[f.key].show(message[f.key])
               });
      })
      // TODO Sort list
      //res.sort((lhs, rhs) => lhs.n > rhs.n);

      this.resultsCount = res.length;
      return res;
    },
    getResultsCount() {
      if (this.resultsCount == 1) {
        return this.resultsCount + ' result'
      }
      return this.resultsCount + ' results'
    },
  },  
  watch: {
    show() {
      if (this.show) {
        let currentRoute = '/' + this.route;
        if (this.routeParameters !== undefined) {
          currentRoute += '?' + this.routeParameters;
        }
        
        // Fetch the message again if the route changed
        if (this.previousRoute !== currentRoute) {
          this.message = '';
        }
        this.previousRoute = currentRoute;

        if (this.message.length === 0) {          
          this.$http.get(currentRoute)
            .then(response => this.message = response.data)
            .catch(error => console.log(error));
        }

        let self = this;
        Vue.nextTick().then(() => {
          self.nameSearched = '';
          self.$refs.nameField.focus();
        });
      }
    },
  },
  mounted() {
    this.filters = this.categories.filter(c => { return c.isFilter });
    this.colums = this.categories.filter(c => { return c.isColumn });

    // Copy the data model locally to modify "checked" properties
    this.categories.forEach(c => {
      Vue.set(this.dataModel, c.key, Utils.copy(DataModel[c.key]));
    });    
  },
}
</script>
