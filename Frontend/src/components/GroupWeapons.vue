<template>
  <div class="flex flex-row flex-wrap">
    <!-- Main weapon -->
    <box-weapon
      :object="objects[0]"
      :skills="skills[0]"
      :showLevel="showLevel"
      @click-portrait="showModal(0)"
      @drag-portrait="drag($event, 0)"
      @swap="swap($event, 0)"
    ></box-weapon>

    <!-- Grid -->
    <div class="flex flex-col flex-wrap gap-y-1">
      <div class="flex flex-row px-2" v-for="(line, lineIndex) in getIndexes" :key="lineIndex">
        <span v-for="index in line" :key="index">
          <box-weapon
            :object="objects[index]"
            :skills="skills[index]"
            :showLevel="showLevel"
            @click-portrait="showModal(index)"
            @drag-portrait="drag($event, index)"
            @swap="swap($event, index)"
          ></box-weapon>
        </span>
      </div>
      <div v-if="showArcarum" class="flex flex-row shrink bg-secondary rounded px-2 pb-1">
        <span v-for="index in [10, 11, 12]" :key="index">
          <box-weapon
            :object="objects[index]"
            :skills="skills[index]"
            :showLevel="showLevel"
            :isArcarum="true"
            @click-portrait="showModal(index)"
            @drag-portrait="drag($event, index)"
            @swap="swap($event, index)"
          ></box-weapon>
        </span>
      </div>
    </div>

    <!-- Modal -->
    <modal
      v-if="party_mode !== $MODE.ReadOnly"
      v-model="show_modal"
      route="/party/weapons"
      :categories="getCategories"
      @item-selected="changeObject"
    ></modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Utils from '@/js/utils'

import BoxWeapon from "@/components/BoxWeapon.vue";
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
    isColumn: false,
    isFilter: false,
    key: "ri",
  },
  {
    name: "Element",
    isColumn: true,
    isFilter: true,
    key: "e",
  },
  {
    name: "Weapon",
    isColumn: true,
    isFilter: true,
    key: "w",        
  },
];

const INDEXES = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

export default {
  components: {
    BoxWeapon,
    Modal,
  },
  props: {
    showLevel: {
      type: Boolean,
      default: false,
    },
    showArcarum: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      show_modal: false,
      selected_box_index: 0,
    }
  },
  methods: {
    drag(ev, index) {
      ev.dataTransfer.setData("weapon", JSON.stringify(index));
    },
    showModal(index) {
      switch (this.party_mode) {
        case this.$MODE.Action:
          // TODO show warning
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
        this.$store.commit('setWeapon', { index: slot, data: {} })
      }
      else {
        this.axios.get('/party/weapons/' + id)
          .then(response => this.$store.commit('setWeapon', { index: slot, data: response.data }))
          .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
      }
    },
    swap(from, to) {
      if (this.party_mode === this.$MODE.ReadOnly) {
        return;
      }
      let tmp = this.objects[from];
      this.$store.commit('setWeapon', { index: from, data: this.objects[to] })
      this.$store.commit('setWeapon', { index: to, data: tmp })
    }
  },
  computed: {
    ...mapState({
      objects: state => state.party_builder.weapons,
      skills: state => state.party_builder.weapons_skills,
      party_mode: state => state.party_builder.party_mode
    }),
    getCategories() {
      return CATEGORIES;
    },
    getIndexes() {
      return INDEXES;
    }
  }
}
</script>