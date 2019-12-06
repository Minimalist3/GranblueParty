<template>
  <div class="flex flex-col">
    <div class="flex flex-row flex-wrap items-center mb-4" v-if="isUserLogged">
      <span class="mr-2">My parties</span>

      <dropdown class="mr-2" :disabled="parties.length === 0" v-model.number="selected_party" :index.sync="selected_party_index">
        <option disabled :value="-1">Please select a party</option>
        <option
          v-for="(party, index) in parties"
          :key="party.id"
          :value="party.id"
        >Party{{ index+1 }}: {{ party.name }}</option>
      </dropdown>

      <span class="flex flex-row flex-wrap" v-if="parties.length > 0 && selected_party_index > 0">
        <button class="btn btn-blue mr-2" @click="clickPartyLoad()">
          <fa-icon :icon="['fas', 'folder-open']" class="text-xl"></fa-icon> Load
        </button>
        <button class="btn btn-white mr-2" @click="clickPartyShare()">
          <fa-icon :icon="['fas', 'share-alt']" class="text-xl"></fa-icon> Share Party{{ selected_party_index }}
        </button>
        <button class="btn btn-red mr-2" @click="clickPartyDelete()">
          <fa-icon :icon="['fas', 'trash']" class="text-xl"></fa-icon> Delete Party{{ selected_party_index }}
        </button>
        <button class="btn btn-blue" @click="clickPartyNew()">
          <fa-icon :icon="['fas', 'file']" class="text-xl"></fa-icon> Clear Party
        </button>
      </span>
    </div>

    <div class="flex flex-row flex-wrap items-center mb-8" v-if="isUserLogged">
      <span class="mr-2">Party Name</span>

      <input class="input mr-2" type="text" placeholder="Unnamed party" v-model="party_name">

      <div class="flex flex-row mr-2" :class="selected_party_index > 0 ? 'btn-group' : ''">
        <button class="btn btn-blue" @click="clickPartySave(null)">
          <fa-icon :icon="['fas', 'save']" class="text-xl"></fa-icon> Save New
        </button>

        <button v-if="parties.length > 0 && selected_party_index > 0" class="btn btn-blue" @click="clickPartySave(selected_party)">
          Update Party{{ selected_party_index }}
        </button>
      </div>

      <span class="mr-2" v-if="current_party === null">(unsaved)</span>

      <transition name="fade" mode="out-in">
        <span :key="party_message">{{ party_message }}</span>
      </transition>
    </div>

    <input v-show="clipboard_text.length > 0" id="clipboardInput" readonly type="text" :value="clipboard_text">
  </div>
</template>

<script>
import msgpack from '@/js/libs/msgpack.js'
import base64js from '@/js/libs/base64js.js'
import Utils from '@/js/utils.js'
import KeyData from '@/js/key-data'

import Dropdown from '@/components/common/Dropdown.vue';

const DEFAULT_VALUES = {
  classe: {},
  characters: [{}, {}, {}, {}, {}],
  summons: [{}, {}, {}, {}, {}, {}],
  weapons: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {},],
}
// Helper to match categories with proper default values
const getDefaultValues = (data, category) => {
  if (Utils.isEmpty(data[category])) {
    return Utils.copy(DEFAULT_VALUES[category]);
  }
  if (data[category] instanceof Array) {          
    return data[category].map(e => Utils.isEmpty(e) ? {} : e);
  }
  return data[category];
};

export default {
  components: {
    Dropdown,
  },
  data() {
    return {
      parties: [],
      selected_party: -1,       // Select Option value
      selected_party_index: 0, // Select Option index
      current_party: null,
      party_name: "",
      party_message: "",
      clipboard_text: '',
    }
  },
  methods: {
    clickPartyNew({clean_url = true} = {}) {
      this.current_party = null;
      this.party_message = "";
      this.$store.commit('setClasse', Utils.copy(DEFAULT_VALUES['classe']));
      this.$store.commit('setCharacters', Utils.copy(DEFAULT_VALUES['characters']));
      this.$store.commit('setSummons', Utils.copy(DEFAULT_VALUES['summons']));
      this.$store.commit('setWeapons', Utils.copy(DEFAULT_VALUES['weapons']));
      this.$store.commit('clearActions');

      // Clean the URL
      if (clean_url) {
        history.pushState(null, null, window.location.origin + window.location.pathname);
        this.selected_party = -1;
        this.selected_party_index = 0;
      }
    },
    clickPartyLoad() {
      this.$http.get('/party/load/' + this.selected_party)
        .then(response => {
          this.loadPartyFromResponse(response);
          
          this.current_party = parseInt(this.selected_party, 10);
        })
        .catch(error => console.log(error));
    },
    clickPartyShare() {
      const text = '?p=' + this.selected_party;

      this.clipboard_text = window.location.href.split('?')[0] + text;
      history.pushState(null, null, text);

      let self = this;
      Vue.nextTick().then(() => {
        const input = document.getElementById("clipboardInput");
        input.select();
        document.execCommand("copy");
        self.clipboard_text = '';
        self.party_message = 'URL copied to clipboard';
      });
    },
    clickPartyDelete() {
      if (this.parties.length !== 0) {
        this.$http.post('/party/delete', {id: this.selected_party})
          .then(() => {
            this.clickPartyNew();
            this.loadParties();
            this.party_message = 'Party deleted successfully at ' + new Date().toLocaleTimeString();
          })
          .catch(error => console.log(error));
      }
    },
    clickPartySave(partyId) {
      let data = {
        classe: this.getClasse.classid,
        class_skills: Utils.isEmpty(this.getClasse.skills) ? null : this.getClasse.skills.map(s => {return s ? s.skillid : null}), // Skill ids
        characters: this.getCharacters.map(e => { return Utils.isEmpty(e) ? null : e.characterid }),
        characters_stars: this.getCharacters.map(e => { return Utils.isEmpty(e) ? null : e.stars }),
        characters_levels: this.getCharacters.map(e => { return Utils.isEmpty(e) ? null : e.level }),
        characters_pluses: this.getCharacters.map(e => { return Utils.isEmpty(e) ? null : e.pluses }),
        characters_prings: this.getCharacters.map(e => { return Utils.isEmpty(e) ? null : e.haspring }),
        summons: this.getSummons.map(e => { return Utils.isEmpty(e) ? null : e.summonid }),
        summons_levels: this.getSummons.map(e => { return Utils.isEmpty(e) ? null : e.level }),
        summons_pluses: this.getSummons.map(e => { return Utils.isEmpty(e) ? null : e.pluses }),
        summons_stars: this.getSummons.map(e => { return Utils.isEmpty(e) ? null : e.stars }),
        weapons: this.getWeapons.map(e => { return Utils.isEmpty(e) ? null : e.weaponid }),
        weapons_levels: this.getWeapons.map(e => { return Utils.isEmpty(e) ? null : e.level }),
        weapons_pluses: this.getWeapons.map(e => { return Utils.isEmpty(e) ? null : e.pluses }),
        weapons_skill_levels: this.getWeapons.map(e => { return Utils.isEmpty(e) ? null : e.sklevel }),
        weapons_skill_names: this.getWeapons.map(e => { return Utils.isEmpty(e) ? null : e.keys.map(k => k ? k.name : null) }),
        weapons_stars: this.getWeapons.map(e => { return Utils.isEmpty(e) ? null : e.stars }),
        actions: this.$store.getters.getActions.map(e => { return [e.sourceSlot-1, e.skillSlot-1, e.type] })
      }

      this.$http.post('/party/save', {
          id: partyId,
          name: this.party_name,
          data: data
        })
        .then(response => {
          this.current_party = response.data.id;
          this.loadParties(this.current_party);
          this.party_message = 'Party saved successfully at ' + new Date().toLocaleTimeString();
        })
        .catch(error => console.log(error));
    },
    loadParties(select_value = null) {
      this.$http.get('/party/list')
        .then(response => {
          this.parties = response.data;
          if (select_value !== null) {
            let context = this;
            Vue.nextTick().then(() => {
              context.selected_party = select_value;
            });            
          }
        })
        .catch(error => console.log(error));
    },
    loadPartyFromResponse(response) {
      this.loadParty(response.data, {
        actions: response.data.actions,
        characters_stars: response.data.characters_stars,
        characters_levels: response.data.characters_levels,
        characters_pluses: response.data.characters_pluses,
        characters_prings: response.data.characters_prings,
        summons_levels: response.data.summons_levels,
        summons_pluses: response.data.summons_pluses,
        summons_stars: response.data.summons_stars,
        weapons_levels: response.data.weapons_levels,
        weapons_pluses: response.data.weapons_pluses,
        weapons_skill_levels: response.data.weapons_skill_levels,
        weapons_skill_names: response.data.weapons_skill_names,
        weapons_stars: response.data.weapons_stars,
      });
    },
    loadParty(data, {actions = null,
      characters_levels = null, characters_stars = null, characters_pluses = null, characters_prings = null,
      summons_levels = null, summons_stars = null, summons_pluses = null,
      weapons_levels = null, weapons_stars = null, weapons_pluses = null, weapons_skill_levels = null, weapons_skill_names = null} = {}) 
    {
      // Clear current party
      this.clickPartyNew({clean_url: false});

      this.$store.commit('setClasse', getDefaultValues(data, 'classe'));
      
      if ( ! Utils.isEmpty(data['class_skills']) && ! Utils.isEmpty(this.getClasse)) {
        data['class_skills'].forEach((e, slot) => {
          this.$store.commit('setClasseSkill', {slot: slot, data: e});
        });
      }
      this.$store.commit('setCharacters', getDefaultValues(data, 'characters'));
      this.$store.commit('setSummons', getDefaultValues(data, 'summons'));
      this.$store.commit('setWeapons', getDefaultValues(data, 'weapons'));

      // Set stars
      if (characters_stars) {
        for (let i=0; i<this.getCharacters.length && i<characters_stars.length; i++) {
          if (characters_stars[i] !== null) {
            Vue.set(this.getCharacters[i], 'stars', characters_stars[i]);
          }
        }
      }
      else if (characters_levels) {
        for (let i=0; i<this.getCharacters.length && i<characters_levels.length; i++) {
          if (characters_levels[i] === null) {
            continue;
          }
          let lvl = parseInt(characters_levels[i], 10);
          if (lvl > 80) {
            Vue.set(this.getCharacters[i], 'stars', 5);
          }
          else if (lvl > 60) {
            Vue.set(this.getCharacters[i], 'stars', 4);
          }
          else if (lvl > 40) {
            Vue.set(this.getCharacters[i], 'stars', 3);
          }
          else if (lvl > 20) {
            Vue.set(this.getCharacters[i], 'stars', 2);
          }
          else if (lvl > 1) {
            Vue.set(this.getCharacters[i], 'stars', 1);
          }
          else {
            Vue.set(this.getCharacters[i], 'stars', 0);
          }
        }
      }
      if (characters_levels) {
        for (let i=0; i<this.getCharacters.length && i<characters_levels.length; i++) {
          if (characters_levels[i] !== null) {
            Vue.set(this.getCharacters[i], 'level', characters_levels[i]);
          }
        }
      }
      if (characters_pluses) {
        for (let i=0; i<this.getCharacters.length && i<characters_pluses.length; i++) {
          if (characters_pluses[i] !== null) {
            Vue.set(this.getCharacters[i], 'pluses', characters_pluses[i]);
          }
        }
      }
      if (characters_prings) {
        for (let i=0; i<this.getCharacters.length && i<characters_prings.length; i++) {
          if (characters_prings[i] !== null) {
            Vue.set(this.getCharacters[i], 'haspring', characters_prings[i]);
          }
        }
      }

      if (summons_stars) {
        for (let i=0; i<this.getSummons.length && i<summons_stars.length; i++) {
          if (summons_stars[i] !== null) {
            Vue.set(this.getSummons[i], 'stars', summons_stars[i]);
          }
        }
      }
      if (summons_levels) {
        for (let i=0; i<this.getSummons.length && i<summons_levels.length; i++) {
          if (summons_levels[i] !== null) {
            Vue.set(this.getSummons[i], 'level', summons_levels[i]);
          }
        }
      }
      if (summons_pluses) {
        for (let i=0; i<this.getSummons.length && i<summons_pluses.length; i++) {
          if (summons_pluses[i] !== null) {
            Vue.set(this.getSummons[i], 'pluses', summons_pluses[i]);
          }
        }
      }

      if (weapons_stars) {
        for (let i=0; i<this.getWeapons.length && i<weapons_stars.length; i++) {
          if (weapons_stars[i] !== null) {
            Vue.set(this.getWeapons[i], 'stars', weapons_stars[i]);
          }
        }
      }
      else if (weapons_skill_levels) {
        for (let i=0; i<this.getWeapons.length && i<weapons_skill_levels.length; i++) {
          let sl = parseInt(weapons_skill_levels[i], 10);
          if (sl > 15) {
            Vue.set(this.getWeapons[i], 'stars', 5);
          }
          else if (sl > 10) {
            Vue.set(this.getWeapons[i], 'stars', 4);
          }
          else if (sl > 1) {
            Vue.set(this.getWeapons[i], 'stars', 3);
          }
          // SL1 means Special Skill with no SL
        }
      }
      if (weapons_skill_levels) {
        for (let i=0; i<this.getWeapons.length && i<weapons_skill_levels.length; i++) {
          if (weapons_skill_levels[i] !== null) {
            Vue.set(this.getWeapons[i], 'sklevel', weapons_skill_levels[i]);
          }
        }
      }
      if (weapons_levels) {
        for (let i=0; i<this.getWeapons.length && i<weapons_levels.length; i++) {
          if (weapons_levels[i] !== null) {
            Vue.set(this.getWeapons[i], 'level', weapons_levels[i]);
          }
        }
      }
      if (weapons_pluses) {
        for (let i=0; i<this.getWeapons.length && i<weapons_pluses.length; i++) {
          if (weapons_pluses[i] !== null) {
            Vue.set(this.getWeapons[i], 'pluses', weapons_pluses[i]);
          }
        }
      }
      if (weapons_skill_names) {
        for (let i=0; i<this.getWeapons.length && i<weapons_skill_names.length; i++) {
          if (weapons_skill_names[i] !== null) {
            Vue.set(this.getWeapons[i], 'keys', [null, null, null]);

            for (let j=0; j<weapons_skill_names[i].length; j++) {
              if (weapons_skill_names[i][j]) {
                Vue.set(this.getWeapons[i].keys, j, KeyData.getSkillByName(weapons_skill_names[i][j].trim()));
              }
            }
          }
        }
      }

      if ( ! Utils.isEmpty(actions)) {
        this.$store.dispatch('addActions', actions);
      }
    },
  },
  computed: {
    isUserLogged() {
      return this.$store.getters.getUserId !== null;
    },
    getClasse() {
      return this.$store.getters.getClasse;
    },
    getCharacters() {
      return this.$store.getters.getCharacters;
    },
    getSummons() {
      return this.$store.getters.getSummons;
    },
    getWeapons() {
      return this.$store.getters.getWeapons;
    },
  },
  watch: {
    '$store.getters.getUserId'() {
      this.loadParties();
    },
    selected_party() {
      // Firefox triggers this too early
      let context = this;
      Vue.nextTick().then(() => {
        if (context.selected_party_index > 0) {
          context.party_name = context.parties[context.selected_party_index - 1].name;
        }
        else {
          context.party_name = "";
        }
      });
    },
  },
  mounted() {
    /**
     * Load parties list
     */
    if (this.isUserLogged) {
      this.loadParties();
    }

    /**
     * Load party from URL
     */
    const urlParams = new URLSearchParams(window.location.search);

    // permaURL
    if (urlParams.has('t')) {
      const param = urlParams.get('t');
      const data = msgpack.deserialize(base64js.toByteArray(Utils.unescapeBase64(param)));
      const postData = {
        classe: Utils.isEmpty(data[0]) ? null : data[0][0],
        skills: Utils.isEmpty(data[0]) ? null : data[0].slice(1), // Skill IDs
        characters: data[1],
        summons: data[2],
        weapons: data[3],
      }

      this.$http.post('/party/load', postData)
        .then(response => this.loadParty(response.data, {actions: data[4]}))
        .catch(error => console.log(error));
    }
    // Bookmarklet
    else if (urlParams.has('l')) {
      const param = urlParams.get('l');
      const data = JSON.parse(param);
      const postData = {
        classe: data.p,
        class_skills: data.ps, // Skill names
        characters: data.c,
        summons: data.s,
        weapons: data.w,
      }

      if ( ! data.v || data.v < 4) {
        this.$emit('update-bookmarklet');
      }

      this.$http.post('/party/load', postData)
        .then(response => this.loadParty(response.data, {
          characters_levels: data.cl,
          characters_stars: data.cs,
          characters_pluses: data.cp,
          characters_prings: data.cwr,
          summons_levels: data.sl,
          summons_stars: data.ss,
          summons_pluses: data.sp,
          weapons_levels: data.wll,
          weapons_skill_levels: data.wl,
          weapons_skill_names: data.wsn,
          weapons_pluses: data.wp
        }))
        .catch(error => console.log(error));
    }
    // Party ID
    else if (urlParams.has('p')) {
      const param = parseInt(urlParams.get('p'), 10);

      this.$http.get('/party/load/' + param)
        .then(response => {
          this.loadPartyFromResponse(response);
          // Preselect party if it belongs to current user
          this.parties.forEach(p => {
            if (p.id === param) {
              this.current_party = p.id;
              this.selected_party = p.id;
            }
          })
        })
        .catch(error => {console.log(error);  this.party_message = 'Party not found'});
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .25s
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}
</style>