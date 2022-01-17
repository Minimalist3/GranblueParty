<template>
  <div>
    <span class="flex flex-row flex-wrap space-x-4 mt-4 mb-2 items-center">
      <div>Search in</div>
      <checkbox v-model="search_name">Names</checkbox>
      <checkbox v-model="search_ca_names">Charge attack names</checkbox>
      <checkbox v-model="search_ca_desc">Charge attack descriptions</checkbox>
      <checkbox v-model="search_skill_names">Skill names</checkbox>
      <checkbox v-model="search_skill_desc">Skill descriptions</checkbox>
    </span>

    <div class="flex flex-row flex-wrap items-center mb-2">
      <data-filter
        class="mr-2 my-2"
        v-for="category in getFilters"
        :key="category.name"
        :category="category.name"
        :data="data_model[category.key].data"          
      ></data-filter>
    </div>

    <form @submit.prevent="search()" class="mb-4 flex flex-row flex-wrap space-x-2">
      <input class="input" type="text" placeholder="Search" ref="searchfield" autofocus>
      <button class="btn btn-blue" type="submit">
        <fa-icon :icon="['fas', 'search']" class="text-xl"></fa-icon> Search
      </button>
      <checkbox v-model="case_sensitive">Match case</checkbox>
      <checkbox v-model="whole_word">Match whole word</checkbox>
    </form>

    <div class="mb-4" v-if="getResults.length > 0">
      Results: {{ getResults.length }}
    </div>

    <div v-for="(item, k) in getResultsSlice()" :key="k" class="flex flex-col lg:flex-row bg-secondary border-r-2 border-l-2 border-t border-b border-primary p-2 space-x-2">
      <span class="flex flex-col">
        <!-- Name -->
        <span class="mb-2">
          {{ index * slice_size + k + 1 }}-
          <a class="text-primary font-medium" target="_blank" :href="'https://gbf.wiki/' + item.n" v-html="highlight(item.n, search_name)"></a>
          <br>
          [{{ data_model['e'].expand(item) }}
          {{ data_model['w'].expand(item) }}]
        </span>

        <img style="max-height: 96px; max-width:168px; height: 96px; width:168px;" :src="'/img/unit_small/' +  item.id + '000.jpg'">
      </span>

      <span class="flex flex-col">
        <!-- Ougi -->
        <div class="flex flex-row flex-wrap mt-2">
          <div class="whitespace-nowrap mr-2 italic">Charge attack:</div>
          <div class="divide-y border-secondary">
            <div v-for="(ougi, l) in item.o" :key="l" class="flex flex-row space-x-4">
              <div class="whitespace-nowrap italic" v-html="highlight(ougi.n, search_ca_names)" />
              <div v-html="highlight(ougi.d, search_ca_desc)" />
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div v-if="item.s" class="flex flex-row flex-wrap mt-2">
          <div class="whitespace-nowrap mr-2 italic">Skills:</div>
          <div class="divide-y border-secondary">
            <div v-for="(skill, l) in item.s" :key="l" class="flex flex-row space-x-4">
              <div class="whitespace-nowrap italic" v-html="highlight(skill.n, search_skill_names)" />
              <div v-html="highlight(skill.d, search_skill_desc)" />
            </div>
          </div>
        </div>
      </span>
    </div>

    <nav class="mt-4 flex flex-row flex-wrap" role="navigation" aria-label="pagination" v-if="getResults.length > slice_size">
      <span
        class="mr-2 mb-2 px-2 py-1 rounded cursor-pointer hover:text-link-hover"
        :class="index === i-1 ? 'bg-tertiary' : 'bg-secondary'"
        v-for="i in Math.ceil(getResults.length / slice_size)"
        :key="i"
        @click="index = i-1"
      >{{ i }}</span>
    </nav>

  </div>
</template>

<script>
import DataModel from '@/js/data-model.js'
import Utils from '@/js/utils.js'

import Checkbox from '@/components/common/Checkbox.vue'
import DataFilter from '@/components/common/DataFilter.vue'

const lsMgt = new Utils.LocalStorageMgt('SearchCharacters');

const categories = [
  {
    name: "Rarity",
    isColumn: false,
    isFilter: true,
    key: "ri",
  },
  {
    name: "Element",
    isColumn: true,
    isFilter: true,
    key: "e",
  },
  {
    name: "Type",
    isColumn: true,
    isFilter: true,
    key: "t",
  },
  {
    name: "Race",
    isColumn: true,
    isFilter: true,
    key: "ra",        
  },
  {
    name: "Weapon",
    isColumn: true,
    isFilter: true,
    key: "w",        
  },
];

function getDataModel() {
  // Copy the data model locally to modify "checked" properties
  return Object.fromEntries(categories.map(c => [c.key, Utils.copy(DataModel[c.key])]));  
}

export default {
  components: {
    Checkbox,
    DataFilter
  },
  data() {
    return {
      search_name: false,
      search_ca_names: false,
      search_ca_desc: false,
      search_skill_names: false,
      search_skill_desc: false,
      case_sensitive: false,
      whole_word: false,
      data_model: getDataModel(),
      data: null,
      results: [],
      index: 0,
      slice_size: 10,
    }
  },
  methods: {
    search() {
      let expression = this.$refs.searchfield.value;
      if (this.whole_word) {
        expression =  '\\b' + expression + '\\b';
      }
      const expression_length = this.$refs.searchfield.value.length;
      
      // Reset the results
      this.results = [];
      this.index = 0;
      if (this.data === null) {
        return;
      }
      if (expression_length === 0) {
        return;
      }

      let flags = '';
      if (this.case_sensitive === false) {
        flags += 'i';
      }
      const re = new RegExp(expression, flags);

      this.results = this.data.filter(obj => {
        if (this.search_name && obj.n !== null) {
          if (re.test(obj.n)) {
            return true;
          }
        }
        if (obj.o !== null) {
          if (this.search_ca_names && obj.o.some(ougi => re.test(ougi.n))) {
            return true;
          }
          if (this.search_ca_desc && obj.o.some(ougi => re.test(ougi.d))) {
            return true;
          }
        }
        if (obj.s !== null) {
          if (this.search_skill_names && obj.s.some(skill => re.test(skill.n))) {
            return true;
          }
          if (this.search_skill_desc && obj.s.some(skill => re.test(skill.d))) {
            return true;
          }
        }
        return false;
      });
    },
    highlight(text, highlight = true) {
      if (highlight === false) {
        return text;
      }

      let expression = this.$refs.searchfield.value;
      if (this.whole_word) {
        expression =  '\\b' + expression + '\\b';
      }
      const expression_length = this.$refs.searchfield.value.length;
      let flags = 'g';
      if (this.case_sensitive === false) {
        flags += 'i';
      }
      const re = new RegExp(expression, flags);
      const res_split = text.split(re);

      let result = res_split[0];
      let size = result.length;
      for (let i=1; i < res_split.length; i++) {
        result += '<span class="bg-primary">' + text.slice(size, size + expression_length) + '</span>' + res_split[i];
        size += res_split[i].length + expression_length;
      }

      return result;
    },
    getResultsSlice() {
      if (this.index * this.slice_size > this.getResults.length) {
        this.index = 0;
      }
      return this.getResults.slice(this.index * this.slice_size, this.index * this.slice_size + this.slice_size);
    }
  },
  computed: {
    getFilters() {
      return categories.filter(c => { return c.isFilter });
    },
    getResults() {
      return this.results.filter(item => {
        return this.getFilters.every(f => this.data_model[f.key].show(item[f.key]));
      });
    }
  },
  watch: {
    search_name() {
      lsMgt.setValue('search_name', this);
    },
    search_ca_names() {
      lsMgt.setValue('search_ca_names', this);
    },
    search_ca_desc() {
      lsMgt.setValue('search_ca_desc', this);
    },
    search_skill_names() {
      lsMgt.setValue('search_skill_names', this);
    },
    search_skill_desc() {
      lsMgt.setValue('search_skill_desc', this);
    },
    case_sensitive() {
      lsMgt.setValue('case_sensitive', this);
    },
    whole_word() {
      lsMgt.setValue('whole_word', this);
    },
  },
  mounted() {
    lsMgt.getValue(this, 'search_name');
    lsMgt.getValue(this, 'search_ca_names');
    lsMgt.getValue(this, 'search_ca_desc');
    lsMgt.getValue(this, 'search_skill_names');
    lsMgt.getValue(this, 'search_skill_desc');
    lsMgt.getValue(this, 'case_sensitive');
    lsMgt.getValue(this, 'whole_word');

    this.axios.get('/search/characters')
      .then(response => this.data = response.data)
      .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));

    this.$nextTick().then(() => {
      this.$refs.searchfield.focus();
    });
  }
}
</script>