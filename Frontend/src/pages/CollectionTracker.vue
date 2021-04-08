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
      <button class="btn btn-blue" @click="saveCollection" :disabled="! modification">
        <fa-icon :icon="['fas', 'save']" class="text-xl"></fa-icon> Save changes
      </button>
    </div>
    
    <!-- Data filters -->
    <div class="flex flex-row flex-wrap items-center mb-4">
      <data-filter
        class="my-2 mr-2"
        v-for="category in getFilters"
        :key="category.name"
        :category="category.name"
        :data="data_model[category.key].data"        
      ></data-filter>

      <div class="flex flex-row flex-wrap items-center btn-group my-2 mr-2">
        <span class="mr-2">Show</span>
        <button class="btn btn-sm" :class="showCharacters ? 'btn-blue' : 'btn-white'" @click="setShowCharacters()">Characters</button>
        <button class="btn btn-sm" :class="showSummons ? 'btn-blue' : 'btn-white'" @click="setShowSummons()">Summons</button>
      </div>

      <checkbox class="mr-2 my-2" v-model="showNames">Show names</checkbox>
      <checkbox class="mr-2 my-2" v-model="showStars">Show stars</checkbox>
      <checkbox class="my-2" v-model="showAwakening">Show awakening</checkbox>      
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
        <fa-icon v-else :icon="['fas', 'angle-down']" class="ml-2"></fa-icon>
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
                <li><label><input type="checkbox" v-model="summon_show[1020]"> Holiday</label>
                    <span class="tag bg-primary">{{ summon_count[1020] }}/{{ summon_total[1020] }}</span></li>
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
    <div v-if="loading === true">
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
              :title="getName(chara)"
              v-if="showNames"
            >{{ getName(chara) }}</a>
            <img
              :class="chara.owned ? '' : 'grayscale-80'"
              style="height: 60px;"
              :title="getName(chara)"
              :src="'/img/unit_small/' + chara.id + '000.jpg'"
              @click="selectChara(chara)"
            >
            <span @click="starsModified()" style="min-height: 21px;" v-if="showStars">
              <stars-line
                v-if="chara.owned"
                :base="chara.sb"
                :extra="chara.sm"
                :current.sync="chara.sc"
                :max="5"
                :readOnly=" ! isOwnCollection"
                :transcendance="true"
              ></stars-line>
            </span>
            <span @click="starsModified()" v-if="showAwakening && chara.owned" class="text-sm pb-2 pl-1">
              <stat-input
                shortName="Awake"
                longName="Awakening"
                :class="chara.aw == MAX_AWAKENING() ? 'text-link-primary' : ''"
                :prop.sync="chara.aw"
                :length="1"
                :max="MAX_AWAKENING()"
              ></stat-input>
              <fa-icon
                v-if="chara.aw < MAX_AWAKENING()"
                @click="chara.aw = MAX_AWAKENING()"
                :icon="['fas', 'check']"
                class="ml-1 cursor-pointer"
                title="Maximize awakening"
              ></fa-icon>
            </span>
          </span>
        </div>
        <div class="flex flex-row flex-wrap" v-if="showSummons">
          <span class="flex flex-col" style="width: 105px;" v-for="summon in getSummons(i-1)" :key="summon.id">
            <a
              class="text-xs text-primary h-5 px-1 text-center truncate"
              target="_blank"
              :href="'https://gbf.wiki/' + summon.n"
              :title="getName(summon)"
              v-if="showNames"
            >{{ getName(summon) }}</a>
            <img            
              :class="summon.owned ? '' : 'grayscale-80'"
              style="height: 60px;"
              :title="getName(summon)"
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
    <input v-show="clipboard_text.length > 0" id="clipboardInput" readonly type="text" :value="clipboard_text">

    <!-- Modal -->
    <modal-url v-model="show_modal_url" @import="loadWikiCollection"></modal-url>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import base64js from '@/js/libs/base64js.js'
import Utils from '@/js/utils.js'
import DataModel from '@/js/data-model.js'
import { LANGUAGES } from '@/js/lang'
import collectionModule from '@/store/modules/collection-tracker'

import Checkbox from '@/components/common/Checkbox.vue'
import StatInput from '@/components/common/StatInput.vue'
import DataFilter from '@/components/DataFilter.vue'
import ModalUrl from '@/components/ModalWikiURL.vue'
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

function getDataModel() {
  // Copy the data model locally to modify "checked" properties
  return Object.fromEntries(categories.map(c => [c.key, Utils.copy(DataModel[c.key])]));
}

const INITIAL_DATA = () => {
  return {
    // Add the corresponding values in the store
    chara_show: {
      null: true, 10: true, 20: true,
      1000: true, 1010: true, 1020: true, 1030: true, 1040: true, 1050: true,
      1500: true, 1600: true,
    },
    summon_show: {
      null: true, 20: true,
      1000: true, 1020: true, 1030: true,
      1600: true,
    },
    data_model: getDataModel(),
    modification: false,
    showNames: true,
    showStars: true,
    showAwakening: false,
    showCharacters: true,
    showSummons: true,
    showStats: false,
    show_modal_url: false,
    clipboard_text: '',
    loading: true,
  }
}

export default {
  components: {
    Checkbox,
    StatInput,
    DataFilter,
    ModalUrl,
    StarsLine,
  },
  head: {
    title: 'Granblue.Party - Collection Tracker',
    desc: 'Track the characters and summons you unlocked, and share your collection with your friends',
    image: 'https://www.granblue.party/img/preview_collection.png',
    keywords: 'collection, tracker, characters, summons, share'
  },
  data() {
    return INITIAL_DATA();
  },
  methods: {
    MAX_AWAKENING() {
      return 7;
    },
    getName(element) {
      if (this.isLangEnglish) {
        return element.n;
      }
      return element.nj;
    },
    getCharacters(element) {
      if (this.characters) {
        return this.characters[element].filter(chara => {
          if ( ! this.chara_show.hasOwnProperty(chara.d)) {
            console.log('Unknown Character category ' + chara.d + '. Please report this error to the administrator.');
            return true;
          }
          if ( ! this.chara_show[chara.d]) {
            return false;
          }
          return this.getFilters.every(e => {
            return this.data_model[e.key].show(chara[e.key])
          })
        });
      }
      return [];
    },
    getSummons(element) {
      if (this.summons) {
        return this.summons[element].filter(summ => {
          return this.getFilters.every(e => {
            if (summ[e.key] === undefined) {
              return true;
            }
            if ( ! this.summon_show.hasOwnProperty(summ.d)) {
              console.log('Unknown Summon category ' + summ.d + '. Please report this error to the administrator.');
              return true;
            }
            if ( ! this.summon_show[summ.d]) {
              return false;
            }
            return this.data_model[e.key].show(summ[e.key])
          })
        });
      }
      return [];
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
              postData.c.push([chara.id, chara.sc, chara.owned, chara.aw]);
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

        this.axios.post('/tracker/save', postData)
          .then(response => this.$store.dispatch('addMessage', {message: 'Collection saved successfully'}))
          .catch(error => this.$store.dispatch('addAxiosErrorMessage', error))
      }
    },
    shareCollection() {
      const text = window.location.href  + '/' + this.$store.getters.getUserId;
      // Put in clipboard
      this.clipboard_text = text;
      let self = this;
      this.$nextTick().then(() => {
        const input = document.getElementById("clipboardInput");
        input.select();
        document.execCommand("copy");
        self.clipboard_text = '';

        self.$store.dispatch('addMessage', {message: 'URL copied to clipboard'})
      });
    },
    loadCollection() {
      let userId = "";
      if (this.isOwnCollection) {
        userId = this.$store.getters.getUserId;
      }
      else {
        // Defined when viewing other collections
        userId = this.$route.params.collection_id;
      }

      return this.$store.dispatch('collection/fetchCollection', userId);
    },
    loadWikiCollection(url) {
      let units = new Map();

      let url_parts = url.split('#');
      if (url_parts.length == 1) {
        url_parts = url_parts[0];
      }
      else {
        url_parts = url_parts[1];
      }

      let parts = url_parts.split('.');
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
        this.$store.dispatch('addMessage', {title: 'Error', message: 'Invalid wiki collection URL'});
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
    ...mapState('collection', [
      'characters',
      'chara_count',
      'chara_total',
      'summons',
      'summon_count',
      'summon_total'
    ]),
    getFilters() {
      return categories.filter(c => { return c.isFilter });
    },
    filtersActive() {
      return Object.values(this.chara_show).some(c => !c) || Object.values(this.summon_show).some(c => !c)
    },
    isOwnCollection() {
      return this.$route.params.collection_id === undefined;
    },
    isLangEnglish() {
      return this.$store.getters.getLang === LANGUAGES.EN;
    }
  },
  serverPrefetch() {
    return this.loadCollection();
  },
  async mounted() {
    lsMgt.getValue(this, 'showNames');
    lsMgt.getValue(this, 'showStars');
    lsMgt.getValue(this, 'showAwakening');    
    lsMgt.getValue(this, 'showCharacters');
    lsMgt.getValue(this, 'showSummons');

    const chara_show = lsMgt.fetchValue('chara_show');
    if (chara_show !== undefined) {
      for (const [key, value] of Object.entries(chara_show)) {
        if (this.chara_show.hasOwnProperty(key)) {
          this.chara_show[key] = value;
        }
      }
    }
    const summon_show = lsMgt.fetchValue('summon_show');
    if (summon_show !== undefined) {
      for (const [key, value] of Object.entries(summon_show)) {
        if (this.summon_show.hasOwnProperty(key)) {
          this.summon_show[key] = value;
        }
      }
    }

    await this.loadCollection()
      .then(_ => this.loading = false);
  },
  beforeCreate() {
    const preserve_state = !! this.$store.state.collection;
    this.$store.registerModule('collection', collectionModule, { preserveState: preserve_state });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.unregisterModule('collection');
    next();
  },
  watch: {
    '$store.getters.getUserId'(id) {
      if (id === null) {
        this.$router.push({name: "collection401"});
      }
      else {
        Object.assign(this.$data, INITIAL_DATA());
        this.loadCollection()
          .then(_ => this.loading = false);
      }
    },
    '$route'(to, from) {      
      // When the route changes from "Other collection" to "My collection"
      Object.assign(this.$data, INITIAL_DATA());
      this.loadCollection()
        .then(_ => this.loading = false);
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
    },
    showAwakening() {
      lsMgt.setValue('showAwakening', this);
    }
  }
}
</script>