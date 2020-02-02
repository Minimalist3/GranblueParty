<template>
  <div class="flex flex-col">

    <h1>Friend Summons</h1>

    <div v-if="loading === true">
      Loading...
    </div>
    <div class="flex flex-col" v-else>
      <div class="flex flex-row flex-wrap items-center mb-4">
        <button class="btn mr-2" :class="show_help ? 'btn-blue' : 'btn-white'" @click="show_help = ! show_help">
          <fa-icon :icon="['fas', 'info-circle']" class="text-xl"></fa-icon> Usage
        </button>

        <button class="btn btn-white mr-2" @click="clickCopyURL">
          <fa-icon :icon="['fas', 'share-alt']" class="text-xl"></fa-icon> Share
        </button>

        <label>My ID <input class="input is-small" type="number" min="1" style="width: 15ch;" v-model="id"></label>
      </div>

      <div class="bg-secondary rounded p-4 mb-2" v-if="show_help">
        <h2>Click on the stars</h2>
        <p class="pb-4">
          You can set the uncap level of the summons by clicking on the stars.
        </p>
        <h2>Share your summons</h2>
        <p class="pb-4">
          You can share your friend summons by clicking the "Share" button and copying the URL of the page.
        </p>
      </div>

      <div class="flex flex-row flex-wrap self-center mb-4">
        <div class="flex flex-col items-center mr-4">
          <span class="px-3 py-1 my-1 rounded-full text-white bg-red-600">Fire</span>
          <box-summon class="mb-4" :object="summons[0]" :showLevel="false" @click-portrait="showModal(0)"></box-summon>
          <box-summon :object="summons[1]" :showLevel="false" @click-portrait="showModal(1)"></box-summon>
          <span class="px-3 py-1 my-1 rounded-full text-white bg-green-600">Wind</span>
        </div>
        <div class="flex flex-col items-center mr-4">
          <span class="px-3 py-1 my-1 rounded-full text-white bg-blue-600">Water</span>
          <box-summon class="mb-4" :object="summons[3]" :showLevel="false" @click-portrait="showModal(3)"></box-summon>
          <box-summon :object="summons[4]" :showLevel="false" @click-portrait="showModal(4)"></box-summon>
          <span class="px-3 py-1 my-1 rounded-full text-black bg-yellow-400">Light</span>
        </div>
        <div class="flex flex-col items-center mr-4">
          <span class="px-3 py-1 my-1 rounded-full text-white bg-yellow-800">Earth</span>
          <box-summon class="mb-4" :object="summons[2]" :showLevel="false" @click-portrait="showModal(2)"></box-summon>
          <box-summon :object="summons[5]" :showLevel="false" @click-portrait="showModal(5)"></box-summon>
          <span class="px-3 py-1 my-1 rounded-full text-white bg-purple-600">Dark</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="px-3 py-1 my-1 rounded-full text-black bg-white">Misc</span>
          <box-summon class="mb-4" :object="summons[6]" :showLevel="false" @click-portrait="showModal(6)"></box-summon>
          <box-summon :object="summons[7]" :showLevel="false" @click-portrait="showModal(7)"></box-summon>
        </div>
      </div>

      <span class="text-center text-xl font-semibold">ID: {{ id }}</span>

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
import msgpack from '@/js/libs/msgpack.js'
import base64js from '@/js/libs/base64js.js'
import Utils from '@/js/utils.js'
import DataModel from '@/js/data-model'

import BoxSummon from "@/components/BoxSummon.vue";
import Modal from '@/components/ModalSelector.vue'
import friendsModule from '@/store/modules/friend-summons'

const lsMgt = new Utils.LocalStorageMgt('FriendSummons');

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
  head: {
    title: 'Granblue.Party - Friend Summons',
    desc: 'Set your friend summons and share the link or screenshot to your friends',
    image: 'https://www.granblue.party/img/preview_friendsum.png',
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
      if (index < 6) {
        this.data_model.e.data.forEach(d => d.checked = false);
        this.data_model.e.data[index].checked = true;
      }
      else {
        this.data_model.e.data.forEach(d => d.checked = true);
      }

      this.selected_box_index = index;
      this.show_modal = true;
    },
    changeObject(id) {
      if (Utils.isEmpty(id)) return;

      const slot = this.selected_box_index;
      this.axios.get('/party/summons/' + id)
        .then(response => this.$set(this.summons, slot, response.data))
        .catch(error => console.log(error));
    },
    clickCopyURL() {
      let data = {
        id: this.id,
        s: [],
        ss: []
      }
      this.summons.forEach(s => {
        data.s.push(s.summonid);
        data.ss.push(s.stars);
      });
      
      const text = '?f=' + Utils.escapeBase64(base64js.fromByteArray(msgpack.serialize(data))) + window.location.hash;
      this.clipboard_text = window.location.href.split('?')[0] + text;
      history.replaceState(null, null, text);

      let self = this;
      this.$nextTick().then(_ => {
        const input = document.getElementById("clipboardInput");
        input.select();
        document.execCommand("copy");
        self.clipboard_text = '';
      });
    },
  },
  computed: {
    id: {
      get() { return this.$store.state.friends.id },
      set(value) { this.$store.commit('friends/setId', value) }
    },
    summons() {
      return this.$store.state.friends.summons;
    },
    categories() {
      return CATEGORIES;
    }
  },
  watch: {
    id() {
      lsMgt.setValue('id', this);
    }
  },
  serverPrefetch() {
    if ( ! Utils.isEmpty(this.$route.query.f)) {
      const data = msgpack.deserialize(base64js.toByteArray(Utils.unescapeBase64(this.$route.query.f)));
      this.id = data.id;
      return this.$store.dispatch('friends/fetchSummons', data);
    }
  },
  mounted() {
    if (Utils.isEmpty(this.$route.query.f)) {
      lsMgt.getValue(this, 'id');
    }

    this.loading = false;
  },
  beforeCreate() {
    const preserve_state = !! this.$store.state.friends;
    this.$store.registerModule('friends', friendsModule, { preserveState: preserve_state });
  },
  destroyed () {
    this.$store.unregisterModule('friends');
  },
}
</script>