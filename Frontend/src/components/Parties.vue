<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-row flex-wrap items-center gap-2" v-if="isUserLogged">
      <button class="btn btn-red" @click="new_party_modal = true">
        <fa-icon :icon="['fas', 'file']" class="text-xl"></fa-icon> New Party
      </button>
      <button class="btn btn-blue" @click="show_parties_modal = true">
        <fa-icon :icon="['fas', 'folder-open']" class="text-xl"></fa-icon> Load&#8230;
      </button>
      <button class="btn btn-blue" @click="clickPartySave(current_party)" :disabled=" ! isMyParty">
        <fa-icon :icon="['fas', 'save']" class="text-xl"></fa-icon> Save
      </button>
      <button class="btn btn-blue" @click="save_as_modal = true">
        <fa-icon :icon="['fas', 'file-pen']" class="text-xl"></fa-icon> Save As&#8230;
      </button>
      <button class="btn btn-red" @click="delete_party_modal = true" :disabled=" ! isMyParty">
        <fa-icon :icon="['fas', 'trash']" class="text-xl"></fa-icon> Delete
      </button>
      <button class="btn btn-blue" @click="add_video_modal = true" :disabled=" ! isMyParty">
        <fa-icon :icon="['fab', 'youtube']" class="text-xl"></fa-icon> Add Video
      </button>
      <!-- TODO Twitter, Facebook -->
      <button class="btn btn-blue" @click="clickPartyShare()" :disabled=" ! isMyParty">
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
        v-if="isUserLogged"
        v-model="isPublic"
        :disabled="cannotBePublic"
        :title="cannotBePublic ? 'Parties uncategorized or without a main weapon cannot be made public' : 'Make this team visible in the Teams section'"
      >
        Public Team
      </checkbox>
      <a :href="'https://www.youtube.com/watch?v=' + video_id" target="_blank" v-if="video_id" title="Open YouTube video">
        <fa-icon :icon="['fab', 'youtube']" class="text-4xl"></fa-icon>
      </a>
      <like-button :teamId="this.current_party"></like-button>
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
    <modal-youtube
      v-model="add_video_modal"
      :url="video_id"
      @add="addVideo"
    ></modal-youtube>

    <input v-show="clipboard_text.length > 0" id="clipboardInput" readonly type="text" :value="clipboard_text">
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Utils from '@/js/utils.js'

import Checkbox from '@/components/common/Checkbox.vue'
import ContentCategories from '@/components/common/ContentCategories.vue'
import Dropdown from '@/components/common/Dropdown.vue'
import LikeButton from '@/components/common/LikeButton.vue'
import ModalConfirm from '@/components/ModalConfirm.vue'
import ModalSelector from '@/components/ModalSelector.vue'
import ModalYoutube from '@/components/ModalYoutube.vue'

const BOOKMARKLET_VERSION = 6;

export default {
  components: {
    Checkbox,
    ContentCategories,
    Dropdown,
    LikeButton,
    ModalConfirm,
    ModalSelector,
    ModalYoutube,
  },
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
    clickPartyNew() {
      this.$store.commit('resetParty');
      this.cleanURL();
    },
    cleanURL() {
      if (VUE_ENV !== 'server') {
        history.pushState(null, null, window.location.origin + window.location.pathname);
      }
    },
    loadPartyFromModal(party) {
      this.axios.get('/party/load/' + party)
        .then(response => this.loadParty(Utils.getPartyResponse(response)))
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
    addVideo(id) {
      this.video_id = (id && id.length > 0) ? id : null;
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
          video: this.video_id,
        })
        .then(response => {
          this.current_party = response.data.id;
          this.team_owner = this.$store.getters.getUserId;
          this.reloadParties();
          this.$store.dispatch('addMessage', {message: 'Party saved successfully'});
        })
        .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
    },
    reloadParties() {
      this.reload_route++;
    },
    loadParty(data) {
      // Clean URL when party id changes
      if ( ! Utils.isEmpty(this.$route.query.p)) {
        const param = parseInt(this.$route.query.p, 10);
        if (data.id !== param) {
          this.cleanURL();
        }
      }

      this.$store.dispatch('loadParty', data);
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
    team_owner: {
      get() { return this.$store.state.party_builder.team_owner },
      set(value) { this.$store.commit('setTeamOwner', value) }
    },
    party_name: {
      get() { return this.$store.state.party_builder.party_name },
      set(value) { this.$store.commit('setPartyName', value) }
    },
    current_party: {
      get() { return this.$store.state.party_builder.current_party },
      set(value) { this.$store.commit('setCurrentParty', value) }
    },
    video_id: {
      get() { return this.$store.state.party_builder.video_id },
      set(value) { this.$store.commit('setVideoId', value) }
    },
    isMyParty() {
      return this.team_owner === this.$store.getters.getUserId;
    },
    cannotBePublic() {
      return this.content === null || Utils.isEmpty(this.weapons[0]);
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
          .then(response => this.loadParty({
            data: response.data,
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
            this.loadParty(Utils.getPartyResponse(response));
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