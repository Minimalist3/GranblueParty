<template>
  <span class="portrait">
    <span
      class="scaledText"
      :title="object.nameen"
    >
      {{ object.nameen }}
    </span>
    <img
      class="portrait-img"
      :src="getPortraitImage"
      @click="onClickPortrait"
    >
    <span class="skills">
      <span
        v-for="(skill, skillIndex) in object.skills"
        :key="skillIndex"
        class="skillButton"        
        :style="'background-image: url(' + getSkillImage(skillIndex) + ');'"
        @click="onClickSkill(skillIndex)"
      >
        <span
          v-if="skill"
          class="tooltipText"          
        >
          {{ skill.nameen }}
        </span>
      </span>
    </span>
  </span>  
</template>

<script>
import Utils from '@/js/utils.js'

export default {
  props: {
    object: {
      type: Object,
      required: true
    },
    onClickPortrait: {
      type: Function,
      required: true
    },
    onClickSkill: {
      type: Function,
      required: true
    }
  },
  methods: {
    getSkillImage(index) {
      if (this.object.skills !== undefined && this.object.skills[index] !== null) {
        return './img/class_skills/' + this.object.skills[index].skillid + '.png';
      }
      return './img/class_skills/null.png';
    },
  },
  computed: {
    getPortraitImage() {
      if (Utils.isEmpty(this.object.nameen)) {
        return './img/empty_chara.jpg';
      }
      return "./img/class/" + this.object.nameen.replace(/\s/g, '_') + ".jpg";
    },    
  },
}
</script>
