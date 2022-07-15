<template>
  <div class="flex flex-row flex-wrap">
    <box-class
      :object="getObject"
      @click-portrait="showModalClass"
      @click-skill="clickSkill"
    ></box-class>

    <!-- Modals -->
    <modal
      v-if="party_mode !== $MODE.ReadOnly"
      v-model="show_modal_class"
      route="/party/classes"
      :categories="getCategoriesClass"
      @item-selected="changeObject"
    ></modal>
    <modal
      v-if="party_mode !== $MODE.ReadOnly"
      v-model="show_modal_skill"
      route="/party/skills"
      :routeParameters="'family=' + getObject.family"
      :categories="getCategoriesSkill"
      @item-selected="changeSkill"
    ></modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Utils from '@/js/utils'

import BoxClass from "@/components/BoxClass.vue";
import Modal from '@/components/ModalSelector.vue'

export default {
  components: {
    BoxClass,
    Modal,
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
      switch (this.party_mode) {
        case this.$MODE.Action:
          // TODO show warning
          break;

        case this.$MODE.Edit:
          this.show_modal_class = true;
          break;

        case this.$MODE.ReadOnly:
          // Do nothing
          break;
      }
    },
    clickSkill(index) {
      switch (this.party_mode) {
        case this.$MODE.Action:
          if (this.getObject.skills[index] !== null) {
            // Send action
            this.$store.commit('addActionMCSkill', index);
          }
          break;

        case this.$MODE.Edit:
          // Show modal
          if (this.getObject.skills[index] === null || ! this.getObject.skills[index].fixed) {
            this.selected_skill_index = index;
            this.show_modal_skill = true;
          }
          break;

        case this.$MODE.ReadOnly:
          // Do nothing
          break;
      }
    },
    changeObject(id) {
      if (Utils.isEmpty(id)) {
        this.$store.commit('setClasse', {});
      }
      else {
        this.axios.get('/party/classes/' + id)
          .then(response => this.$store.commit('setClasse', response.data))
          .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
      }
    },
    changeSkill(id) {
      if (Utils.isEmpty(id)) {
        this.$store.commit('setClasseSkill', {slot: this.selected_skill_index, data: null})
      }
      else {
        this.axios.get('/party/skills/' + id)
          .then(response => this.$store.commit('setClasseSkill', {slot: this.selected_skill_index, data: response.data}))
          .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
      }
    },
  },
  computed: {
    ...mapState({
      party_mode: state => state.party_builder.party_mode
    }),
    getObject() {
      return this.$store.state.party_builder.classe;
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