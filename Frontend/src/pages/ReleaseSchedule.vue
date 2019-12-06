<template>
  <div>
    <h1>Release Schedule</h1>
    
    <div v-if="loading !== 2">
      Loading...
    </div>
    <div v-else>
      <!-- Data filters -->
      <div class="flex flex-row flex-wrap items-center">
        <data-filter
          class="mr-2 my-2"
          v-for="category in getFilters"
          :key="category.name"
          :category="category.name"
          :data="data_model[category.key].data"          
        ></data-filter>

        <div class="inline-flex flex-row flex-wrap items-center btn-group mr-2">
          <span class="mr-2 my-2">Year</span>
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

        <div class="inline-flex flex-row flex-wrap items-center btn-group mr-2">
          <span class="mr-2 my-2">Obtain</span>
          <button
            class="btn btn-sm"
            :class="show_obtain_gacha ? 'btn-blue' : 'btn-white'"
            @click="show_obtain_gacha = ! show_obtain_gacha"
          >
            Gacha
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
          <span class="mr-2 my-2">Show</span>
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
      <div v-for="days in getRelease" :key="days[0]">
        <div class="mt-4">
          <span class="text-xl font-bold">{{ days[1][0].rd.toLocaleDateString("default", { month: 'long', day: 'numeric' }) }}</span>
          <br>
          <div class="flex flex-row flex-wrap">
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
                :title="unit.n"
              >
                {{ unit.n }}
              </a>
              <img
                style="height: 60px;"
                :title="unit.n"
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
import DataModel from '@/js/data-model.js'
import Utils from '@/js/utils.js'

import DataFilter from '@/components/DataFilter.vue'

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

export default {
  components: {
    DataFilter,
  },
  data() {
    return {
      loading: 0,
      now: new Date(),
      current_year: new Date().getFullYear(),
      characters: [],
      summons: [],
      count_characters: 0,
      count_summons: 0,
      data_model: {},
      show_characters: true,
      show_summons: true,
      show_obtain_gacha: true,
      show_obtain_other: true,
    }
  },
  computed: {
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
          if ( ! this.show_obtain_gacha && unit.d >= 1000) {
            return;
          }
          if ( ! this.show_obtain_other && unit.d < 1000) {
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
          if ( ! this.show_obtain_gacha && unit.d >= 1000) {
            return;
          }
          if ( ! this.show_obtain_other && unit.d < 1000) {
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
    }
  },
  mounted() {
    // Copy the data model locally to modify "checked" properties
    categories.forEach(c => {
      Vue.set(this.data_model, c.key, Utils.copy(DataModel[c.key]));
    });
    // Set rarity to All
    Object.values(this.data_model.ri.data).forEach(v => v.checked = true);
    
    this.$http.get("/release/characters")
      .then(response => {
        response.data.forEach(element => {
          element.rd = new Date(element.rd);
        });

        this.characters = response.data;
        this.loading++;
      })
      .catch(error => console.log(error));

    this.$http.get("/release/summons")
      .then(response => {
        response.data.forEach(element => {
          element.rd = new Date(element.rd);
        });

        this.summons = response.data;
        this.loading++;
      })
      .catch(error => console.log(error));
  }
}
</script>