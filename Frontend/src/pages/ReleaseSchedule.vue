<template>
  <div class="flex flex-col">
    <h1 class="self-center mb-8">Release Schedule</h1>
    
    <div v-if="loading === true">
      Loading...
    </div>
    <div class="flex flex-col items-center" v-else>
      <!-- Data filters -->
      <div class="flex flex-row flex-wrap items-center gap-4">
        <data-filter
          v-for="category in getFilters"
          :key="category.name"
          :category="category.name"
          :data="data_model[category.key].data"          
        ></data-filter>

        <div class="inline-flex flex-row flex-wrap items-center btn-group">
          <span class="mr-2">Year</span>
          <button
            v-for="(year, index) in getYears"
            :key="year"
            class="btn btn-sm"
            :class="getYears[index] === current_year ? 'btn-blue' : 'btn-white'"
            @click="current_year = year"
          >
            {{ year }}
          </button>
        </div>

        <div class="inline-flex flex-row flex-wrap items-center btn-group">
          <span class="mr-2">Obtain</span>
          <button
            class="btn btn-sm"
            :class="show_obtain_premium ? 'btn-blue' : 'btn-white'"
            @click="show_obtain_premium = ! show_obtain_premium"
          >
            Premium Draw
          </button>
          <button
            class="btn btn-sm"
            :class="show_obtain_classic ? 'btn-blue' : 'btn-white'"
            @click="show_obtain_classic = ! show_obtain_classic"
          >
            Classic Draw
          </button>
          <button
            class="btn btn-sm"
            :class="show_obtain_other ? 'btn-blue' : 'btn-white'"
            @click="show_obtain_other = ! show_obtain_other"
          >
            Other
          </button>
        </div>

        <div class="inline-flex flex-row flex-wrap items-center btn-group">
          <span class="mr-2">Show</span>
          <button
            class="btn btn-sm"
            :class="show_characters ? 'btn-blue' : 'btn-white'"
            @click="show_characters = ! show_characters"
          >
            Characters
          </button>
          <button 
            class="btn btn-sm"
            :class="show_summons ? 'btn-blue' : 'btn-white'"
            @click="show_summons = ! show_summons"
          >
            Summons
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="content mt-4 mb-8">
        <h2>Statistics:</h2>
        Characters: {{ count_characters }}<br>
        Summons: {{ count_summons }}
      </div>

      <!-- List -->
      <div class="flex flex-row flex-wrap gap-2">
        <div class="flex flex-col p-2 bg-secondary rounded" v-for="days in getRelease" :key="days[0]">
          <span class="text-xl font-bold self-center">{{ days[1][0].rd.toLocaleDateString("default", { month: 'long', day: 'numeric' }) }}</span>
          <div class="flex flex-row flex-wrap self-center">
            <span
              class="flex flex-col"
              style="width: 105px;"
              v-for="unit in days[1]"
              :key="unit.id"
            >
              <a
                class="text-xs text-primary h-5 px-1 text-center truncate"
                target="_blank"
                :href="'https://gbf.wiki/' + unit.n"
                :title="getName(unit)"
              >{{ getName(unit) }}</a>
              <img
                style="height: 60px;"
                :title="getName(unit)"
                :src="'/img/unit_small/' + unit.id + '000.jpg'"
              >
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import DataModel from '@/js/data-model.js'
import Utils from '@/js/utils.js'
import { LANGUAGES } from '@/js/lang'
import releaseStoreMixin from '@/store/modules/release-schedule'

import DataFilter from '@/components/common/DataFilter.vue'

const categories = [
  {
    name: "Name",
    isColumn: true,
    isFilter: false,
    key: "n",
  },
  {
    name: "Rarity",
    isColumn: true,
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

function getDataModel() {
  // Copy the data model locally to modify "checked" properties
  let result = Object.fromEntries(categories.map(c => [c.key, Utils.copy(DataModel[c.key])]));
  
  // Set rarity to All
  Object.values(result.ri.data).forEach(v => v.checked = true);
  return result;
}

export default {
  components: {
    DataFilter,
  },
  mixins: [
    releaseStoreMixin
  ],
  head: {
    title: 'Granblue.Party - Release Schedule',
    desc: 'Take a look at every character and summoned already released, sorted by date',
    image: 'https://www.granblue.party/img/card_release.jpg',
    keywords: 'release, schedule, new units, new characters, new summons, gacha, event'
  },
  data() {
    return {
      now: new Date(),
      current_year: new Date().getFullYear(),
      count_characters: 0,
      count_summons: 0,
      data_model: getDataModel(),
      show_characters: true,
      show_summons: true,
      show_obtain_premium: true,
      show_obtain_classic: true,
      show_obtain_other: true,
      loading: true,
   }
  },
  methods: {
    loadData() {
      return Promise.all([
          this.$store.dispatch('release/fetchCharacters'),
          this.$store.dispatch('release/fetchSummons')
        ])        
    },
    getName(element) {
      if (this.isLangEnglish) {
        return element.n;
      }
      return element.nj;
    },
  },
  computed: {
    ...mapState('release', [
      'characters',
      'summons'
    ]),
    getYears() {
      let years = [];
      for (let i = this.now.getFullYear(); i>=2014; i--) {
        years.push(i);
      }
      return years;
    },
    getFilters() {
      return categories.filter(c => { return c.isFilter });
    },
    getRelease() {
      const releaseMap = new Map();
      let countCharacters = 0;
      let countSummons = 0;

      if (this.show_characters) {
        this.characters.forEach(unit => {
          if ( ! this.getFilters.every(e => this.data_model[e.key].show(unit[e.key]))) {
            return;
          }
          if ( ! this.show_obtain_premium && unit.d >= 1000) {
            return;
          }
          if ( ! this.show_obtain_classic && unit.d == 500) {
            return;
          }
          if ( ! this.show_obtain_other && unit.d < 500) {
            return;
          }

          // Filter date
          if (unit.rd.getFullYear() === this.current_year) {
            const dateString = unit.rd.toLocaleDateString("en-US", { month: '2-digit', day: '2-digit' });
            if (releaseMap.has(dateString)) {
              releaseMap.get(dateString).push(unit);
            }
            else {
              releaseMap.set(dateString, [unit]);
            }
            countCharacters++;
          }
        });
      }

      if (this.show_summons) {
        this.summons.forEach(unit => {
          if ( ! this.getFilters.every(e => this.data_model[e.key].show(unit[e.key]))) {
            return;
          }
          if ( ! this.show_obtain_premium && unit.d >= 1000) {
            return;
          }
          if ( ! this.show_obtain_classic && unit.d == 500) {
            return;
          }
          if ( ! this.show_obtain_other && unit.d < 500) {
            return;
          }

          if (unit.rd.getFullYear() === this.current_year) {
            const dateString = unit.rd.toLocaleDateString("en-US", { month: '2-digit', day: '2-digit' });
            if (releaseMap.has(dateString)) {
              releaseMap.get(dateString).push(unit);
            }
            else {
              releaseMap.set(dateString, [unit]);
            }
            countSummons++;
          }
        });
      }

      this.count_characters = countCharacters;
      this.count_summons = countSummons;
      return [...releaseMap.entries()].sort((a, b) => a[0] < b[0]);
    },
    isLangEnglish() {
      return this.$store.getters.getLang === LANGUAGES.EN;
    }
  },
  serverPrefetch() {
    return this.loadData();
  },
  async mounted() {
    await this.loadData()
      .then(_ => this.$store.dispatch('release/makeDates'))
      .then(_ => this.loading = false);
  },
}
</script>