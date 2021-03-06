<template>
  <div class="flex flex-col">

    <h1 class="self-center mb-8">Friend Summons</h1>

    <div v-if="loading === true">
      Loading...
    </div>
    <div class="flex flex-col items-center" v-else>
      <!-- Toolbar -->
      <div class="flex flex-row flex-wrap space-x-2">
        <button class="btn" :class="show_help ? 'btn-blue' : 'btn-white'" @click="show_help = ! show_help">
          <fa-icon :icon="['fas', 'info-circle']" class="text-xl"></fa-icon> Usage
        </button>

        <button class="btn btn-white" @click="clickCopyURL">
          <fa-icon :icon="['fas', 'share-alt']" class="text-xl"></fa-icon> Share
        </button>

        <label>My ID <input class="input is-small" type="number" min="1" style="width: 15ch;" v-model="id"></label>
      </div>

      <!-- Help -->
      <div class="bg-secondary rounded p-4 mt-4 flex-shrink " v-if="show_help">
        <h2>Click on the stars</h2>
        <p class="pb-4">
          You can set the uncap level of the summons by clicking on the stars.
        </p>
        <h2>Share your summons</h2>
        <p>
          You can share your friend summons by clicking the "Share" button and copying the URL of the page.
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
          <span class="px-3 py-1 my-1 rounded-full text-white bg-yellow-800">Earth</span>
          <box-summon :object="summons[2]" :showLevel="false" @click-portrait="showModal(2)"></box-summon>
          <box-summon :object="summons[10]" :showLevel="false" @click-portrait="showModal(10)"></box-summon>
        </div>
        <div class="flex flex-col items-center mr-4">
          <span class="px-3 py-1 my-1 rounded-full text-white bg-green-600">Wind</span>
          <box-summon :object="summons[1]" :showLevel="false" @click-portrait="showModal(1)"></box-summon>
          <box-summon :object="summons[9]" :showLevel="false" @click-portrait="showModal(9)"></box-summon>
        </div>
        <div class="flex flex-col items-center mr-4">
          <span class="px-3 py-1 my-1 rounded-full text-black bg-yellow-400">Light</span>
          <box-summon :object="summons[4]" :showLevel="false" @click-portrait="showModal(4)"></box-summon>
          <box-summon :object="summons[12]" :showLevel="false" @click-portrait="showModal(12)"></box-summon>
        </div>
        <div class="flex flex-col items-center mr-4">
          <span class="px-3 py-1 my-1 rounded-full text-white bg-purple-600">Dark</span>
          <box-summon :object="summons[5]" :showLevel="false" @click-portrait="showModal(5)"></box-summon>
          <box-summon :object="summons[13]" :showLevel="false" @click-portrait="showModal(13)"></box-summon>
        </div>
        <div class="flex flex-col items-center mr-4">
          <span class="px-3 py-1 my-1 rounded-full text-black bg-white">Misc</span>
          <box-summon :object="summons[6]" :showLevel="false" @click-portrait="showModal(6)"></box-summon>
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

        self.$store.dispatch('addMessage', {message: 'URL copied to clipboard'});
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
  destroyed() {
    this.$store.unregisterModule('friends');
  },
}
</script>