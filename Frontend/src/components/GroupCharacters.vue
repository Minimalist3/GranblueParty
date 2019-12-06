<template>
  <div class="flex flex-row flex-wrap group-characters">
    <box-character
      v-for="(object, index) in objects"
      :key="index"
      :object="object"
      :showLevel="showLevel"
      @click-portrait="showModal(index)"
      @click-skill="clickSkill(index, $event)"
      @drag-portrait="drag($event, index)"
      @swap="swap($event, index)"
    ></box-character>

    <!-- Modal -->
    <modal
      v-model="show_modal"
      route="/party/characters"
      :categories="getCategories"
      @item-selected="changeObject"
    ></modal>    
  </div>
</template>

<script>
import Utils from '@/js/utils'

import BoxCharacter from '@/components/BoxCharacter.vue'
import Modal from '@/components/ModalSelector.vue'

export default {
  components: {
    BoxCharacter,
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
      ev.dataTransfer.setData("character", JSON.stringify(index));
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
      this.$http.get('/party/characters/' + id)
        .then(response => Vue.set(this.objects, slot, response.data))
        .catch(error => console.log(error));
    },
    clickSkill(index, skillIndex) {
      if (this.editMode) {
        // TODO warning
      }
      else if (this.objects[index].skills[skillIndex] !== undefined) {
        this.$store.commit('addActionCharacterSkill', { slot: index, index: skillIndex });
      }
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
          isFilter: true,
          key: "ri",
        },
        {
          name: "Element",
          isColumn: true,
          isFilter: true,
          key: "e",
        },
        {
          name: "Type",
          isColumn: true,
          isFilter: true,
          key: "t",
        },
        {
          name: "Race",
          isColumn: true,
          isFilter: true,
          key: "ra",        
        },
        {
          name: "Weapon",
          isColumn: true,
          isFilter: true,
          key: "w",        
        },
      ];
    }
  }
}
</script>

<style scoped>
.group-characters > :nth-child(3) {
  @apply mr-2;
}
</style>