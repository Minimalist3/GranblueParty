<template>
  <div>
    <!-- Top bar -->
    <div v-if="isOwnCollection" class="flex flex-row flex-wrap items-center mb-4">
      <button class="btn btn-white mr-4" @click="show_modal_url = true">
        <fa-icon :icon="['fas', 'folder-open']" class="text-xl"></fa-icon> Load Wiki collection
      </button>
      <button class="btn btn-white mr-4" @click="shareCollection">
       <fa-icon :icon="['fas', 'share-alt']" class="text-xl"></fa-icon> Share
      </button>    
      <button class="btn btn-blue mr-4" @click="saveCollection" :disabled="! modification">
        <fa-icon :icon="['fas', 'save']" class="text-xl"></fa-icon> Save changes
      </button>
      <span>{{ saveMessage }}</span>
    </div>
    
    <!-- Data filters -->
    <div class="flex flex-row flex-wrap items-center mb-4">
      <data-filter
        class="my-2 mr-2"
        v-for="category in filters"
        :key="category.name"
        :category="category.name"
        :data="dataModel[category.key].data"        
      ></data-filter>

      <div class="flex flex-row flex-wrap items-center btn-group my-2 mr-2">
        <span class="mr-2">Show</span>
        <button class="btn btn-sm" :class="showCharacters ? 'btn-blue' : 'btn-white'" @click="setShowCharacters()">Characters</button>
        <button class="btn btn-sm" :class="showSummons ? 'btn-blue' : 'btn-white'" @click="setShowSummons()">Summons</button>
      </div>

      <checkbox class="mr-2 my-2" v-model="showNames">Show names</checkbox>
      <checkbox class="my-2" v-model="showStars">Show stars</checkbox>
    </div>

    <!-- Draw stats -->
    <div class="flex flex-col items-start mb-8">
      <a 
        class="btn-blue rounded-t font-bold hover:text-primary cursor-pointer p-2"
        :class="showStats ? '' : 'rounded-b'"
        @click="showStats = !showStats"
        title="Click to toggle..."
      >
        Collection statistics {{ filtersActive ? '(filters active)' : '' }}
        <fa-icon v-if=" ! showStats" :icon="['fas', 'angle-right']" class="ml-2"></fa-icon>
        <fa-icon v-if="showStats" :icon="['fas', 'angle-down']" class="ml-2"></fa-icon>
      </a>
      <div class="flex flex-row flex-wrap p-2 bg-secondary" v-if="showStats">
        <div class="flex flex-col mx-4">
          <span class="mb-2">Characters <span class="tag text-inverse bg-inverse">{{ chara_count.sum }}/{{ chara_total.sum }}</span></span>
          <ul class="list-disc ml-4">
            <li class="mb-2">Gacha
              <ul>
                <li><label><input type="checkbox" v-model="chara_show[1000]"> Premium Draw</label>
                    <span class="tag bg-primary">{{ chara_count[1000] }}/{{ chara_total[1000] }}</span></li>
                <li><label><input type="checkbox" v-model="chara_show[1010]"> Valentine</label>
                    <span class="tag bg-primary">{{ chara_count[1010] }}/{{ chara_total[1010] }}</span></li>
                <li><label><input type="checkbox" v-model="chara_show[1020]"> Holiday</label>
                    <span class="tag bg-primary">{{ chara_count[1020] }}/{{ chara_total[1020] }}</span></li>
                <li><label><input type="checkbox" v-model="chara_show[1030]"> Summer</label>
                    <span class="tag bg-primary">{{ chara_count[1030] }}/{{ chara_total[1030] }}</span></li>
                <li><label><input type="checkbox" v-model="chara_show[1040]"> Halloween</label>
                    <span class="tag bg-primary">{{ chara_count[1040] }}/{{ chara_total[1040] }}</span></li>
                <li><label><input type="checkbox" v-model="chara_show[1050]"> Zodiac</label>
                    <span class="tag bg-primary">{{ chara_count[1050] }}/{{ chara_total[1050] }}</span></li>
                <li><label><input type="checkbox" v-model="chara_show[1500]"> Flash Gala</label>
                    <span class="tag bg-primary">{{ chara_count[1500] }}/{{ chara_total[1500] }}</span></li>
                <li><label><input type="checkbox" v-model="chara_show[1600]"> Premium Gala</label>
                    <span class="tag bg-primary">{{ chara_count[1600] }}/{{ chara_total[1600] }}</span></li>
              </ul>
            </li>
            <li class="mb-2">Non-gacha
              <ul>
                <li><label><input type="checkbox" v-model="chara_show[10]"> Eternals</label>
                    <span class="tag bg-primary">{{ chara_count[10] }}/{{ chara_total[10] }}</span></li>
                <li><label><input type="checkbox" v-model="chara_show[20]"> Evokers</label>
                    <span class="tag bg-primary">{{ chara_count[20] }}/{{ chara_total[20] }}</span></li>
                <li><label><input type="checkbox" v-model="chara_show[null]"> Others</label>
                    <span class="tag bg-primary">{{ chara_count[null] }}/{{ chara_total[null] }}</span></li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="flex flex-col mx-4">
          <span class="mb-2">Summons <span class="tag text-inverse bg-inverse">{{ summon_count.sum }}/{{ summon_total.sum }}</span></span>
          <ul class="list-disc ml-4">
            <li class="mb-2">Gacha
              <ul>
                <li><label><input type="checkbox" v-model="summon_show[1000]"> Premium Draw</label>
                    <span class="tag bg-primary">{{ summon_count[1000] }}/{{ summon_total[1000] }}</span></li>
                <li><label><input type="checkbox" v-model="summon_show[1030]"> Summer</label>
                    <span class="tag bg-primary">{{ summon_count[1030] }}/{{ summon_total[1030] }}</span></li>
                <li><label><input type="checkbox" v-model="summon_show[1600]"> Non-ticketable</label>
                    <span class="tag bg-primary">{{ summon_count[1600] }}/{{ summon_total[1600] }}</span></li>
              </ul>
            </li>
            <li class="mb-2">Non-gacha
              <ul>
                <li><label><input type="checkbox" v-model="summon_show[20]"> Arcarum</label>
                    <span class="tag bg-primary">{{ summon_count[20] }}/{{ summon_total[20] }}</span></li>
                <li><label><input type="checkbox" v-model="summon_show[null]"> Others</label>
                    <span class="tag bg-primary">{{ summon_count[null] }}/{{ summon_total[null] }}</span></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Collection -->
    <div v-if="loading !== 2">
      Loading...
    </div>
    <div v-else>
      <div v-for="i in 7" :key="i" class="mb-4">
        <div class="flex flex-row flex-wrap" v-if="showCharacters">
          <span class="flex flex-col" style="width: 105px;" v-for="chara in getCharacters(i-1)" :key="chara.id">
            <a
              class="text-xs text-primary h-5 px-1 text-center truncate"
              target="_blank"
              :href="'https://gbf.wiki/' + chara.n"
              :title="chara.n"
              v-if="showNames"
            >
              {{ chara.n }}
            </a>
            <img
              :class="chara.owned ? '' : 'grayscale-80'"
              style="height: 60px;"
              :title="chara.n"
              :src="'/img/unit_small/' + chara.id + '000.jpg'"
              @click="selectChara(chara)"
            >
            <span @click="starsModified()" style="height: 21px;" v-if="showStars">
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
        <div class="flex flex-row flex-wrap" v-if="showSummons">
          <span class="flex flex-col" style="width: 105px;" v-for="summon in getSummons(i-1)" :key="summon.id">
            <a
              class="text-xs text-primary h-5 px-1 text-center truncate"
              target="_blank"
              :href="'https://gbf.wiki/' + summon.n"
              :title="summon.n"
              v-if="showNames"
            >
              {{ summon.n }}
            </a>
            <img            
              :class="summon.owned ? '' : 'grayscale-80'"
              style="height: 60px;"
              :title="summon.n"
              :src="'/img/unit_small/' + summon.id + '000.jpg'"
              @click="selectSummon(summon)"
            >
            <span @click="starsModified()" style="height: 21px;" v-if="showStars">
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
    <input v-show="clipboardText.length > 0" id="clipboardInput" readonly type="text" :value="clipboardText">

    <!-- Modal -->
    <modal-url v-model="show_modal_url" @import="loadWikiCollection"></modal-url>
  </div>
</template>

<script>
import base64js from '@/js/libs/base64js.js'
import Utils from '@/js/utils.js'
import DataModel from '@/js/data-model.js'

import Checkbox from '@/components/common/Checkbox.vue'
import DataFilter from '@/components/DataFilter.vue'
import ModalUrl from '@/components/ModalWikiURL.vue'
import StarsLine from '@/components/StarsLine.vue'

const lsMgt = new Utils.LocalStorageMgt('CollectionTracker');

const INITIAL_DATA = () => {
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
    showStars: true,
    showCharacters: true,
    showSummons: true,
    showStats: false,
    show_modal_url: false,
    saveMessage: '',
    clipboardText: '',
    loading: 0,
  }
}

export default {
  components: {
    Checkbox,
    DataFilter,
    ModalUrl,
    StarsLine,
  },
  data() {
    return INITIAL_DATA();
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
      this.filters = this.getCategories.filter(c => { return c.isFilter });
      // Copy the data model locally to modify "checked" properties
      this.getCategories.forEach(c => {
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
    },
    loadWikiCollection(url) {
      this.saveMessage = "";
      let units = new Map();

      let parts = url.split(';');
      for (let i = 1; i <= 7; i++) {
        if (typeof parts[i] !== 'string') {
          parts[i] = '';
        }
      }
      const strings = { 
        3020000: parts[3], 3030000: parts[2], 3040000: parts[1],
        2020000: parts[6], 2030000: parts[5], 2040000: parts[4]
      };

      // Is URL valid ?
      if (parts[1].length + parts[2].length + parts[3].length + parts[4].length + parts[5].length + parts[6].length < 1) {
        this.saveMessage = "Invalid wiki collection URL";
        return;
      }

      for (let [key, value] of Object.entries(strings)) {
        if(value.length < 1)
          continue;
        
        let buffer = base64js.toByteArray(value);
        let len = buffer.length / 3;
        for (let i = 0; i < len; i++) {
          let evos = 0;
          evos |= (buffer[i*3  ] <<  0);
          evos |= (buffer[i*3+1] <<  8);
          evos |= (buffer[i*3+2] << 16);

          for (let j = 0; j < 8; j++) {
            let evo = ((evos >> (j*3)) & 0x07) - 1;
            if (evo < 0)
              continue;
            let short_id = parseInt(key, 10) + (i*8+j);
            units.set(short_id, evo);
          }
        }
      }

      this.characters.flat().forEach(c => {
        const stars = units.get(c.id);
        if (stars !== undefined) {
          c.owned = true;
          c.sc = stars;
        }
        else if (c.owned === true) {
          c.owned = false;
        }
      });
      this.summons.flat().forEach(c => {
        const stars = units.get(c.id);
        if (stars !== undefined) {
          c.owned = true;
          c.sc = stars;
        }
        else if (c.owned === true) {
          c.owned = false;
        }
      });

      this.modification = true;
    }
  },
  computed: {
    getCategories() {
      return [
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
    },
    filtersActive() {
      return Object.values(this.chara_show).some(c => !c) || Object.values(this.summon_show).some(c => !c)
    },
    isOwnCollection() {
      return this.$route.params.collection_id === undefined;
    },
  },
  created() {
    lsMgt.getValue(this, 'showNames');
    lsMgt.getValue(this, 'showStars');
    lsMgt.getValue(this, 'showCharacters');
    lsMgt.getValue(this, 'showSummons');
    lsMgt.getValue(this, 'chara_show');
    lsMgt.getValue(this, 'summon_show');

    this.loadCollection();
  },
  watch: {
    '$route'(to, from) {
      // When the route changes from "Other collection" to "My collection"
      Object.assign(this.$data, INITIAL_DATA());
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
    showNames() {
      lsMgt.setValue('showNames', this);
    },
    showStars() {
      lsMgt.setValue('showStars', this);
    }
  }
}
</script>