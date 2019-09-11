<template>
  <span class="weapon">
    <a
      class="scaledText has-text-white"
      target="_blank"
      :href="'https://gbf.wiki/' + object.nameen"
      :title="object.nameen"
      v-if="object.nameen"
    >
      {{ object.nameen }}
    </a>
    <span class="scaledText" v-else> </span>

    <img
      :draggable="object.nameen"
      @click="onClick(index)"
      :src="getImage"
      @dragstart="drag($event)"
      @dragover="allowDrop($event)"
      @drop="drop($event)"
    >
    <stars-line
      v-if="object.starsbase"
      :base="object.starsbase"
      :extra="object.starsmax"
      :current.sync="object.stars"
      :max="5"
    ></stars-line>

    <div class="level-block" v-if="object.nameen && showLevel">
      <span class="vcenter-line">
        <label>lvl</label>
        <input
          class="input is-small has-background-dark has-text-light level-input"
          type="tel"
          style="width: 3.5ch;"
          v-model.number.lazy="object.level"
          @keydown.arrow-up="object.level++"
          @keydown.arrow-down="object.level--"
        >
      </span>
      <span class="vcenter-line">
        <label>sl</label>
        <input
          class="input is-small has-background-dark has-text-light level-input"
          type="tel"
          style="width: 2.5ch;"
          v-model.number.lazy="object.sklevel"
          @keydown.arrow-up="object.sklevel++"
          @keydown.arrow-down="object.sklevel--"
        >
      </span>
      <span class="vcenter-line">
        <label>+</label>
        <input
          class="input is-small has-background-dark has-text-light level-input"
          type="tel"
          style="width: 2.5ch;"
          v-model.number.lazy="object.pluses"
          @keydown.arrow-up="object.pluses++"
          @keydown.arrow-down="object.pluses--"
        >
      </span>
    </div>

    <span class="weaponSkills">
      <span
        class="weaponSkillButton"
        v-for="(skill, index) in getSkills"
        :key="index"
      >
        <img
          :class="skill.keyid !== null ? 'is-clickable' : ''"
          :src="'./img/weapon_skills/' + skill.icon"
          @click="showKeyModal(index, skill.keyid)"
        >
        <span class="weaponTooltipText">{{ skill.name }}<br>
          <span class="is-family-code is-size-7" v-for="(data, index) in object.current_data[index]" :key="index">
            <span class="is-capitalized">{{ data.aura_type }}</span> {{ data.stat }} {{ (data.value * 100).toFixed(2) }}%<br>
          </span>
        </span>
      </span>
    </span>

    <modal-skill-key
      ref="modalSkillKey"
      :selected="setKey"
    ></modal-skill-key>
  </span>
</template>

<script>
import KeyData from '@/js/keyData.js'
import Utils from '@/js/utils.js'

import ModalSkillKey from '@/components/ModalSkillKey.vue'
import StarsLine from '@/components/StarsLine.vue'

export default {
  components: {
    ModalSkillKey,
    StarsLine,
  },
  props: {
    object: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    onClick: {
      type: Function,
      required: true
    },
    percentHP: {
      type: Number,
      required: true
    },
    onSwap: {
      type: Function,
      default: undefined,
    },
    showLevel: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    allowDrop(ev) {
      ev.preventDefault();
    },
    drag(ev) {
      const obj = {
        slot: this.index,
        type: 'weapon'
      }
      ev.dataTransfer.setData("Object", JSON.stringify(obj));
    },
    drop(ev) {
      ev.preventDefault();
      let obj = ev.dataTransfer.getData("Object");
      if (obj.length > 0) {
        obj = JSON.parse(obj);

        if (this.onSwap && obj.type === 'weapon') {
          this.onSwap(obj.slot, this.index, ev.dataTransfer.dropEffect);
        }
      }   
    },
    showKeyModal(index, keyid) {
      if (keyid === null) {
        return;
      }
      this.$refs.modalSkillKey.showModal(index, keyid);
    },
    setKey(index, obj) {
      Vue.set(this.object.keys, index, obj);
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
    getImage() {
      if (Utils.isEmpty(this.object) || Utils.isEmpty(this.object.nameen)) {
        return './img/empty_weapon.jpg';
      }
      return "./img/weapon/" +  this.object.weaponid + "00.jpg";
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
          if (item.keyid !== null && this.object.keys[index] !== null) {
            skill = this.object.keys[index];
          }
          else {
            skill = item;          
          }
        }
        return skill;
      });

      // Update current_data when the skills change
      Vue.set(this.object, 'current_data', skills.flatMap(s => {
        if (s.data) {
          // Compute skill ratio here
          for (let d of s.data) {
            d.value = this.getWeaponSkillValue(this.object.sklevel, d.percent, d.stat);
          }
          return [s.data];
        }
        return [[]];
      }));

      return skills;
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
    getPercentHP() {
      return Math.min(Math.max(0, this.percentHP), 100);
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
    'object.stars'() {
      if (this.object.level > this.getLevel || ! this.showLevel) {
        Vue.set(this.object, 'level', this.getLevel);
      }
      if (this.object.sklevel > this.getSkillLevel || ! this.showLevel) {
        Vue.set(this.object, 'sklevel', this.getSkillLevel);
      }
    },
  },
}
</script>

<style scoped>

.weapon {
  display: flex; flex-direction: column;
  min-width: 105px; max-width: 105px;
  position: relative;
}
  .weapon > img {
    min-height: 60px; max-height: 60px;
  }
  .weapon > #starsLine {
    position: absolute;
    top: 64px;
    left: 24px;
    width: 75%;
  }

.weaponSkills {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
  .weaponSkills img {
    width: 30px;
    height: 30px;
  }

.weaponSkillButton {
  position: relative;
}

.weaponSkillButton .weaponTooltipText {
    visibility: hidden; white-space: nowrap; text-align: center;
    position: absolute; 
    left: 0px; bottom: 100%; z-index: 1;
    
    background-color: rgba(0, 0, 0, 0.7); color: #fff; 
    border-radius: 6px; padding: 2px 5px;
}
    .weaponSkillButton:hover .weaponTooltipText {
        visibility: visible;
    }
    .weaponSkillButton:hover .weaponTooltipText:hover {
        visibility: hidden;
    }

</style>
