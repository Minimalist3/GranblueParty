<template>
  <div class="flex flex-row flex-wrap">
    <box-class
      :object="getObject"
      @click-portrait="showModalClass"
      @click-skill="clickSkill"
    ></box-class>

    <!-- Modals -->
    <modal
      v-model="show_modal_class"
      route="/party/classes"
      :categories="getCategoriesClass"
      @item-selected="changeObject"
    ></modal>
    <modal
      v-model="show_modal_skill"
      route="/party/skills"
      :routeParameters="'family=' + getObject.family"
      :categories="getCategoriesSkill"
      @item-selected="changeSkill"
    ></modal>
  </div>
</template>

<script>
import Utils from '@/js/utils'

import BoxClass from "@/components/BoxClass.vue";
import Modal from '@/components/ModalSelector.vue'

export default {
  components: {
    BoxClass,
    Modal,
  },
  props: {
    editMode: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show_modal_class: false,
      show_modal_skill: false,
      selected_skill_index: 0,
    }
  },
  methods: {
    showModalClass() {
      if (this.editMode) {
        this.show_modal_class = true
      }
      else {
        // TODO show warning
      }
    },
    clickSkill(index) {
      if (this.editMode) {
        // Show modal
        if (this.getObject.skills[index] === null || ! this.getObject.skills[index].fixed) {
          this.selected_skill_index = index;
          this.show_modal_skill = true;
        }
      }
      else if (this.getObject.skills[index] !== null) {
        // Send action
        this.$store.commit('addActionMCSkill', index);
      }
    },
    changeObject(id) {
      if (Utils.isEmpty(id)) return;

      this.$http.get('/party/classes/' + id)
        .then(response => this.$store.commit('setClasse', response.data))
        .catch(error => console.log(error));
    },
    changeSkill(id) {
      if (Utils.isEmpty(id)) return;

      this.$http.get('/party/skills/' + id)
        .then(response => this.$store.commit('setClasseSkill', {slot: this.selected_skill_index, data: response.data}))
        .catch(error => console.log(error));
    },
  },
  computed: {
    getObject() {
      return this.$store.getters.getClasse;
    },
    getCategoriesClass() {
      return [
        {
          name: "Name",
          isColumn: true,
          isFilter: false,
          key: "n",
        },
        {
          name: "Row",
          isColumn: true,
          isFilter: true,
          key: "row",
        },
      ];
    },
    getCategoriesSkill() {
      return [
        {
          name: "Name",
          isColumn: true,
          isFilter: false,
          key: "n",
        },
      ];
    }
  }
}
</script>