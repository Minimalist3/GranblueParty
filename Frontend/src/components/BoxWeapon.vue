<template>
  <div class="flex flex-col" style="max-width: 105px;">
    <!-- Title -->
    <a
      class="text-xs text-primary h-5 px-1 text-center truncate"
      target="_blank"
      :href="'https://gbf.wiki/' + object.nameen"
      :title="getName"
      v-if="! objectIsEmpty"
    >{{ getName }}</a>
    <span class="text-xs h-5" v-else> </span>

    <!-- Portrait -->
    <portrait
      :object="object"
      :isArcarum="isArcarum"
      @click-portrait="$emit('click-portrait')"
      @drag-portrait="$emit('drag-portrait', $event)"
      @drop-portrait="drop"
      @stars-changed="starsChanged"
    ></portrait>

    <!-- Stats -->
    <div class="flex flex-row flex-nowrap justify-around text-xs" v-if="! objectIsEmpty && showLevel">
      <stat-input shortName="lvl" longName="Weapon level" :prop.sync="object.level" :length="3"></stat-input>
      <stat-input shortName="sl" longName="Skill level" :prop.sync="object.sklevel" :length="2"></stat-input>
      <stat-input shortName="+" longName="Plus bonuses" :prop.sync="object.pluses" :length="3"></stat-input>
    </div>

    <!-- Skills -->
    <skills :object="object" :skills="getSkills"></skills>
  </div>
</template>

<script>
import { objectIsEmpty, getName } from "@/js/mixins"
import Utils from '@/js/utils'
import UtilsParty from '@/js/utils-party'

import Portrait from '@/components/BoxWeaponPortrait.vue'
import Skills from '@/components/BoxWeaponSkills.vue'
import StatInput from '@/components/common/StatInput.vue'

export default {
  components: {
    Portrait,
    Skills,
    StatInput,
  },
  mixins: [
    objectIsEmpty,
    getName
  ],
  props: {
    object: {
      type: Object,
      required: true
    },
    skills: {
      type: Array,
      required: true
    },
    showLevel: {
      type: Boolean,
      default: false,
    },
    isArcarum: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    drop(ev) {
      const data = ev.dataTransfer.getData("weapon");
      if (data.length > 0) {
        this.$emit('swap', JSON.parse(data));
      }
    },
    starsChanged(object, count) {
      this.$set(object, "stars", count);

      if ( ! this.showLevel || object.level > this.getLevel) {
        this.$set(object, 'level', this.getLevel);
      }
      if ( ! this.showLevel || object.sklevel > this.getSkillLevel) {
        this.$set(object, 'sklevel', this.getSkillLevel);
      }      
    },
    getWeaponSkillValue(skill_level, percent, stat) {
      let ratio = percent[1];

      if (stat === 'stamina') {
        if (this.getPercentHP < 25) {
          return 0;
        }
        if (skill_level <= 15) {
          return (Math.pow(this.getPercentHP / (ratio - skill_level), 2.9) + 2.1) / 100;
        }
        else {
          return (Math.pow(this.getPercentHP / (ratio - (15 + (0.4 * (skill_level-15)))), 2.9) + 2.1) / 100;
        }
      }

      if (skill_level === 20 && percent.hasOwnProperty(20)) {
        ratio = percent[20];
      }
      else {
        if (skill_level > 1 && percent.hasOwnProperty(10)) {
          ratio += (percent[10] - percent[1]) / 9 * Math.min(skill_level - 1, 9);
        }
        if (skill_level > 10 && percent.hasOwnProperty(15)) {
          ratio += (percent[15] - percent[10]) / 5 * Math.min(skill_level - 10, 5);
        }
        if (skill_level > 15 && percent.hasOwnProperty(20)) {
          ratio += (percent[20] - percent[15]) / 5 * Math.min(skill_level - 15, 5);
        }
      }

      if (stat === 'enmity') {
        const missing_hp_ratio = 1 - this.getPercentHP / 100;
        return (ratio / 100) * ((1 + 2 * missing_hp_ratio) * missing_hp_ratio);
      }

      return ratio / 100;
    },
  },
  computed: {
    getPercentHP() {
      return this.$store.state.party_builder.percent_HP;
    },
    getLevel() {
      return UtilsParty.getWeaponLevel(this.object);
    },
    getSkillLevel() {
      return UtilsParty.getWeaponSkillLevel(this.object);
    },
    getSkills() {
      if (this.object.skills === undefined) {
        return [];
      }

      let skills = this.object.skills.flatMap((slot, index) => {
        let skill = [];
        for (let item of slot) {
          if (item.level > this.object.level) {
            break;
          }
          if (this.object.keys[index] !== null) {
            // Skill key selected
            skill = this.object.keys[index];
            break;
          }
          else {
            skill = item;
          }
        }
        return skill;
      });

      // This is probably not optimal, since level change triggers this for nothing
      skills.forEach(s => {
        if (s.data) {
          for (let d of s.data) {
            this.$set(d, 'value', this.getWeaponSkillValue(this.object.sklevel, d.percent, d.stat));
          }
        }
      });

      // Keep in the store
      for (let i=0; i<skills.length; i++) {
        this.$set(this.skills, i, skills[i]);
      }

      return skills;
    }
  },
}
</script>