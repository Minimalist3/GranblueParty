<template>
  <div>
    <h1 class="title has-text-white">Friend Summons</h1>

    <div class="field is-grouped is-grouped-multiline vcenter-line">
      <div class="control">
        <button
          class="button is-light is-outlined"
          @click="clickCopyURL"
        >
          Copy PermaURL
        </button>
      </div>

      <div class="control">
        <button
          class="button is-light is-info"
          :class="showHelp ? '' : 'is-outlined'"
          @click="showHelp = ! showHelp"
        >
          💡Usage
        </button>
      </div>

      <div class="control">
        <label>My ID <input class="input is-small" type="number" min="1" style="width: 20ch;" v-model="id"></label>
      </div>
    </div>

    <div class="box has-background-light" v-if="showHelp">
      <p>
        <span class="title">Click on the stars</span><br>
        You can set the uncap level of the summons by clicking on the stars.
      </p>
      <p>
        <span class="title">Copy PermaURL</span><br>
        You can share your friend summons by clicking the "Copy PermaURL" button and copying the URL of the page.
      </p>
    </div>
    <br>

    <div class="columns is-centered is-multiline is-mobile">
      <span class="column is-narrow has-text-centered">
        <span class="tag is-medium is-rounded is-unselectable has-text-light" style="background-color: rgb(224, 36, 22);">Fire</span>
        <summon-box
          ref="summonBox0"
          :index="0"
          :object="summons[0]"
          :onClick="clickSummon"
        ></summon-box>
        <summon-box
          ref="summonBox1"
          :index="1"
          :object="summons[1]"
          :onClick="clickSummon"
        ></summon-box>
        <span class="tag is-medium is-rounded is-unselectable has-text-light" style="margin-top: 4px; background-color: rgb(9, 145, 16);">Wind</span>
      </span>

      <span class="column is-narrow has-text-centered">
        <span class="tag is-medium is-rounded is-unselectable has-text-light" style="background-color: rgb(17, 135, 209);">Water</span>
        <summon-box
          ref="summonBox3"
          :index="3"
          :object="summons[3]"
          :onClick="clickSummon"
        ></summon-box>
        <summon-box
          ref="summonBox4"
          :index="4"
          :object="summons[4]"
          :onClick="clickSummon"
        ></summon-box>
        <span class="tag is-medium is-rounded is-unselectable has-text-black" style="margin-top: 4px; background-color: rgb(242, 232, 29);">Light</span>
      </span>

      <span class="column is-narrow has-text-centered">
        <span class="tag is-medium is-rounded is-unselectable has-text-light" style="background-color: rgb(158, 99, 9);">Earth</span>
        <summon-box
          ref="summonBox2"
          :index="2"
          :object="summons[2]"
          :onClick="clickSummon"
        ></summon-box>
        <summon-box
          ref="summonBox5"
          :index="5"
          :object="summons[5]"
          :onClick="clickSummon"
        ></summon-box>
        <span class="tag is-medium is-rounded is-unselectable has-text-light" style="margin-top: 4px; background-color: rgb(116, 10, 168);">Dark</span>
      </span>

      <span class="column is-narrow has-text-centered">
        <span class="tag is-medium is-rounded is-light is-unselectable">Misc.</span>
        <summon-box
          ref="summonBox6"
          :index="6"
          :object="summons[6]"
          :onClick="clickSummon"
        ></summon-box>
        <summon-box
          ref="summonBox7"
          :index="7"
          :object="summons[7]"
          :onClick="clickSummon"
        ></summon-box>
      </span>
    </div>

    <span class="column has-text-centered is-size-4">ID: {{ id }}</span>

    <modal-selector
      ref="modalSummon"
      route="party/summons"
      :categories="modalSummonData"
      :selected="whenSummonSelected"
    ></modal-selector>

    <input
      v-show="clipboardText.length > 0"
      id="clipboardInput"
      readonly
      type="text"
      :value="clipboardText"
    >
  </div>
</template>

<script>
import SummonBox from '@/components/SummonBox.vue'
import ModalSelector from '@/components/ModalSelector.vue'

import msgpack from '@/js/msgpack.js'
import base64js from '@/js/base64js.js'
import Utils from '@/js/utils.js'

const lsMgt = new Utils.LocalStorageMgt('FriendSummons');

const defaultValues = {
  summons: [{}, {}, {}, {}, {}, {}, {}, {}],
}
// Helper to match categories with proper default values
const getDefaultValues = (data, category) => {
  if (Utils.isEmpty(data[category])) {
    return defaultValues[category];
  }
  if (data[category] instanceof Array) {          
    return data[category].map(e => Utils.isEmpty(e) ? {} : e);
  }
  return data[category];
};

export default {
  components: {
    SummonBox,
    ModalSelector
  },
  data() {
    return {
      id: 1,
      summons: defaultValues['summons'],
      modalSummonData: [
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
      clipboardText: '',
      showHelp: false,
    }
  },
  methods: {
    range(start, end) {
      return Array(end - start + 1).fill().map((_, idx) => start + idx)
    },
    clickSummon(slot) {
      if (slot < 6) {
        this.$refs.modalSummon.dataModel.e.data.forEach(d => d.checked = false);
        this.$refs.modalSummon.dataModel.e.data[slot].checked = true;
      } 
      else {
        this.$refs.modalSummon.dataModel.e.data.forEach(d => d.checked = true);
      }     

      this.$refs.modalSummon.showModal(slot);
    },
    whenSummonSelected(id, slot) {
      if (Utils.isEmpty(id)) return;

      return this.$http.get('/party/summons/' + id)
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
      this.clipboardText = window.location.href.split('?')[0] + text;
      history.replaceState(null, null, text);

      let self = this;
      Vue.nextTick().then(() => {
        const input = document.getElementById("clipboardInput");
        input.select();
        document.execCommand("copy");
        self.clipboardText = '';
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
