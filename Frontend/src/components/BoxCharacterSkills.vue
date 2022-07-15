<template>
  <div class="flex flex-row flex-wrap" style="min-height: 78px; max-height: 78px;" v-if="! objectIsEmpty">
    <span v-for="skill in getSkills" :key="skill.index" class="w-1/2 tooltip-parent">
      <img
        class="w-full"
        :class="party_mode === $MODE.Action ? 'cursor-pointer' : ''"
        :src="getSkillImage(skill.index)"
        @click="$emit('click-skill', skill.index)"
      >
      <span class="tooltip">{{ skill.name }}</span>
    </span>
  </div>
</template>

<script>
import { objectIsEmpty } from "@/js/mixins"
import { mapState } from 'vuex'

export default {
  mixins: [
    objectIsEmpty
  ],
  props: {
    object: Object,
  },
  methods: {
    getSkillImage(index) {
      return '/img/chara_skills/' + this.object.characterid + '_' + index + '.png';
    },
  },
  computed: {
    ...mapState({
      party_mode: state => state.party_builder.party_mode
    }),
    getSkills() {
      return this.object.skills.flatMap(s => {
        if (this.object.level >= s.obtain) {
          return [s];
        }
        return [];
      })
    },
  }
}
</script>