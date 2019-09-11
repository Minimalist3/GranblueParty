<template>
  <div>
    <span class="summon">
      <a
        class="scaledText"
        target="_blank"
        :href="'https://gbf.wiki/' + object.nameen"
        :style="getTitleColor"
        :title="object.nameen"
        v-if="object.nameen"
      >
        {{ object.nameen }}
      </a>
      <span class="scaledText" v-else> </span>
      
      <img
        :draggable="object.nameen"
        :src="getImage"
        @click="onClick(index)"
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

      <span class="summonTooltipText" v-if="object.current_data">
        <span class="is-family-code is-size-7" v-for="(data, index) in object.current_data" :key="index">
          <span class="is-capitalized">{{ data.aura_type }}</span> {{ data.stat }} {{ data.percent }}% <span v-if="data.slot">({{ data.slot }})</span><br>
        </span>
      </span>
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
          style="width: 2.5ch;"
          v-model.number.lazy="object.pluses"
          @keydown.arrow-up="object.pluses++"
          @keydown.arrow-down="object.pluses--"
        >
      </span>
    </div>
  </div>
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
    onClick: {
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
        type: 'summon'
      }
      ev.dataTransfer.setData("Object", JSON.stringify(obj));
    },
    drop(ev) {
      ev.preventDefault();
      let obj = ev.dataTransfer.getData("Object");
      if (obj.length > 0) {
        obj = JSON.parse(obj);

        if (this.onSwap && obj.type === 'summon') {
          this.onSwap(obj.slot, this.index, ev.dataTransfer.dropEffect);
        }
      }   
    },
    changeCurrentData() {
      if (this.object.data && this.object.stars) {
        switch(this.object.stars) {
          case 5:
            if (this.object.data['5']) {
              Vue.set(this.object, 'current_data', this.object.data['5']);
              break;
            }
          case 4:
            if (this.object.data['4']) {
              Vue.set(this.object, 'current_data', this.object.data['4']);
              break;
            }
          case 3:
            if (this.object.data['3']) {
              Vue.set(this.object, 'current_data', this.object.data['3']);
              break;
            }
          default:
            Vue.set(this.object, 'current_data', this.object.data['0']);
        }
      }
    }
  },
  computed: {
    getImage() {
      if (Utils.isEmpty(this.object.nameen)) {
        return './img/empty_summon.jpg';
      }
      return "./img/unit/" + this.object.summonid + "000.jpg";
    },
    getTitleColor() {
      switch (this.object.stars) {
        case 3:
          return 'color: #ffa826; text-shadow: 0px 0px 2px #694429;';
        case 4:
          return 'color: #e3b7ff; text-shadow: 0px 0px 2px #7f12b7;';
        case 5:
          return 'color: #a1e3ff; text-shadow: 0px 0px 3px #371eb4';
        default:
          return 'color: #fff;';
      }
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
      this.changeCurrentData();
    },
    'object.stars'() {
      if (this.object.level > this.getLevel || ! this.showLevel) {
        Vue.set(this.object, 'level', this.getLevel);
      }
      this.changeCurrentData();
    },
  },
}
</script>

<style scoped>

.summon {
  display: flex;
  flex-direction: column;
  min-width: 110px;
  max-width: 110px;
  position: relative;
}
  .summon > img {
    min-height: 83px;
    max-height: 83px;
  }
  .summon > #starsLine {
    position: absolute;
    bottom: 0px;
    left: 20px;
    width: 80%;
  }

.summon .summonTooltipText {
    visibility: hidden; white-space: nowrap; text-align: center;
    position: absolute; 
    left: 0px; bottom: 100%; z-index: 1;
    
    background-color: rgba(0, 0, 0, 0.7); color: #fff; 
    border-radius: 6px; padding: 2px 5px;
}
    .summon:hover .summonTooltipText {
        visibility: visible;
    }
    .summon:hover .summonTooltipText:hover {
        visibility: hidden;
    }


</style>
