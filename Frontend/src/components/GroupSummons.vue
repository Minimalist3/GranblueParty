<template>
  <div class="flex flex-row flex-wrap">
    <span class="flex flex-col mr-2">
      <span class="bg-tertiary rounded-lg text-center">Main</span>        

      <box-summon
        :object="objects[0]"
        :showLevel="showLevel"
        @click-portrait="showModal(0)"
        @drag-portrait="drag($event, 0)"
        @swap="swap($event, 0)"
      ></box-summon>
    </span>

    <div class="flex flex-col flex-wrap pr-2">
      <div class="flex flex-row justify-around">
        <span>Atk {{ getStats.atk }}</span>
        <span>HP {{ getStats.hp }}</span>
      </div>

      <div class="flex flex-row flex-wrap" v-for="(line, lineIndex) in getIndexes" :key="lineIndex">
        <span v-for="index in line" :key="index">
          <box-summon
            :object="objects[index]"
            :showLevel="showLevel"
            @click-portrait="showModal(index)"
            @drag-portrait="drag($event, index)"
            @swap="swap($event, index)"
          ></box-summon>
        </span>
      </div>
    </div>

    <span class="flex flex-col">
      <span class="bg-tertiary rounded-lg text-center">Friend</span>        

      <box-summon
        :object="objects[5]"
        :showLevel="showLevel"
        @click-portrait="showModal(5)"
        @drag-portrait="drag($event, 5)"
        @swap="swap($event, 5)"
      ></box-summon>
    </span>

    <!-- Modal -->
    <modal
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

const INDEXES = [[1, 2], [3, 4]];

export default {
  components: {
    BoxSummon,
    Modal,
  },
  props: {
    editMode: {
      type: Boolean,
      default: true
    },
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
      if (this.editMode) {
        this.selected_box_index = index;
        this.show_modal = true;
      }
      else {
        this.$store.commit('addActionSummon', index);
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
      let tmp = this.objects[from];
      this.$store.commit('setSummon', { index: from, data: this.objects[to] })
      this.$store.commit('setSummon', { index: to, data: tmp })
    }
  },
  computed: {
    ...mapState({
      objects: state => state.party_builder.summons
    }),
    getStats() {
      return this.$store.getters.getSummonsStats;
    },
    getCategories() {
      return CATEGORIES;
    },
    getIndexes() {
      return INDEXES;
    }
  }
}
</script>