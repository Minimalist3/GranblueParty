<template>
  <div class="flex flex-row flex-nowrap justify-around" v-if="! objectIsEmpty">
    <span v-for="(skill, skillIndex) in skills" :key="skillIndex" class="tooltip-parent">
      <img
        :class="skill.keyid !== null ? 'cursor-pointer' : ''"
        style="width: 30px; height: 30px;"
        :src="'/img/weapon_skills/' + skill.icon"
        @click="showKeyModal(skillIndex, skill.keyid)"
      >
      <span class="tooltip">
        {{ skill.name }} <span v-if="skill.boost">({{ skill.boost }})</span><br>
        <p v-if="skill.data !== null">
          <span class="font-mono text-xs" v-for="(data, dataIndex) in skill.data" :key="dataIndex">
            <span class="capitalize">{{ data.aura_type }}</span> {{ data.stat }} {{ (data.value * 100).toFixed(2) }}%<br>
          </span>
        </p>
      </span>
    </span>

    <!-- Modal -->
    <modal-keys v-model="show_modal_keys" :keyId="modal_key_id" @key-selected="selectKey"></modal-keys>
  </div>  
</template>

<script>
import { objectIsEmpty } from "@/js/mixins"

import ModalKeys from '@/components/ModalKeys.vue'

export default {
  components: {
    ModalKeys,
  },
  mixins: [
    objectIsEmpty
  ],
  props: {
    object: Object,
    skills: Array,
  },
  data() {
    return {
      show_modal_keys: false,
      modal_skill_index: 0,
      modal_key_id: 0,
    }
  },
  methods: {
    showKeyModal(index, keyid) {
      if (keyid !== null) {
        this.modal_skill_index = index;
        this.modal_key_id = keyid;
        this.show_modal_keys = true;
      }
    },
    selectKey(key) {
      this.$set(this.object.keys, this.modal_skill_index, key);
    }
  },
}
</script>