<template>
  <div>
    <!-- Top bar -->
    <div v-if="isOwnCollection" class="field is-grouped is-grouped-multiline vcenter-line">
      <div class="control">
        <button class="button is-info is-outlined" @click="shareCollection">
          Share
        </button>
      </div>
      
      <div class="control">
        <button class="button is-info" @click="saveCollection" :disabled="! modification">
          Save changes
        </button>
      </div>

      <div class="control">
        {{ saveMessage }}
      </div>
    </div>
    
    <!-- Data filters -->
    <div class="field is-grouped is-grouped-multiline">
      <data-filter
        v-for="category in filters"
        :key="category.name"
        :data="dataModel[category.key].data"
        :category="category.name"
      ></data-filter>

      <div class="field has-addons">
        Show names&nbsp;
        <p class="control">
          <button
            class="button is-small"
            :class="{'is-info': showNames}"
            @click="setShowNames(true)"
          >
            Yes
          </button>
        </p>
        <p class="control">
          <button
            class="button is-small"
            :class="{'is-info': ! showNames}"
            @click="setShowNames(false)"
          >
            No
          </button>
        </p>
        &nbsp;
      </div>

      <div class="field has-addons">
        Show&nbsp;
        <p class="control">
          <button
            class="button is-small"
            :class="{'is-info': showCharacters}"
            @click="setShowCharacters()"
          >
            Characters
          </button>
        </p>
        <p class="control">
          <button
            class="button is-small"
            :class="{'is-info': showSummons}"
            @click="setShowSummons() "
          >
            Summons
          </button>
        </p>
        &nbsp;
      </div>
    </div>

    <!-- Draw stats -->
    <div class="message is-info" style="width: max-content;">
      <header class="message-header" title="Click to toggle...">
        <a
          @click="showStats = !showStats"
          style="text-decoration: none;"
        >
          {{ showStats ? '-' : '+' }} Collection statistics {{ filtersActive ? '(filters active)' : '' }}
        </a>
      </header>
      <div class="columns is-multiline message-body" v-if="showStats">
        <div class="column is-narrow content">
          Characters <span class="tag is-link is-rounded">{{ chara_count.sum }}/{{ chara_total.sum }}</span>
          <ul id="checkboxes">
            <li>Gatcha</li>
            <ul>
              <li><label><input class="checkbox" type="checkbox" v-model="chara_show[1000]"> Premium Draw</label>&nbsp;
                  <span class="tag is-info is-rounded">{{ chara_count[1000] }}/{{ chara_total[1000] }}</span></li>
              <li><label><input class="checkbox" type="checkbox" v-model="chara_show[1010]"> Valentine</label>&nbsp;
                  <span class="tag is-info is-rounded">{{ chara_count[1010] }}/{{ chara_total[1010] }}</span></li>
              <li><label><input class="checkbox" type="checkbox" v-model="chara_show[1020]"> Holiday</label>&nbsp;
                  <span class="tag is-info is-rounded">{{ chara_count[1020] }}/{{ chara_total[1020] }}</span></li>
              <li><label><input class="checkbox" type="checkbox" v-model="chara_show[1030]"> Summer</label>&nbsp;
                  <span class="tag is-info is-rounded">{{ chara_count[1030] }}/{{ chara_total[1030] }}</span></li>
              <li><label><input class="checkbox" type="checkbox" v-model="chara_show[1040]"> Halloween</label>&nbsp;
                  <span class="tag is-info is-rounded">{{ chara_count[1040] }}/{{ chara_total[1040] }}</span></li>
              <li><label><input class="checkbox" type="checkbox" v-model="chara_show[1050]"> Zodiac</label>&nbsp;
                  <span class="tag is-info is-rounded">{{ chara_count[1050] }}/{{ chara_total[1050] }}</span></li>
              <li><label><input class="checkbox" type="checkbox" v-model="chara_show[1500]"> Flash Gala</label>&nbsp;
                  <span class="tag is-info is-rounded">{{ chara_count[1500] }}/{{ chara_total[1500] }}</span></li>
              <li><label><input class="checkbox" type="checkbox" v-model="chara_show[1600]"> Premium Gala</label>&nbsp;
                  <span class="tag is-info is-rounded">{{ chara_count[1600] }}/{{ chara_total[1600] }}</span></li>
            </ul>
            <li>Non-gatcha</li>
            <ul>
              <li><label><input class="checkbox" type="checkbox" v-model="chara_show[10]"> Eternals</label>&nbsp;
                  <span class="tag is-info is-rounded">{{ chara_count[10] }}/{{ chara_total[10] }}</span></li>
              <li><label><input class="checkbox" type="checkbox" v-model="chara_show[20]"> Evokers</label>&nbsp;
                  <span class="tag is-info is-rounded">{{ chara_count[20] }}/{{ chara_total[20] }}</span></li>
              <li><label><input class="checkbox" type="checkbox" v-model="chara_show[null]"> Others</label>&nbsp;
                  <span class="tag is-info is-rounded">{{ chara_count[null] }}/{{ chara_total[null] }}</span></li>
            </ul>
          </ul>
        </div>
        <div class="column is-narrow content">
          Summons <span class="tag is-link is-rounded">{{ summon_count.sum }}/{{ summon_total.sum }}</span>
          <ul id="checkboxes">
            <li>Gatcha</li>
            <ul>
              <li><label><input class="checkbox" type="checkbox" v-model="summon_show[1000]"> Premium Draw</label>&nbsp;
                  <span class="tag is-info is-rounded">{{ summon_count[1000] }}/{{ summon_total[1000] }}</span></li>
              <li><label><input class="checkbox" type="checkbox" v-model="summon_show[1030]"> Summer</label>&nbsp;
                  <span class="tag is-info is-rounded">{{ summon_count[1030] }}/{{ summon_total[1030] }}</span></li>
              <li><label><input class="checkbox" type="checkbox" v-model="summon_show[1600]"> Non-ticketable</label>&nbsp;
                  <span class="tag is-info is-rounded">{{ summon_count[1600] }}/{{ summon_total[1600] }}</span></li>
            </ul>
            <li>Non-gatcha</li>
            <ul>
              <li><label><input class="checkbox" type="checkbox" v-model="summon_show[20]"> Arcarum</label>&nbsp;
                  <span class="tag is-info is-rounded">{{ summon_count[20] }}/{{ summon_total[20] }}</span></li>
              <li><label><input class="checkbox" type="checkbox" v-model="summon_show[null]"> Others</label>&nbsp;
                  <span class="tag is-info is-rounded">{{ summon_count[null] }}/{{ summon_total[null] }}</span></li>
            </ul>
          </ul>
        </div>
      </div>
    </div>

    <br>
    <!-- Collection -->
    <div v-if="loading !== 2">
      Loading...
    </div>
    <div v-else>
      <div
        v-for="i in 7"
        :key="i"
      >
        <div class="tracker_images" v-if="showCharacters">
          <span
            style="width: 105px;"
            v-for="chara in getCharacters(i-1)"
            :key="chara.id"
          >
            <a
              class="scaledText has-text-white"
              target="_blank"
              :href="'https://gbf.wiki/' + chara.n"
              :title="chara.n"
              v-if="showNames"
            >
              {{ chara.n }}
            </a>
            <img
              class="tracker_image"
              :class="{ tracker_disable: ! chara.owned }"            
              :title="chara.n"
              :src="'/img/unit_small/' + chara.id + '000.jpg'"
              @click="selectChara(chara)"
            >
            <span
              class="tracker_stars"
              @click="starsModified()"
            >
              <stars-line
                v-if="chara.owned"
                :base="chara.sb"
                :extra="chara.sm"
                :current.sync="chara.sc"
                :max="5"
                :readOnly=" ! isOwnCollection"                
              ></stars-line>
            </span>
          </span>
        </div>
        <div class="tracker_images" v-if="showSummons">
          <span
            style="width: 105px;"
            v-for="summon in getSummons(i-1)"
            :key="summon.id"
          >
            <a
              class="scaledText has-text-white"
              target="_blank"
              :href="'https://gbf.wiki/' + summon.n"
              :title="summon.n"
              v-if="showNames"
            >
              {{ summon.n }}
            </a>
            <img            
              class="tracker_image"
              :class="{ tracker_disable: ! summon.owned }"            
              :title="summon.n"
              :src="'/img/unit_small/' + summon.id + '000.jpg'"
              @click="selectSummon(summon)"
            >
            <span
              class="tracker_stars"
              @click="starsModified()"
            >
              <stars-line
                v-if="summon.owned"
                :base="summon.sb"
                :extra="summon.sm"
                :current.sync="summon.sc"
                :max="5"
                :readOnly=" ! isOwnCollection"
              ></stars-line>
            </span>
          </span>
        </div>
      </div>
    </div>
    <!-- For clipboard support -->
    <input
      v-show="clipboardText.length > 0"
      id="clipboardInput"
      readonly
      type="text"
      :value="clipboardText"
    >
  </div>
</template>

<script>
import Utils from '@/js/utils.js'
import DataModel from '@/js/dataModel.js'

import DataFilter from '@/components/DataFilter.vue'
import StarsLine from '@/components/StarsLine.vue'

const lsMgt = new Utils.LocalStorageMgt('CollectionTracker');

const categories = [
  {
    name: "Name",
    isColumn: true,
    isFilter: false,
    key: "n",
  },
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
  {
    name: "Owned",
    isColumn: false,
    isFilter: true,
    key: "owned",
  },
];

const initialData = () => {
  return {
    characters: [[], [], [], [], [], [], []],      
    summons: [[], [], [], [], [], [], []],
    chara_count: {
      null: 0, 10: 0, 20: 0,
      1000: 0, 1010: 0, 1020: 0, 1030: 0, 1040: 0, 1050: 0,
      1500: 0, 1600: 0,
      'sum': 0,
    },
    chara_total: {
      null: 0, 10: 0, 20: 0,
      1000: 0, 1010: 0, 1020: 0, 1030: 0, 1040: 0, 1050: 0,
      1500: 0, 1600: 0,
      'sum': 0,
    },
    chara_show: {
      null: true, 10: true, 20: true,
      1000: true, 1010: true, 1020: true, 1030: true, 1040: true, 1050: true,
      1500: true, 1600: true,
    },
    summon_count: {
      null: 0, 20: 0,
      1000: 0, 1030: 0,
      1600: 0,
      'sum': 0,
    },
    summon_total: {
      null: 0, 20: 0,
      1000: 0, 1030: 0,
      1600: 0,
      'sum': 0,
    },
    summon_show: {
      null: true, 20: true,
      1000: true, 1030: true,
      1600: true,
    },    
    dataModel: {},
    filters: [],
    modification: false,
    showNames: true,
    showCharacters: true,
    showSummons: true,
    showStats: false,
    saveMessage: '',
    clipboardText: '',
    loading: 0,
  }
}

export default {
  components: {
    DataFilter,
    StarsLine,
  },
  data() {
    return initialData();
  },
  methods: {
    getCharacters(element) {
      return this.characters[element].filter(chara => {
        if ( ! this.chara_show[chara.d]) {
          return false;
        }
        return this.filters.every(e => {
          return this.dataModel[e.key].show(chara[e.key])
        })
      })
    },
    getSummons(element) {
      return this.summons[element].filter(summ => {
        return this.filters.every(e => {
          if (summ[e.key] === undefined) {
            return true;
          }
          if ( ! this.summon_show[summ.d]) {
            return false;
          }
          return this.dataModel[e.key].show(summ[e.key])
        })
      })
    },
    setShowNames(value) {
      this.showNames = value;
      lsMgt.setValue('showNames', this);
    },
    setShowCharacters() {
      this.showCharacters = ! this.showCharacters;
      lsMgt.setValue('showCharacters', this);
    },
    setShowSummons() {
      this.showSummons = ! this.showSummons;
      lsMgt.setValue('showSummons', this);
    },
    selectChara(object) {
      if (this.isOwnCollection) {
        object.owned = ! object.owned;
        if (object.owned) {
          this.chara_count.sum++;
          this.chara_count[object.d]++;
        }
        else {
          this.chara_count.sum--;
          this.chara_count[object.d]--;
        }
        this.modification = true;
      }
    },
    selectSummon(object) {
      if (this.isOwnCollection) {
        object.owned = ! object.owned;
        if (object.owned) {
          this.summon_count.sum++;
          this.summon_count[object.d]++;
        }
        else {
          this.summon_count.sum--;
          this.summon_count[object.d]--;
        }
        this.modification = true;
      }
    },
    starsModified() {
      if (this.isOwnCollection) {
        this.modification = true;
      }
    },
    saveCollection() {
      if (this.isOwnCollection) {
        const postData = {c: [], s: []};
        this.characters.forEach(cat => {
          cat.forEach(chara => {
            if (chara.owned != null) {
              postData.c.push([chara.id, chara.sc, chara.owned]);
            }
          });
        });
        this.summons.forEach(cat => {
          cat.forEach(summ => {
            if (summ.owned != null) {
              postData.s.push([summ.id, summ.sc, summ.owned]);
            }
          });
        });

        this.saveMessage = '';
        this.$http.post('/tracker/save', postData)
          .then(response => this.saveMessage = 'Collection saved successfully at ' + new Date().toLocaleTimeString())
          .catch(e => this.saveMessage = 'Failed to save collection')
      }
    },
    shareCollection() {
      const text = window.location.href  + '/' + this.$store.getters.getUserId;
      this.saveMessage = text + ' (copied to clipboard)'
      // Put in clipboard
      this.clipboardText = text;
      let self = this;
      Vue.nextTick().then(() => {
        const input = document.getElementById("clipboardInput");
        input.select();
        document.execCommand("copy");
        self.clipboardText = '';
      });  
    },
    loadCollection() {
      this.filters = categories.filter(c => { return c.isFilter });
      // Copy the data model locally to modify "checked" properties
      categories.forEach(c => {
        Vue.set(this.dataModel, c.key, Utils.copy(DataModel[c.key]));
      });

      let userId = "";
      if (this.isOwnCollection) {
        userId = '/' + this.$store.getters.getUserId;
      }
      else {
        // Defined when viewing other collections
        userId = '/' + this.$route.params.collection_id;
      }

      this.$http.get("/tracker/charas" + userId)
              .then(response => {
                response.data.forEach(chara => {
                  this.characters[chara.e].push(chara);
                  if (chara.owned) {
                    this.chara_count.sum++;
                    this.chara_count[chara.d]++;
                  }
                  this.chara_total[chara.d]++;
                });
                this.chara_total.sum = response.data.length;
                this.loading++;
              })
              .catch(error => console.log(error));
      this.$http.get("/tracker/summons" + userId)
              .then(response => {
                response.data.forEach(summ => {
                  this.summons[summ.e].push(summ)
                  if (summ.owned) {
                    this.summon_count.sum++;
                    this.summon_count[summ.d]++;
                  }
                  this.summon_total[summ.d]++;
                });
                this.summon_total.sum = response.data.length;
                this.loading++;
              })
              .catch(error => console.log(error));
    }
  },
  computed: {
    filtersActive() {
      return Object.values(this.chara_show).some(c => !c) || Object.values(this.summon_show).some(c => !c)
    },
    isOwnCollection() {
      return this.$route.params.collection_id === undefined;
    },
  },
  created() {
    lsMgt.getValue(this, 'showNames');
    lsMgt.getValue(this, 'showCharacters');
    lsMgt.getValue(this, 'showSummons');
    lsMgt.getValue(this, 'chara_show');
    lsMgt.getValue(this, 'summon_show');

    this.loadCollection();
  },
  watch: {
    '$route'(to, from) {
      // When the route changes from "Other collection" to "My collection"
      Object.assign(this.$data, initialData());
      this.loadCollection();
    },
    chara_show: {
      handler() {
        lsMgt.setValue('chara_show', this);
      },
      deep: true
    },
    summon_show: {
      handler() {
        lsMgt.setValue('summon_show', this);
      },
      deep: true
    },
  }
}
</script>

<style scoped>

.tracker_images #starsLine {
  width: 105px;  
}

.tracker_stars {
  height: 21px;
}

.tracker_disable {
  filter: grayscale(80%);
}

#checkboxes ul {
  margin-left: 1em;
  list-style: none;
}

</style>
