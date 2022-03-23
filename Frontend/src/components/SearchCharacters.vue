<template>
  <div class="flex flex-col gap-4">
    <span class="flex flex-row flex-wrap gap-2 items-center">
      <div>Search in</div>
      <checkbox v-model="search_name">Names</checkbox>
      <checkbox v-model="search_ca_names">Charge attack names</checkbox>
      <checkbox v-model="search_ca_desc">Charge attack descriptions</checkbox>
      <checkbox v-model="search_skill_names">Skill names</checkbox>
      <checkbox v-model="search_skill_desc">Skill descriptions</checkbox>
    </span>

    <div class="flex flex-row flex-wrap items-center gap-2">
      <data-filter
        v-for="category in getFilters"
        :key="category.name"
        :category="category.name"
        :data="data_model[category.key].data"          
      ></data-filter>
    </div>

    <form @submit.prevent="search()" class="flex flex-row flex-wrap gap-2">
      <input class="input" type="text" placeholder="Search" ref="searchfield" autofocus>
      <button class="btn btn-blue" type="submit">
        <fa-icon :icon="['fas', 'search']" class="text-xl"></fa-icon> Search
      </button>
      <checkbox v-model="case_sensitive">Match case</checkbox>
      <checkbox v-model="whole_word">Match whole word</checkbox>
    </form>

    <div id="results">
      Results: {{ getResults.length }}
    </div>

    <div v-for="(item, k) in getResultsSlice()" :key="k" class="flex flex-col lg:flex-row bg-secondary p-2 gap-2">
      <span class="flex flex-col gap-2">
        <!-- Name -->
        <span>
          {{ index * slice_size + k + 1 }}-
          <a class="font-medium" target="_blank" :href="'https://gbf.wiki/' + item.n" v-html="highlight(item.n, search_name)"></a>
          <br>
          <div class="font-medium">
            {{ data_model['e'].expand(item) }}
            {{ data_model['w'].expand(item) }}
          </div>
        </span>

        <img style="max-height: 96px; max-width:168px; height: 96px; width:168px;" :src="'/img/unit_small/' +  item.id + '000.jpg'">
      </span>

      <span class="flex flex-col">
        <!-- Ougi -->
        <div class="flex flex-col lg:flex-row lg:items-center flex-wrap lg:flex-nowrap mt-2 gap-2">
          <h4 class="whitespace-nowrap">Charge attack:</h4>
          <div class="divide-y divide-inherit border-secondary">
            <div v-for="(ougi, l) in item.o" :key="l" class="flex flex-col lg:flex-row lg:items-center gap-x-4">
              <div class="whitespace-nowrap font-medium" v-html="highlight(ougi.n, search_ca_names)" />
              <div class="text-sm" v-html="highlight(ougi.d, search_ca_desc)" />
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div v-if="item.s" class="flex flex-col lg:flex-row lg:items-center flex-wrap lg:flex-nowrap mt-2 gap-2">
          <h4 class="whitespace-nowrap">Skills:</h4>
          <div class="divide-y divide-inherit border-secondary">
            <div v-for="(skill, l) in item.s" :key="l" class="flex flex-col lg:flex-row lg:items-center gap-x-4">
              <div class="whitespace-nowrap font-medium" v-html="highlight(skill.n, search_skill_names)" />
              <div class="text-sm" v-html="highlight(skill.d, search_skill_desc)" />
            </div>
          </div>
        </div>
      </span>
    </div>

    <nav class="flex flex-row flex-wrap gap-2" role="navigation" aria-label="pagination" v-if="getResults.length > slice_size">
      <span
        class="px-2 py-1 rounded cursor-pointer hover:text-link-hover"
        :class="index === i-1 ? 'bg-tertiary' : 'bg-secondary'"
        v-for="i in Math.ceil(getResults.length / slice_size)"
        :key="i"
        @click="changeSlice(i)"
      >{{ i }}</span>
    </nav>

  </div>
</template>

<script>
import Utils from '@/js/utils.js'
import MixinSearch from '@/js/mixin-search.js'

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

export default {
  components: {
    Checkbox,
    DataFilter
  },
  mixins: [
    MixinSearch(categories, lsMgt)
  ],
  data() {
    return {
      search_name: false,
      search_ca_names: false,
      search_ca_desc: true,
      search_skill_names: false,
      search_skill_desc: true,
    }
  },
  methods: {
    search_impl(re) {
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
  },
  mounted() {
    lsMgt.getValue(this, 'search_name');
    lsMgt.getValue(this, 'search_ca_names');
    lsMgt.getValue(this, 'search_ca_desc');
    lsMgt.getValue(this, 'search_skill_names');
    lsMgt.getValue(this, 'search_skill_desc');

    this.axios.get('/search/characters')
      .then(response => this.data = response.data)
      .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
  }
}
</script>