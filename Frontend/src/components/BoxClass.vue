<template>
  <div class="flex flex-col" style="min-width: 78px; max-width: 78px;">
    <!-- Title -->
    <a
      class="text-xs text-primary rounded-t h-5 px-1 text-center truncate"
      target="_blank"
      :href="'https://gbf.wiki/' + object.nameen"
      :title="object.nameen"
    >{{ object.nameen }}</a>

    <!-- Portrait -->
    <img
      :class="party_mode === $MODE.Edit ? 'cursor-pointer' : ''"
      style="min-height: 142px; max-height: 142px;"
      :src="getPortraitImage"
      @click="$emit('click-portrait')">

    <!-- Skills -->
    <div class="flex flex-row flex-wrap">
      <span v-for="(skill, skillIndex) in object.skills" :key="skillIndex" class="w-1/2 tooltip-parent">
        <img
          class="w-full"
          :class="party_mode !== $MODE.ReadOnly ? 'cursor-pointer' : ''"
          :src="getSkillImage(skillIndex)"
          @click="$emit('click-skill', skillIndex)"
        >
        <span v-if="skill" class="tooltip">{{ skill.nameen }}</span>
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Utils from '@/js/utils.js'

export default {
  props: {
    object: {
      type: Object,
      required: true
    },
  },
  methods: {
    getSkillImage(index) {
      if (this.object.skills !== undefined && this.object.skills[index] !== null) {
        return '/img/class_skills/' + this.object.skills[index].skillid + '.png';
      }
      return '/img/class_skills/null.png';
    },
  },
  computed: {
    ...mapState({
      party_mode: state => state.party_builder.party_mode
    }),
    getPortraitImage() {
      if (Utils.isEmpty(this.object.nameen)) {
        if (this.party_mode !== this.$MODE.Edit) {
          return '/img/empty_chara_ro.jpg';
        }
        return '/img/empty_chara.jpg';
      }
      return '/img/class/' + this.object.nameen.replace(/\s/g, '_') + '.jpg';
    },
  },
}
</script>