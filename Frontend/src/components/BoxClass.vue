<template>
  <div class="flex flex-col" style="min-width: 78px; max-width: 78px;">
    <!-- Title -->
    <span class="text-xs h-5 px-1 text-center truncate" :title="object.nameen">{{ object.nameen }}</span>

    <!-- Portrait -->
    <img
      class="cursor-pointer"
      style="min-height: 142px; max-height: 142px;"
      :src="getPortraitImage"
      @click="$emit('click-portrait')">

    <!-- Skills -->
    <div class="flex flex-row flex-wrap">
      <span v-for="(skill, skillIndex) in object.skills" :key="skillIndex" class="w-1/2 tooltip-parent">
        <img
          class="cursor-pointer w-full"
          :src="getSkillImage(skillIndex)"
          @click="$emit('click-skill', skillIndex)"
        >
        <span v-if="skill" class="tooltip">{{ skill.nameen }}</span>
      </span>
    </div>
  </div>
</template>

<script>
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
    getPortraitImage() {
      if (Utils.isEmpty(this.object.nameen)) {
        return '/img/empty_chara.jpg';
      }
      return '/img/class/' + this.object.nameen.replace(/\s/g, '_') + '.jpg';
    },
  },
}
</script>