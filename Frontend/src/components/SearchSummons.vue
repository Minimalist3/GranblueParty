<template>
  <div class="flex flex-col gap-4">
    <span class="flex flex-row flex-wrap gap-2 items-center">
      <div>Search in</div>
      <checkbox v-model="search_name">Names</checkbox>
      <checkbox v-model="search_call_names">Call names</checkbox>
      <checkbox v-model="search_call_desc">Call descriptions</checkbox>
      <checkbox v-model="search_auras">Auras</checkbox>
      <checkbox v-model="search_subauras">Sub auras</checkbox>
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
          </div>
        </span>

        <img style="max-height: 104px; max-width:138px; height: 104px; width:138px;" :src="'/img/unit/' +  item.id + '000.jpg'">
      </span>

      <span class="flex flex-col">

        <!-- Call -->
        <div class="flex flex-col lg:flex-row lg:items-center flex-wrap lg:flex-nowrap mt-2 gap-2">
          <h4 class="whitespace-nowrap">Call:</h4>
          <div class="whitespace-nowrap font-medium" v-html="highlight(item.cn, search_call_names)" />
          <div v-if="hasData(item.c)" class="divide-y divide-inherit border-secondary">
            <div v-if="item.c[0]" class="text-sm" v-html="highlight(item.c[0], search_call_desc)" />
            <div v-if="item.c[1]" class="flex flex-row lg:items-center gap-x-4">
              <div class="whitespace-nowrap font-medium">MLB</div>
              <div class="text-sm" v-html="highlight(item.c[1], search_call_desc)" />
            </div>
            <div v-if="item.c[2]" class="flex flex-row lg:items-center gap-x-4">
              <div class="whitespace-nowrap font-medium">FLB</div>
              <div class="text-sm" v-html="highlight(item.c[2], search_call_desc)" />
            </div>
            <div v-if="item.c[3]" class="flex flex-row lg:items-center gap-x-4">
              <div class="whitespace-nowrap font-medium">ULB</div>
              <div class="text-sm" v-html="highlight(item.c[3], search_call_desc)" />
            </div>
          </div>
        </div>

        <!-- Aura -->
        <div v-if="hasData(item.a)" class="flex flex-row lg:items-center flex-wrap lg:flex-nowrap mt-2 gap-2">
          <h4 class="whitespace-nowrap">Auras:</h4>
          <div class="divide-y divide-inherit border-secondary">
            <div v-if="item.a[0]" class="text-sm" v-html="highlight(item.a[0], search_auras)" />
            <div v-if="item.a[1]" class="flex flex-row lg:items-center gap-x-4">
              <div class="whitespace-nowrap font-medium">MLB</div>
              <div class="text-sm" v-html="highlight(item.a[1], search_auras)" />
            </div>
            <div v-if="item.a[2]" class="flex flex-row lg:items-center gap-x-4">
              <div class="whitespace-nowrap font-medium">FLB</div>
              <div class="text-sm" v-html="highlight(item.a[2], search_auras)" />
            </div>
            <div v-if="item.a[3]" class="flex flex-row lg:items-center gap-x-4">
              <div class="whitespace-nowrap font-medium">ULB</div>
              <div class="text-sm" v-html="highlight(item.a[3], search_auras)" />
            </div>
          </div>
        </div>

        <!-- Sub Aura -->
        <div v-if="hasData(item.s)" class="flex flex-row lg:items-center flex-wrap lg:flex-nowrap mt-2 gap-2">
          <h4 class="whitespace-nowrap">Sub auras:</h4>
          <div class="divide-y divide-inherit border-secondary">
            <div v-if="item.s[0]" class="text-sm" v-html="highlight(item.s[0], search_subauras)" />
            <div v-if="item.s[1]" class="flex flex-row lg:items-center gap-x-4">
              <div class="whitespace-nowrap font-medium">MLB</div>
              <div class="text-sm" v-html="highlight(item.s[1], search_subauras)" />
            </div>
            <div v-if="item.s[2]" class="flex flex-row lg:items-center gap-x-4">
              <div class="whitespace-nowrap font-medium">FLB</div>
              <div class="text-sm" v-html="highlight(item.s[2], search_subauras)" />
            </div>
            <div v-if="item.s[3]" class="flex flex-row lg:items-center gap-x-4">
              <div class="whitespace-nowrap font-medium">ULB</div>
              <div class="text-sm" v-html="highlight(item.s[3], search_subauras)" />
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

const lsMgt = new Utils.LocalStorageMgt('SearchSummons');

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
      search_call_names: false,
      search_call_desc: true,
      search_auras: true,
      search_subauras: true,
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
        if (this.search_call_names && obj.cn !== null) {
          if (re.test(obj.cn)) {
            return true;
          }
        }
        if (this.search_call_desc && obj.c !== null) {
          if (obj.c.some(call => re.test(call))) {
            return true;
          }
        }
        if (this.search_auras && obj.a !== null) {
          if (obj.a.some(call => re.test(call))) {
            return true;
          }
        }
        if (this.search_subauras && obj.s !== null) {
          if (obj.s.some(call => re.test(call))) {
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
    search_call_names() {
      lsMgt.setValue('search_call_names', this);
    },
    search_call_desc() {
      lsMgt.setValue('search_call_desc', this);
    },
    search_auras() {
      lsMgt.setValue('search_auras', this);
    },
    search_subauras() {
      lsMgt.setValue('search_subauras', this);
    },
  },
  mounted() {
    lsMgt.getValue(this, 'search_name');
    lsMgt.getValue(this, 'search_call_names');
    lsMgt.getValue(this, 'search_call_desc');
    lsMgt.getValue(this, 'search_auras');
    lsMgt.getValue(this, 'search_subauras');

    this.axios.get('/search/summons')
      .then(response => this.data = response.data)
      .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
  }
}
</script>