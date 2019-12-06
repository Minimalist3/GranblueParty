<template>
  <div class="flex flex-col">

    <h1>Friend Summons</h1>

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
</template>

<script>
import msgpack from '@/js/libs/msgpack.js'
import base64js from '@/js/libs/base64js.js'
import Utils from '@/js/utils.js'
import DataModel from '@/js/data-model'

import BoxSummon from "@/components/BoxSummon.vue";
import Modal from '@/components/ModalSelector.vue'

const lsMgt = new Utils.LocalStorageMgt('FriendSummons');

const DEFAULT_VALUES = {
  summons: [{}, {}, {}, {}, {}, {}, {}, {}],
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
    BoxSummon,
    Modal,
  },
  data() {
    return {
      id: 1,
      clipboard_text: '',
      show_help: false,
      show_modal: false,
      selected_box_index: 0,
      summons: Utils.copy(DEFAULT_VALUES['summons']),
      categories: [
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
      ],
      data_model: {
        e: Utils.copy(DataModel.e)
      },
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
      this.$http.get('/party/summons/' + id)
        .then(response => Vue.set(this.summons, slot, response.data))
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
      Vue.nextTick().then(() => {
        const input = document.getElementById("clipboardInput");
        input.select();
        document.execCommand("copy");
        self.clipboard_text = '';
      });
    },
  },
  watch: {
    id() {
      lsMgt.setValue('id', this);
    }
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('f')) {
      const param = urlParams.get('f');
      const data = msgpack.deserialize(base64js.toByteArray(Utils.unescapeBase64(param)));
      let postData = {
        summons: data.s,
      }
      this.id = data.id;

      this.$http.post('/party/load', postData)
        .then(response => {
          this.summons = getDefaultValues(response.data, 'summons');
          if (data.ss) {
            for (let i=0; i<this.summons.length; i++) {
              if ( ! Utils.isEmpty(this.summons[i])) {
                Vue.set(this.summons[i], 'stars', data.ss[i]);
              }
            }
          }
        });
    }
    else {
      lsMgt.getValue(this, 'id');
    }
  }
}
</script>