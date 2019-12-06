<template>
  <div class="flex flex-col" style="min-width: 105px; max-width: 105px;">
    <!-- Title -->
    <a
      class="text-xs text-primary h-5 px-1 text-center truncate"
      target="_blank"
      :href="'https://gbf.wiki/' + object.nameen"
      :title="object.nameen"
      v-if="! objectIsEmpty"
    >
      {{ object.nameen }}
    </a>
    <span class="text-xs h-5" v-else> </span>

    <!-- Portrait -->
    <portrait
      :object="object"
      @click-portrait="$emit('click-portrait')"
      @drag-portrait="$emit('drag-portrait', $event)"
      @drop-portrait="drop"
      @stars-changed="starsChanged"
    ></portrait>

    <!-- Stats -->
    <div class="flex flex-row flex-no-wrap justify-around text-xs" v-if="! objectIsEmpty && showLevel">
      <stat-input shortName="lvl" longName="Weapon level" :prop.sync="object.level" :length="3"></stat-input>
      <stat-input shortName="sl" longName="Skill level" :prop.sync="object.sklevel" :length="2"></stat-input>
      <stat-input shortName="+" longName="Plus bonuses" :prop.sync="object.pluses" :length="3"></stat-input>
    </div>

    <!-- Skills -->
    <skills :object="object" :skills="getSkills"></skills>
  </div>
</template>

<script>
import Utils from '@/js/utils'
import { objectIsEmpty } from "@/js/mixins"

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
    objectIsEmpty
  ],
  props: {
    object: {
      type: Object,
      required: true
    },
    showLevel: {
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
      Vue.set(object, "stars", count);

      if (object.level > this.getLevel || ! this.showLevel) {
        Vue.set(object, 'level', this.getLevel);
      }
      if (object.sklevel > this.getSkillLevel || ! this.showLevel) {
        Vue.set(object, 'sklevel', this.getSkillLevel);
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
      return this.$store.getters.getPercentHP;
    },
    getLevel() {
      switch(this.object.stars) {
        case 0:
          return 40;
        case 1:
          return 60;
        case 2:
          return 80;
        case 3:
          return 100;
        case 4:
          return 150;
      }
      return 200;
    },
    getSkillLevel() {
      switch(this.object.stars) {
        case 5:
          return 20;
        case 4:
          return 15;
      }
      return 10;
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
            Vue.set(d, 'value', this.getWeaponSkillValue(this.object.sklevel, d.percent, d.stat));
          }
        }
      });

      // TODO Temporary, to make PartyDetails work
      Vue.set(this.object, 'current_data', skills.flatMap(s => {
        if (s.data) {
          return [s.data];
        }
        return [];
      }));

      return skills;
    }
  },
  watch: {
    object() {
      if (Utils.isEmpty(this.object)) {
        return;
      }

      if (this.object.level === undefined) {
        Vue.set(this.object, 'level', this.getLevel);
      }
      if (this.object.sklevel === undefined) {
        Vue.set(this.object, 'sklevel', this.getSkillLevel);
      }
      if (this.object.pluses === undefined) {
        Vue.set(this.object, 'pluses', 0);
      }
      if (this.object.keys === undefined) {
        Vue.set(this.object, 'keys', [null, null, null]);
      }
    },
  }
}
</script>