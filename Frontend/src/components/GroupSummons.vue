<template>
  <div class="flex flex-row flex-wrap gap-x-2">
    <span class="flex flex-col">
      <span class="bg-secondary rounded-lg text-center mb-1">Main</span>        

      <box-summon
        :object="objects[0]"
        :showLevel="showLevel"
        @click-portrait="showModal(0)"
        @drag-portrait="drag($event, 0)"
        @swap="swap($event, 0)"
      ></box-summon>
    </span>

    <span class="flex flex-col flex-wrap">
      <div class="flex flex-row justify-around mb-1">
        <span>Atk {{ getStats.atk }}</span>
        <span>HP {{ getStats.hp }}</span>
      </div>

      <div class="flex flex-row flex-wrap" v-for="(line, lineIndex) in getIndexes" :key="lineIndex">
        <span v-for="index in line" :key="index" :class="lineIndex === 1 ? 'mt-1' : ''">
          <box-summon
            :object="objects[index]"
            :showLevel="showLevel"
            @click-portrait="showModal(index)"
            @drag-portrait="drag($event, index)"
            @swap="swap($event, index)"
          ></box-summon>
        </span>
      </div>
    </span>

    <span class="flex flex-col">
      <span class="bg-secondary rounded-lg text-center mb-1">Friend</span>        

      <box-summon
        :object="objects[5]"
        :showLevel="showLevel"
        @click-portrait="showModal(5)"
        @drag-portrait="drag($event, 5)"
        @swap="swap($event, 5)"
      ></box-summon>
    </span>

    <!-- Sub Aura -->
    <span class="flex flex-col bg-secondary rounded-lg gap-y-1">
      <span class="rounded-lg text-center">Sub Aura</span>        
      <box-summon
        :object="objects[6]"
        :showLevel="showLevel"
        @click-portrait="showModal(6)"
        @drag-portrait="drag($event, 6)"
        @swap="swap($event, 6)"
      ></box-summon>
      <box-summon
        :object="objects[7]"
        :showLevel="showLevel"
        @click-portrait="showModal(7)"
        @drag-portrait="drag($event, 7)"
        @swap="swap($event, 7)"
      ></box-summon>
    </span>

    <!-- Modal -->
    <modal
      v-if="party_mode !== $MODE.ReadOnly"
      v-model="show_modal"
      route="/party/summons"
      :categories="getCategories"
      @item-selected="changeObject"
    ></modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Utils from '@/js/utils'

import BoxSummon from "@/components/BoxSummon.vue";
import Modal from '@/components/ModalSelector.vue'

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
  props: {
    showLevel: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show_modal: false,
      selected_box_index: 0,
    }
  },
  methods: {
    drag(ev, index) {
      ev.dataTransfer.setData("summon", JSON.stringify(index));
    },
    showModal(index) {
      switch (this.party_mode) {
        case this.$MODE.Action:
          this.$store.commit('addActionSummon', index);
          break;

        case this.$MODE.Edit:
          this.selected_box_index = index;
          this.show_modal = true;
          break;

        case this.$MODE.ReadOnly:
          // Do nothing
          break;
      }
    },
    changeObject(id) {
      const slot = this.selected_box_index;
      if (Utils.isEmpty(id)) {
        this.$store.commit('setSummon', { index: slot, data: {} });
      } else {
        this.axios.get('/party/summons/' + id)
          .then(response => this.$store.commit('setSummon', { index: slot, data: response.data }))
          .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
      }
    },
    swap(from, to) {
      if (this.party_mode === this.$MODE.ReadOnly) {
        return;
      }
      let tmp = this.objects[from];
      this.$store.commit('setSummon', { index: from, data: this.objects[to] })
      this.$store.commit('setSummon', { index: to, data: tmp })
    }
  },
  computed: {
    ...mapState({
      objects: state => state.party_builder.summons,
      party_mode: state => state.party_builder.party_mode
    }),
    getStats() {
      return this.$store.getters.getSummonsStats;
    },
    getCategories() {
      return CATEGORIES;
    },
    getIndexes() {
      return [[1, 2], [3, 4]];
    }
  }
}
</script>