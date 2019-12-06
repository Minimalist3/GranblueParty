<template>
  <div class="flex flex-row">
    <!-- Main weapon -->
    <box-weapon
      class="mr-2"
      :object="objects[0]"
      :showLevel="showLevel"
      @click-portrait="showModal(0)"
      @drag-portrait="drag($event, 0)"
      @swap="swap($event, 0)"
    ></box-weapon>

    <!-- Grid -->
    <div class="flex flex-col flex-wrap">
      <div class="flex flex-row flex-wrap" v-for="(line, lineIndex) in getIndexes" :key="lineIndex">
        <span v-for="index in line" :key="index">
          <box-weapon
            :object="objects[index]"
            :showLevel="showLevel"
            @click-portrait="showModal(index)"
            @drag-portrait="drag($event, index)"
            @swap="swap($event, index)"
          ></box-weapon>
        </span>
      </div>
    </div>

    <!-- Modal -->
    <modal
      v-model="show_modal"
      route="/party/weapons"
      :categories="getCategories"
      @item-selected="changeObject"
    ></modal>
  </div>
</template>

<script>
import Utils from '@/js/utils'

import BoxWeapon from "@/components/BoxWeapon.vue";
import Modal from '@/components/ModalSelector.vue'

export default {
  components: {
    BoxWeapon,
    Modal,
  },
  props: {
    objects: {
      type: Array,
      required: true
    },
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
      ev.dataTransfer.setData("weapon", JSON.stringify(index));
    },
    showModal(index) {
      if (this.editMode) {
        this.selected_box_index = index;
        this.show_modal = true;
      }
      else {
        // TODO warning
      }
    },
    changeObject(id) {
      if (Utils.isEmpty(id)) return;

      const slot = this.selected_box_index;
      this.$http.get('/party/weapons/' + id)
        .then(response => Vue.set(this.objects, slot, response.data))
        .catch(error => console.log(error));
    },
    swap(from, to) {
      let tmp = this.objects[from];
      Vue.set(this.objects, from, this.objects[to]);
      Vue.set(this.objects, to, tmp);
    }
  },
  computed: {
    getCategories() {
      return [
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
    },
    getIndexes() {
      return [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    }
  }
}
</script>