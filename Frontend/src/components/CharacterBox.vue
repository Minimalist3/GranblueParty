<template>
  <span class="portrait">
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
    
    <span class="portrait-img">
      <img
        class="is-clickable"
        :draggable="object.nameen"
        :src="getImage"
        @click="onClickPortrait(index)"
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

      <img
        v-if="object.nameen !== undefined && object.haspring !== undefined"
        class="ring-img is-clickable"
        :class="object.haspring ? '' : 'ring-disabled'"
        src="@/img/icon_pring.png"
        title="Perpetuity Ring"
        @click="object.haspring = ! object.haspring"
      >
    </span>

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
        <label>+</label>
        <input
          class="input is-small has-background-dark has-text-light level-input"
          type="tel"
          style="width: 3.5ch;"
          v-model.number.lazy="object.pluses"
          @keydown.arrow-up="object.pluses++"
          @keydown.arrow-down="object.pluses--"
        >
      </span>
    </div>

    <span class="skills" v-if="object.nameen">
      <span
        v-for="skill in getSkills"
        :key="skill.index"
        class="skillButton is-clickable"
        :style="'background-image: url(./img/chara_skills/' + object.characterid + '_' + skill.index + '.png);'"
        @click="onClickSkill(index, skill.index)"
      >
        <span class="tooltipText">{{ skill.name }}</span>
      </span>
    </span>
  </span>
</template>

<script>
import Utils from '@/js/utils.js'

import StarsLine from '@/components/StarsLine.vue'

export default {
  components: {
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
    onClickPortrait: {
      type: Function,
      required: true
    },
    onClickSkill: {
      type: Function,
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
        type: 'character'
      }
      ev.dataTransfer.setData("Object", JSON.stringify(obj));
    },
    drop(ev) {
      ev.preventDefault();
      let obj = ev.dataTransfer.getData("Object");
      if (obj.length > 0) {
        obj = JSON.parse(obj);

        if (this.onSwap && obj.type === 'character') {
          this.onSwap(obj.slot, this.index);
        }
      }   
    },
  },
  computed: {
    getImage() {
      if (Utils.isEmpty(this.object.nameen)) {
        return './img/empty_chara.jpg';
      }
      return "./img/unit/" + this.object.characterid + "000.jpg";
    },
    getSkills() {
      return this.object.skills.flatMap(s => {
        if (this.object.level >= s.obtain) {
          return [s];
        }
        return [];
      })
    },
    getLevel() {
      switch(this.object.rarityid) {
        // SSR
        case 2:
          switch(this.object.stars) {
            case 0:
              return 40;
            case 1:
              return 50;
            case 2:
              return 60;
            case 3:
              return 70;
            case 4:
              return 80;
          }
          return 100;
        // SR
        case 1:
          switch(this.object.stars) {
            case 0:
              return 30;
            case 1:
              return 40;
            case 2:
              return 50;
            case 3:
              return 60;
            case 4:
              return 70;
          }
          return 90;
      }
      // R
      switch(this.object.stars) {
        case 0:
          return 20;
        case 1:
          return 30;
        case 2:
          return 40;
      }
      return 50;
    },
  },
  watch: {
    object() {
      if (Utils.isEmpty(this.object)) {
        return;
      }

      if (this.object.level === undefined) {
        Vue.set(this.object, 'level', this.getLevel);
      }
      if (this.object.pluses === undefined) {
        Vue.set(this.object, 'pluses', 0);
      }
      if (this.object.haspring === undefined) {
        Vue.set(this.object, 'haspring', false);
      }
    },
    'object.stars'() {
      if (this.object.level > this.getLevel || ! this.showLevel) {
        Vue.set(this.object, 'level', this.getLevel);
      }
    },
  },
}
</script>

<style scoped>

.ring-img {
  position: absolute;
  bottom: 0px;
  right: 0px;
}

.ring-disabled {
  filter: grayscale(80%);
  opacity: 0.7;
}

</style>