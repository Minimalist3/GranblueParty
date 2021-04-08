<template>
  <div class="flex flex-col">
    <div class="flex flex-row flex-wrap items-center mb-4" v-if="isUserLogged">
      <span class="mr-2">My parties</span>

      <dropdown class="mr-2" :disabled="parties.length === 0" v-model.number="selected_party" :index="selected_party_index">
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
    </div>

    <input v-show="clipboard_text.length > 0" id="clipboardInput" readonly type="text" :value="clipboard_text">
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import msgpack from '@/js/libs/msgpack.js'
import base64js from '@/js/libs/base64js.js'
import Utils from '@/js/utils.js'
import KeyData from '@/js/key-data'
import partiesModule from '@/store/modules/parties'

import Dropdown from '@/components/common/Dropdown.vue';

const DEFAULT_VALUES = {
  classe: {},
  characters: [{}, {}, {}, {}, {}],
  summons: [{}, {}, {}, {}, {}, {}],
  weapons: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
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
      clipboard_text: '',
    }
  },
  methods: {
    clickPartyNew({clean_url = true} = {}) {
      this.current_party = null;
      this.$store.commit('setClasse', Utils.copy(DEFAULT_VALUES['classe']));
      this.$store.dispatch('setCharacters', Utils.copy(DEFAULT_VALUES['characters']));
      this.$store.dispatch('setSummons', Utils.copy(DEFAULT_VALUES['summons']));
      this.$store.dispatch('setWeapons', Utils.copy(DEFAULT_VALUES['weapons']));
      this.$store.commit('clearActions');

      // Clean the URL
      if (clean_url) {
        history.pushState(null, null, window.location.origin + window.location.pathname);
        this.selected_party = -1;
      }
    },
    clickPartyLoad() {
      this.axios.get('/party/load/' + this.selected_party)
        .then(response => {
          this.loadPartyFromResponse(response);
          
          this.current_party = parseInt(this.selected_party, 10);
        })
        .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
    },
    clickPartyShare() {
      const text = '?p=' + this.selected_party;

      this.clipboard_text = window.location.href.split('?')[0] + text;
      history.pushState(null, null, text);

      let self = this;
      this.$nextTick().then(() => {
        const input = document.getElementById("clipboardInput");
        input.select();
        document.execCommand("copy");
        self.clipboard_text = '';

        self.$store.dispatch('addMessage', {message: 'URL copied to clipboard'});
      });
    },
    clickPartyDelete() {
      if (this.parties.length !== 0) {
        this.axios.post('/party/delete', {id: this.selected_party})
          .then(() => {
            this.clickPartyNew();
            this.loadParties();

            this.$store.dispatch('addMessage', {message: 'Party deleted successfully'});
          })
          .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
      }
    },
    clickPartySave(partyId) {
      let data = {
        classe: this.classe.classid,
        class_skills: Utils.isEmpty(this.classe.skills) ? null : this.classe.skills.map(s => {return s ? s.skillid : null}), // Skill ids
        characters: this.characters.map(e => { return Utils.isEmpty(e) ? null : e.characterid }),
        characters_stars: this.characters.map(e => { return Utils.isEmpty(e) ? null : e.stars }),
        characters_levels: this.characters.map(e => { return Utils.isEmpty(e) ? null : e.level }),
        characters_pluses: this.characters.map(e => { return Utils.isEmpty(e) ? null : e.pluses }),
        characters_prings: this.characters.map(e => { return Utils.isEmpty(e) ? null : e.haspring }),
        summons: this.summons.map(e => { return Utils.isEmpty(e) ? null : e.summonid }),
        summons_levels: this.summons.map(e => { return Utils.isEmpty(e) ? null : e.level }),
        summons_pluses: this.summons.map(e => { return Utils.isEmpty(e) ? null : e.pluses }),
        summons_stars: this.summons.map(e => { return Utils.isEmpty(e) ? null : e.stars }),
        weapons: this.weapons.map(e => { return Utils.isEmpty(e) ? null : e.weaponid }),
        weapons_levels: this.weapons.map(e => { return Utils.isEmpty(e) ? null : e.level }),
        weapons_pluses: this.weapons.map(e => { return Utils.isEmpty(e) ? null : e.pluses }),
        weapons_skill_levels: this.weapons.map(e => { return Utils.isEmpty(e) ? null : e.sklevel }),
        weapons_skill_names: this.weapons.map(e => { return Utils.isEmpty(e) ? null : e.keys.map(k => k ? k.name : null) }),
        weapons_stars: this.weapons.map(e => { return Utils.isEmpty(e) ? null : e.stars }),
        actions: this.actions.map(e => { return [e.sourceSlot-1, e.skillSlot-1, e.type] })
      }

      this.axios.post('/party/save', {
          id: partyId,
          name: this.party_name,
          data: data
        })
        .then(response => {
          this.current_party = response.data.id;
          return this.loadParties();
        })
        .then(_ => this.$store.dispatch('addMessage', {message: 'Party saved successfully'}))
        .then(_ => this.selected_party = this.current_party)
        .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
    },
    loadParties() {
      return this.$store.dispatch('parties/fetchParties');
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
      
      if ( ! Utils.isEmpty(data['class_skills']) && ! Utils.isEmpty(this.classe)) {
        data['class_skills'].forEach((e, slot) => {
          this.$store.commit('setClasseSkill', {slot: slot, data: e});
        });
      }
      this.$store.dispatch('setCharacters', getDefaultValues(data, 'characters'));
      this.$store.dispatch('setSummons', getDefaultValues(data, 'summons'));
      this.$store.dispatch('setWeapons', getDefaultValues(data, 'weapons'));

      // Set stars
      if (characters_stars) {
        for (let i=0; i<this.characters.length && i<characters_stars.length; i++) {
          if (characters_stars[i] !== null) {
            this.$set(this.characters[i], 'stars', characters_stars[i]);
          }
        }
      }
      else if (characters_levels) {
        for (let i=0; i<this.characters.length && i<characters_levels.length; i++) {
          if (characters_levels[i] === null) {
            continue;
          }
          let lvl = parseInt(characters_levels[i], 10);
          if (lvl > 80) {
            this.$set(this.characters[i], 'stars', 5);
          }
          else if (lvl > 60) {
            this.$set(this.characters[i], 'stars', 4);
          }
          else if (lvl > 40) {
            this.$set(this.characters[i], 'stars', 3);
          }
          else if (lvl > 20) {
            this.$set(this.characters[i], 'stars', 2);
          }
          else if (lvl > 1) {
            this.$set(this.characters[i], 'stars', 1);
          }
          else {
            this.$set(this.characters[i], 'stars', 0);
          }
        }
      }
      if (characters_levels) {
        for (let i=0; i<this.characters.length && i<characters_levels.length; i++) {
          if (characters_levels[i] !== null) {
            this.$set(this.characters[i], 'level', characters_levels[i]);
          }
        }
      }
      if (characters_pluses) {
        for (let i=0; i<this.characters.length && i<characters_pluses.length; i++) {
          if (characters_pluses[i] !== null) {
            this.$set(this.characters[i], 'pluses', characters_pluses[i]);
          }
        }
      }
      if (characters_prings) {
        for (let i=0; i<this.characters.length && i<characters_prings.length; i++) {
          if (characters_prings[i] !== null) {
            this.$set(this.characters[i], 'haspring', characters_prings[i]);
          }
        }
      }

      if (summons_stars) {
        for (let i=0; i<this.summons.length && i<summons_stars.length; i++) {
          if (summons_stars[i] !== null) {
            this.$set(this.summons[i], 'stars', summons_stars[i]);
          }
        }
      }
      if (summons_levels) {
        for (let i=0; i<this.summons.length && i<summons_levels.length; i++) {
          if (summons_levels[i] !== null) {
            this.$set(this.summons[i], 'level', summons_levels[i]);
          }
        }
      }
      if (summons_pluses) {
        for (let i=0; i<this.summons.length && i<summons_pluses.length; i++) {
          if (summons_pluses[i] !== null) {
            this.$set(this.summons[i], 'pluses', summons_pluses[i]);
          }
        }
      }

      if (weapons_stars) {
        for (let i=0; i<this.weapons.length && i<weapons_stars.length; i++) {
          if (weapons_stars[i] !== null) {
            this.$set(this.weapons[i], 'stars', weapons_stars[i]);
          }
        }
      }
      else if (weapons_skill_levels) {
        for (let i=0; i<this.weapons.length && i<weapons_skill_levels.length; i++) {
          let sl = parseInt(weapons_skill_levels[i], 10);
          if (sl > 15) {
            this.$set(this.weapons[i], 'stars', 5);
          }
          else if (sl > 10) {
            this.$set(this.weapons[i], 'stars', 4);
          }
          else if (sl > 1) {
            this.$set(this.weapons[i], 'stars', 3);
          }
          // SL1 means Special Skill with no SL
        }
      }
      if (weapons_skill_levels) {
        for (let i=0; i<this.weapons.length && i<weapons_skill_levels.length; i++) {
          if (weapons_skill_levels[i] !== null) {
            this.$set(this.weapons[i], 'sklevel', weapons_skill_levels[i]);
          }
        }
      }
      if (weapons_levels) {
        for (let i=0; i<this.weapons.length && i<weapons_levels.length; i++) {
          if (weapons_levels[i] !== null) {
            this.$set(this.weapons[i], 'level', weapons_levels[i]);
          }
        }
      }
      if (weapons_pluses) {
        for (let i=0; i<this.weapons.length && i<weapons_pluses.length; i++) {
          if (weapons_pluses[i] !== null) {
            this.$set(this.weapons[i], 'pluses', weapons_pluses[i]);
          }
        }
      }
      if (weapons_skill_names) {
        for (let i=0; i<this.weapons.length && i<weapons_skill_names.length; i++) {
          if (weapons_skill_names[i] !== null) {
            this.$set(this.weapons[i], 'keys', [null, null, null]);

            for (let j=0; j<weapons_skill_names[i].length; j++) {
              if (weapons_skill_names[i][j]) {
                this.$set(this.weapons[i].keys, j, KeyData.getSkillByName(weapons_skill_names[i][j].trim()));
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
    ...mapState({
      classe: state => state.party_builder.classe,
      characters: state => state.party_builder.characters,
      summons: state => state.party_builder.summons,
      weapons: state => state.party_builder.weapons,
      actions: state => state.party_builder.actions,
    }),
    ...mapGetters('parties', {
      selected_party_index: 'getSelectedPartyIndex'
    }),
    isUserLogged() {
      return this.$store.getters.getUserId !== null;
    },
    parties: {
      get() { return this.$store.state.parties.parties },
      set(value) { this.$store.commit('parties/setParties', value) }
    },
    selected_party: {
      get() { return this.$store.state.parties.selected_party },
      set(value) { this.$store.dispatch('parties/setSelectedParty', value) }
    },
    current_party: {
      get() { return this.$store.state.parties.current_party },
      set(value) { this.$store.commit('parties/setCurrentParty', value) }
    },
    party_name: {
      get() { return this.$store.state.parties.party_name },
      set(value) { this.$store.commit('parties/setPartyName', value) }
    }
  },
  watch: {
    '$store.getters.getUserId'(id) {
      if (id !== null) {
        this.$store.commit('parties/clearParties');
        this.loadParties();
      }
    },
  },
  serverPrefetch() {
    let promises = [];

    /**
     * Load parties list
     */
    if (this.isUserLogged) {
      promises.push(this.loadParties());
    }

    /**
     * Load party from URL
     */

    // permaURL
    if ( ! Utils.isEmpty(this.$route.query.t)) {
      const data = msgpack.deserialize(base64js.toByteArray(Utils.unescapeBase64(this.$route.query.t)));
      const postData = {
        classe: Utils.isEmpty(data[0]) ? null : data[0][0],
        skills: Utils.isEmpty(data[0]) ? null : data[0].slice(1), // Skill IDs
        characters: data[1],
        summons: data[2],
        weapons: data[3],
      }

      promises.push(
        this.axios.post('/party/load', postData)
          .then(response => this.loadParty(response.data, {actions: data[4]}))
          .catch(error => this.$store.dispatch('addAxiosErrorMessage', error))
      );
    }
    // Bookmarklet
    else if ( ! Utils.isEmpty(this.$route.query.l)) {
      const data = JSON.parse(this.$route.query.l);
      const postData = {
        classe: data.p,
        class_skills: data.ps, // Skill names
        characters: data.c,
        summons: data.s,
        weapons: data.w,
      }

      if ( ! data.v || data.v < 5) {
        this.$emit('update-bookmarklet');
      }

      promises.push(
        this.axios.post('/party/load', postData)
          .then(response => this.loadParty(response.data,
          {
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
          .catch(error => this.$store.dispatch('addAxiosErrorMessage', error))
      );
    }
    // Party ID
    else if ( ! Utils.isEmpty(this.$route.query.p)) {
      const param = parseInt(this.$route.query.p, 10);

      promises.push(
        this.axios.get('/party/load/' + param)
          .then(response => {
            this.loadPartyFromResponse(response);
            // Preselect party if it belongs to current user
            this.parties.forEach(p => {
              if (p.id === param) {
                this.current_party = p.id;
                this.selected_party = p.id;
              }
            })
            const timestamp = response.data.updated ? response.data.updated : '0';
            this.$ssrContext.head_image = 'https://www.granblue.party/previews/' + 'party/party_' + param + '.' + timestamp + '.png';
          })
          .catch(_ => this.$store.dispatch('addMessage', { title: 'Error', message: 'Party not found'}))
      );
    }

    return Promise.all(promises);
  },
  mounted() {
    /**
     * Load parties list
     */
    if (this.isUserLogged && this.$store.state.parties.parties.length === 0) {
      this.loadParties();
    }
  },
  beforeCreate() {
    const preserve_state = !! this.$store.state.parties
    this.$store.registerModule('parties', partiesModule, { preserveState: preserve_state });
  },
  destroyed() {
    this.$store.unregisterModule('parties');
  },
}
</script>