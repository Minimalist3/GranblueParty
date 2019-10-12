<template>
  <div>
    <h1 class="title has-text-white">Release Schedule for Characters and Summons</h1>
    <div v-if="loading !== 2">
      Loading...
    </div>
    <div v-else>
      <!-- Data filters -->
      <div class="field is-grouped is-grouped-multiline">
        <data-filter
          v-for="category in filters"
          :key="category.name"
          :data="dataModel[category.key].data"
          :category="category.name"
        ></data-filter>

        <div class="field has-addons">
          Year&nbsp;
          <button
            v-for="year in getYears"
            :key="year"
            class="button is-small"
            :class="{'is-info': year === currentYear}"
            @click="currentYear = year"      
          >
            {{ year }}
          </button>
          &nbsp;
        </div>

        <div class="field has-addons">
          Obtain&nbsp;
          <button
            class="button is-small"
            :class="{'is-info': showObtainGacha}"
            @click="showObtainGacha = ! showObtainGacha"      
          >
            Gacha
          </button>
          <button
            class="button is-small"
            :class="{'is-info': showObtainOther}"
            @click="showObtainOther = ! showObtainOther"      
          >
            Other
          </button>
          &nbsp;
        </div>

        <div class="field has-addons">
          Show&nbsp;
          <button
            class="button is-small"
            :class="{'is-info': showCharacters}"
            @click="showCharacters = ! showCharacters"      
          >
            Characters
          </button>
          <button
            class="button is-small"
            :class="{'is-info': showSummons}"
            @click="showSummons = ! showSummons"      
          >
            Summons
          </button>
          &nbsp;
        </div>
      </div>

      <div class="content">
        <span class="is-size-5">Statistics:</span><br>
        Characters: {{ countCharacters }}<br>
        Summons: {{ countSummons }}
      </div>

      <div
        v-for="days in getRelease"
        :key="days[0]"
      >
        <div>
          <span class="is-size-5">{{ days[1][0].rd.toLocaleDateString("default", { month: 'long', day: 'numeric' }) }}</span>
          <br>
          <div class="tracker_images">
            <span
              style="width: 105px;"
              v-for="unit in days[1]"
              :key="unit.id"
            >
              <a
                class="scaledText has-text-white"
                target="_blank"
                :href="'https://gbf.wiki/' + unit.n"
                :title="unit.n"
              >
                {{ unit.n }}
              </a>
              <img
                class="tracker_image"
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
import DataModel from '@/js/dataModel.js'
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
      currentYear: new Date().getFullYear(),
      characters: [],
      summons: [],
      countCharacters: 0,
      countSummons: 0,
      dataModel: {},
      filters: [],
      showCharacters: true,
      showSummons: true,
      showObtainGacha: true,
      showObtainOther: true,
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
    getRelease() {
      const releaseMap = new Map();
      let countCharacters = 0;
      let countSummons = 0;

      if (this.showCharacters) {
        this.characters.forEach(unit => {
          if ( ! this.filters.every(e => this.dataModel[e.key].show(unit[e.key]))) {
            return;
          }
          if ( ! this.showObtainGacha && unit.d >= 1000) {
            return;
          }
          if ( ! this.showObtainOther && unit.d < 1000) {
            return;
          }

          // Filter date
          if (unit.rd.getFullYear() === this.currentYear) {
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

      if (this.showSummons) {
        this.summons.forEach(unit => {
          if ( ! this.filters.every(e => this.dataModel[e.key].show(unit[e.key]))) {
            return;
          }
          if ( ! this.showObtainGacha && unit.d >= 1000) {
            return;
          }
          if ( ! this.showObtainOther && unit.d < 1000) {
            return;
          }

          if (unit.rd.getFullYear() === this.currentYear) {
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

      this.countCharacters = countCharacters;
      this.countSummons = countSummons;
      const days = [...releaseMap.entries()].sort((a, b) => a[0] < b[0]);
      return days;
    }
  },
  created() {
    this.filters = categories.filter(c => { return c.isFilter });
    // Copy the data model locally to modify "checked" properties
    categories.forEach(c => {
      Vue.set(this.dataModel, c.key, Utils.copy(DataModel[c.key]));
    });
    // Set rarity to All
    Object.values(this.dataModel.ri.data).forEach(v => v.checked = true)
    
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
  },
}
</script>
