<template>
  <div class="flex flex-col">

    <div v-if="loading === true">
      Loading...
    </div>
    <div v-else-if="! found && ! isOwnProfile" class="flex flex-col items-center">
      <h1 class="self-center mb-8">No Friend Summons found</h1>
    </div>
    <div v-else class="flex flex-col items-center">
      <h1 v-if="isOwnProfile" class="self-center mb-8">My Friend Summons</h1>
      <h1 v-else class="self-center mb-8">Friend Summons for Player ID: {{ id }}</h1>

      <!-- Toolbar -->
      <div v-if="isOwnProfile" class="flex flex-row flex-wrap gap-2">
        <button class="btn" :class="show_help ? 'btn-blue' : 'btn-white'" @click="show_help = ! show_help">
          <fa-icon :icon="['fas', 'info-circle']" class="text-xl"></fa-icon> Usage
        </button>

        <button v-if="userId" class="btn btn-blue" @click="clickCopyURL">
          <fa-icon :icon="['fas', 'share-alt']" class="text-xl"></fa-icon> Share
        </button>

        <button v-if="userId" class="btn btn-blue" @click="clickSave()">
          <fa-icon :icon="['fas', 'save']" class="text-xl"></fa-icon> Save
        </button>

        <label>My ID <input class="input is-small" type="number" min="1" style="width: 15ch;" v-model="id"></label>
      </div>

      <!-- Help -->
      <div class="bg-secondary rounded p-4 mt-4 shrink " v-if="show_help">
        <h2>Click on the stars</h2>
        <p class="pb-4">
          You can set the uncap level of the summons by clicking on the stars.
        </p>
        <h2>Share your summons</h2>
        <p>
          You can share your Friend summons by clicking "Save", then "Share".<br>
          You need an account to use this feature.
        </p>
      </div>

      <div class="flex flex-row flex-wrap self-center my-8">
        <div class="flex flex-col items-center mr-4">
          <span class="px-3 py-1 my-1 rounded-full text-white bg-red-600">Fire</span>
          <box-summon :object="summons[0]" :showLevel="false" @click-portrait="showModal(0)"></box-summon>
          <box-summon :object="summons[8]" :showLevel="false" @click-portrait="showModal(8)"></box-summon>
        </div>
        <div class="flex flex-col items-center mr-4">
          <span class="px-3 py-1 my-1 rounded-full text-white bg-blue-600">Water</span>
          <box-summon :object="summons[3]" :showLevel="false" @click-portrait="showModal(3)"></box-summon>
          <box-summon :object="summons[11]" :showLevel="false" @click-portrait="showModal(11)"></box-summon>
        </div>
        <div class="flex flex-col items-center mr-4">
          <span class="px-3 py-1 my-1 rounded-full text-white bg-amber-800">Earth</span>
          <box-summon :object="summons[2]" :showLevel="false" @click-portrait="showModal(2)"></box-summon>
          <box-summon :object="summons[10]" :showLevel="false" @click-portrait="showModal(10)"></box-summon>
        </div>
        <div class="flex flex-col items-center mr-4">
          <span class="px-3 py-1 my-1 rounded-full text-white bg-emerald-600">Wind</span>
          <box-summon :object="summons[1]" :showLevel="false" @click-portrait="showModal(1)"></box-summon>
          <box-summon :object="summons[9]" :showLevel="false" @click-portrait="showModal(9)"></box-summon>
        </div>
        <div class="flex flex-col items-center mr-4">
          <span class="px-3 py-1 my-1 rounded-full text-black bg-amber-400">Light</span>
          <box-summon :object="summons[4]" :showLevel="false" @click-portrait="showModal(4)"></box-summon>
          <box-summon :object="summons[12]" :showLevel="false" @click-portrait="showModal(12)"></box-summon>
        </div>
        <div class="flex flex-col items-center mr-4">
          <span class="px-3 py-1 my-1 rounded-full text-white bg-violet-600">Dark</span>
          <box-summon :object="summons[5]" :showLevel="false" @click-portrait="showModal(5)"></box-summon>
          <box-summon :object="summons[13]" :showLevel="false" @click-portrait="showModal(13)"></box-summon>
        </div>
        <div class="flex flex-col items-center mr-4">
          <span class="px-3 py-1 my-1 rounded-full text-black bg-white">Misc</span>
          <box-summon :object="summons[6]" :showLevel="false" @click-portrait="showModal(6)"></box-summon>
          <box-summon :object="summons[7]" :showLevel="false" @click-portrait="showModal(7)"></box-summon>
        </div>
      </div>

      <!-- Modal -->
      <modal
        v-model="show_modal"
        route="/party/summons"
        :categories="categories"
        :dataModel="data_model"
        @item-selected="changeObject"
      ></modal>

      <!-- Clipboard -->
      <input v-show="clipboard_text.length > 0" id="clipboardInput" readonly type="text" :value="clipboard_text">
    </div>
  </div>
</template>

<script>
import Utils from '@/js/utils.js'
import DataModel from '@/js/data-model'

import BoxSummon from "@/components/BoxSummon.vue";
import Modal from '@/components/ModalSelector.vue'
import friendsStoreMixin from '@/store/modules/friend-summons'

const CATEGORIES = [
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
    BoxSummon,
    Modal,
  },
  mixins: [
    friendsStoreMixin
  ],
  head: {
    title: 'Granblue.Party - Friend Summons',
    desc: 'Share your Friend summons and User ID',
    image: 'https://www.granblue.party/img/card_friendsum.jpg',
    keywords: 'friend summons, share'
  },
  data() {
    return {
      clipboard_text: '',
      show_help: false,
      show_modal: false,
      selected_box_index: 0,
      data_model: {
        e: Utils.copy(DataModel.e)
      },
      loading: true
    }
  },
  methods: {
    showModal(index) {
      this.selected_box_index = index;

      if (index > 7) {
        index -= 8;
      }

      if (index < 6) {
        this.data_model.e.data.forEach(d => d.checked = false);
        this.data_model.e.data[index].checked = true;
      }
      else {
        this.data_model.e.data.forEach(d => d.checked = true);
      }

      this.show_modal = true;
    },
    changeObject(id) {
      const slot = this.selected_box_index;
      if (Utils.isEmpty(id)) {
        this.$set(this.summons, slot, {});
      }
      else {
        this.axios.get('/party/summons/' + id)
          .then(response => this.$set(this.summons, slot, response.data))
          .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
      }
    },
    clickCopyURL() {
      // Add a # to trick Discord into refreshing every time
      const text = window.location.href  + '/' + this.$store.getters.getUserId + '#';
      // Put in clipboard
      this.clipboard_text = text;

      let self = this;
      this.$nextTick().then(_ => {
        const input = document.getElementById("clipboardInput");
        input.select();
        document.execCommand("copy");
        self.clipboard_text = '';

        self.$store.dispatch('addMessage', {message: 'URL copied to clipboard'});
      });
    },
    clickSave() {
      let packet = {
        gbfid: this.id,
        data: []
      };
      this.summons.forEach(l => {
        if (Utils.isEmpty(l)) {
          packet.data.push(null);
        }
        else {
          packet.data.push({
            id: l.summonid,
            uncap: l.stars
          });
        }
      });

      this.axios.post('/friendsum/save', packet)
        .then(_ => this.$store.dispatch('addMessage', {message: 'Data saved successfully'}))
        .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
    },
    loadCollection() {
      if (this.isOwnProfile) {
        this.$store.commit('setPartyMode', this.$MODE.Edit);
      }
      else {
        this.$store.commit('setPartyMode', this.$MODE.ReadOnly);
      }
      return this.$store.dispatch('friends/loadSummons', this.userId)
    },
  },
  computed: {
    id: {
      get() { return this.$store.state.friends.id },
      set(value) { this.$store.commit('friends/setId', value) }
    },
    userId() {
      if (this.isOwnProfile) {
        return this.$store.getters.getUserId;
      }
      // Defined when viewing other friend summons
      return this.$route.params.friend_id;
    },
    summons() {
      return this.$store.state.friends.summons;
    },
    found() {
      return this.$store.state.friends.found;
    },
    updated() {
      return this.$store.state.friends.updated;
    },
    categories() {
      return CATEGORIES;
    },
    isOwnProfile() {
      return this.$route.params.friend_id === undefined;
    },
  },
  watch: {
    '$store.getters.getUserId'(id) {
      this.loading = true;
      this.loadCollection()
        .then(_ => this.loading = false);
    },
    '$route'(to, from) {      
      // When the route changes from "Other collection" to "My collection"
      this.loading = true;
      this.loadCollection()
        .then(_ => this.loading = false);
    },
  },
  serverPrefetch() {
    return this.loadCollection()
      .then(_ => {
        if (this.found) {
          this.$ssrContext.head_image = 'https://www.granblue.party/previews/friendsum/friendsum_' + this.userId + '.' + this.updated + '.jpg';
        }
      });
  },
  async mounted() {
    await this.loadCollection()
      .then(_ => this.loading = false);
  },
}
</script>