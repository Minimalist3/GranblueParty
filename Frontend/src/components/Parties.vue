<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-row flex-wrap items-center gap-2" v-if="isUserLogged">
      <button class="btn btn-red" @click="new_party_modal = true">
        <fa-icon :icon="['fas', 'file']" class="text-xl"></fa-icon> New Party
      </button>
      <button class="btn btn-blue" @click="show_parties_modal = true">
        <fa-icon :icon="['fas', 'folder-open']" class="text-xl"></fa-icon> Load&#8230;
      </button>
      <button class="btn btn-blue" @click="clickPartySave(current_party)" :disabled="disableButtons">
        <fa-icon :icon="['fas', 'save']" class="text-xl"></fa-icon> Save
      </button>
      <button class="btn btn-blue" @click="save_as_modal = true">
        <fa-icon :icon="['fas', 'file-pen']" class="text-xl"></fa-icon> Save As&#8230;
      </button>
      <button class="btn btn-red" @click="delete_party_modal = true" :disabled="disableButtons">
        <fa-icon :icon="['fas', 'trash']" class="text-xl"></fa-icon> Delete
      </button>
      <button class="btn btn-blue" @click="add_video_modal = true" disabled="true" title="Coming soon">
        <fa-icon :icon="['fab', 'youtube']" class="text-xl"></fa-icon> Add Video
      </button>
      <!-- TODO Twitter, Facebook -->
      <button class="btn btn-blue" @click="clickPartyShare()" :disabled="disableButtons">
        <fa-icon :icon="['fas', 'share-alt']" class="text-xl"></fa-icon> Share
      </button>
      <span v-if="current_party === null">(unsaved)</span>
    </div>

    <div class="flex flex-row flex-wrap items-center gap-2">
      <input class="input w-52" type="text" placeholder="Party name" v-model="party_name" maxlength="64">
      <label>
        Category
        <content-categories v-model.number="content"></content-categories>
      </label>
      <checkbox
        v-model="isPublic"
        :disabled="content === null"
        :title="content === null ? 'Uncategorized parties cannot be made public' : 'Make this team visible in the Teams section'"
      >
        Public Team
      </checkbox>
      <fa-icon v-if="video_url" :icon="['fab', 'youtube']" class="text-4xl"></fa-icon>
    </div>

    <!-- Modals -->
    <modal-selector
      v-model="show_parties_modal"
      route="/party/list"
      :categories="getCategories"
      :canUnselect="false"
      @item-selected="loadPartyFromModal"
      :key="reload_route"
    ></modal-selector>
    <modal-confirm 
      v-model="new_party_modal"
      :confirm="clickPartyNew"
      text="This will clear the current party and start a new one."
      button="New Party"
    ></modal-confirm>
    <modal-confirm
      v-model="save_as_modal"
      :confirm="clickPartySave"
      :text="'This will create a new ' + (this.isPublic ? 'public' : 'private') + ' Party' + (this.party_name ? ' called \'' + this.party_name + '\'.' : ' with no name.')"
      button="Save new Party"
    ></modal-confirm>
    <modal-confirm 
      v-model="delete_party_modal"
      :confirm="clickPartyDelete"
      text="This will permanently delete this party from your account."
      button="Delete Party"
    ></modal-confirm>

    <input v-show="clipboard_text.length > 0" id="clipboardInput" readonly type="text" :value="clipboard_text">
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Utils from '@/js/utils.js'
import KeyData from '@/js/key-data'
import partiesStoreMixin from '@/store/modules/parties'

import Checkbox from '@/components/common/Checkbox.vue'
import ContentCategories from '@/components/common/ContentCategories.vue'
import Dropdown from '@/components/common/Dropdown.vue'
import ModalConfirm from '@/components/ModalConfirm.vue'
import ModalSelector from '@/components/ModalSelector.vue'

const BOOKMARKLET_VERSION = 6;

// Duplicated in store/modules/party-builder.js
const DEFAULT_VALUES = {
  classe: {},
  characters: [{}, {}, {}, {}, {}],
  summons: [{}, {}, {}, {}, {}, {}, {}, {}],
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
    Checkbox,
    ContentCategories,
    Dropdown,
    ModalConfirm,
    ModalSelector
  },
  mixins: [
    partiesStoreMixin
  ],
  data() {
    return {
      clipboard_text: '',
      new_party_modal: false,
      save_as_modal: false,
      delete_party_modal: false,
      show_parties_modal: false,
      add_video_modal: false,
      reload_route: 0,
    }
  },
  methods: {
    clickPartyNew({clean_url = true} = {}) {
      this.current_party = null;
      this.party_name = "";
      this.$store.commit('resetParty');

      // Clean the URL
      if (clean_url) {
        history.pushState(null, null, window.location.origin + window.location.pathname);
      }
    },
    loadPartyFromModal(party) {
      this.axios.get('/party/load/' + party)
        .then(response => {
          this.loadPartyFromResponse(response);
          this.current_party = parseInt(party, 10);
        })
        .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
    },
    clickPartyShare() {
      const text = '?p=' + this.current_party + '#';

      this.clipboard_text = window.location.href.split('?')[0] + text;
      // history.pushState(null, null, text);

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
      if (this.current_party) {
        this.axios.post('/party/delete', {id: this.current_party})
          .then(() => {
            this.clickPartyNew();
            this.reloadParties();
            this.$store.dispatch('addMessage', {message: 'Party deleted successfully'});
          })
          .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
      }
    },
    clickPartySave(partyId = null) {
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
        actions: this.actions.map(e => { return [e.sourceSlot-1, e.skillSlot-1, e.type] }),
      }

      this.axios.post('/party/save', {
          id: partyId,
          name: this.party_name,
          data: data,
          content: this.content,
          isPublic: this.isPublic,
          desc: this.description,
        })
        .then(response => {
          this.current_party = response.data.id;
          this.reloadParties();
          this.$store.dispatch('addMessage', {message: 'Party saved successfully'});
        })
        .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
    },
    reloadParties() {
      this.reload_route++;
    },
    loadPartyFromResponse(response) {
      this.loadParty(response.data, {
        actions: response.data.actions,
        content: response.data.content,
        characters_stars: response.data.characters_stars,
        characters_levels: response.data.characters_levels,
        characters_pluses: response.data.characters_pluses,
        characters_prings: response.data.characters_prings,
        description: response.data.desc,
        isPublic: response.data.isPublic,
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
    loadParty(data, {actions = null, content = null, isPublic = true, description = '',
      characters_levels = null, characters_stars = null, characters_pluses = null, characters_prings = null,
      summons_levels = null, summons_stars = null, summons_pluses = null,
      weapons_levels = null, weapons_stars = null, weapons_pluses = null, weapons_skill_levels = null, weapons_skill_names = null} = {}) 
    {
      // Clear current party
      this.clickPartyNew({clean_url: false});

      this.party_name = data.n ? data.n : "";

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
          if (weapons_skill_names[i]) {
            this.$set(this.weapons[i], 'keys', [null, null, null]);

            for (let j=0; j<weapons_skill_names[i].length; j++) {
              // Only add keys for weapon skills that support them
              if (weapons_skill_names[i][j] && this.weapons[i].skills[j] && this.weapons[i].skills[j][0] && this.weapons[i].skills[j][0].keyid) {
                this.$set(this.weapons[i].keys, j, KeyData.getSkillByName(weapons_skill_names[i][j].trim()));
              }
            }
          }
        }
      }

      if ( ! Utils.isEmpty(actions)) {
        this.$store.dispatch('addActions', actions);
      }

      this.content = content;
      this.isPublic = isPublic;
      this.$store.commit('setDescription', description);
    },
  },
  computed: {
    ...mapState({
      classe: state => state.party_builder.classe,
      characters: state => state.party_builder.characters,
      summons: state => state.party_builder.summons,
      weapons: state => state.party_builder.weapons,
      actions: state => state.party_builder.actions,
      description: state => state.party_builder.description,
    }),
    isUserLogged() {
      return this.$store.getters.getUserId !== null;
    },
    content: {
      get() { return this.$store.state.party_builder.content },
      set(value) { this.$store.commit('setContent', value) }
    },
    isPublic: {
      get() { return this.$store.state.party_builder.isPublic },
      set(value) { this.$store.commit('setPublic', value) }
    },
    party_name: {
      get() { return this.$store.state.parties.party_name },
      set(value) { this.$store.commit('parties/setPartyName', value) }
    },
    current_party: {
      get() { return this.$store.state.parties.current_party },
      set(value) { this.$store.commit('parties/setCurrentParty', value) }
    },
    video_url: {
      get() { return this.$store.state.parties.video_url },
      set(value) { this.$store.commit('parties/setVideoURL', value) }
    },
    disableButtons() {
      return this.current_party === null;
    },
    getCategories() {
      return [
        {
          name: "Name",
          isColumn: true,
          isFilter: false,
          key: "n",
        },
        {
          name: "Element",
          isColumn: true,
          isFilter: true,
          key: "e",
        },
        {
          name: "Public",
          isColumn: true,
          isFilter: true,
          key: "pub",
        },
      ];
    }
  },
  watch: {
    '$store.getters.getUserId'(id) {
      if (id !== null) {
        this.reloadParties();
      }
    },
  },
  serverPrefetch() {
    let promises = [];

    /**
     * Load party from URL
     */

    // Bookmarklet
    if ( ! Utils.isEmpty(this.$route.query.l)) {
      const data = JSON.parse(this.$route.query.l);
      const postData = {
        classe: data.p,
        class_skills: data.ps, // Skill names
        characters: data.c,
        summons: data.s,
        weapons: data.w,
      }

      if ( ! data.v || data.v < BOOKMARKLET_VERSION) {
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
            if (response.data.userid === this.$store.getters.getUserId) {
              this.current_party = param;
            }
            const timestamp = response.data.updated ? response.data.updated : '0';
            this.$ssrContext.head_image = 'https://www.granblue.party/previews/party/party_' + param + '.' + timestamp + '.jpg';
          })
          .catch(_ => this.$store.dispatch('addMessage', { title: 'Error', message: 'Party not found'}))
      );
    }

    return Promise.all(promises);
  },
}
</script>