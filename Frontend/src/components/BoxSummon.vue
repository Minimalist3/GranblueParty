<template>
  <div class="flex flex-col" style="min-width: 110px; max-width: 110px;">
    <!-- Title -->
    <a
      class="text-xs text-gray-100 hover:text-gray-100 bg-gray-700 rounded-t h-5 px-1 text-center truncate"
      target="_blank"
      :href="'https://gbf.wiki/' + object.nameen"
      :style="getTitleColor"
      :title="object.nameen"
      v-if="! objectIsEmpty"
    >
      {{ object.nameen }}
    </a>
    <span class="text-xs h-5" v-else> </span>

    <!-- Portrait -->
    <portrait
      :object="object"
      @drag-portrait="$emit('drag-portrait', $event)"
      @drop-portrait="drop"
      @click-portrait="$emit('click-portrait')"
      @stars-changed="starsChanged"
    ></portrait>

    <!-- Stats -->
    <div class="flex flex-row flex-no-wrap justify-around text-xs" v-if="! objectIsEmpty && showLevel">
      <stat-input shortName="lvl" longName="Summon level" :prop.sync="object.level" :length="3"></stat-input>
      <stat-input shortName="+" longName="Plus bonuses" :prop.sync="object.pluses" :length="3"></stat-input>
    </div>
  </div>
</template>

<script>
import Utils from '@/js/utils'
import { objectIsEmpty } from "@/js/mixins"

import Portrait from '@/components/BoxSummonPortrait.vue'
import StatInput from '@/components/common/StatInput.vue'

export default {
  components: {
    StatInput,
    Portrait
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
      const data = ev.dataTransfer.getData("summon");
      if (data.length > 0) {
        this.$emit('swap', JSON.parse(data));
      }
    },
    setCurrentData() {
      if (this.object.data) {
        switch (this.object.stars) {
          case 5:
            if (this.object.data["5"]) {
              Vue.set(this.object, "current_data", 5);
              break;
            }
          case 4:
            if (this.object.data["4"]) {
              Vue.set(this.object, "current_data", 4);
              break;
            }
          case 3:
            if (this.object.data["3"]) {
              Vue.set(this.object, "current_data", 3);
              break;
            }
          default:
            Vue.set(this.object, "current_data", 0);
        }
      } else {
        Vue.set(this.object, "current_data", undefined);
      }
    },
    starsChanged(count) {
      Vue.set(this.object, "stars", count);

      if (object.level > this.getLevel || !this.showLevel) {
        Vue.set(this.object, "level", this.getLevel);
      }

      this.setCurrentData();
    },
  },
  computed: {
    getTitleColor() {
      switch (this.object.stars) {
        case 3:
          return 'color: #ffa826;';
        case 4:
          return 'color: #e3b7ff;';
        case 5:
          return 'color: #a1e3ff;';
        default:
          return '';
      }
    },
    getLevel() {
      switch (this.object.stars) {
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
      if (this.object.pluses === undefined) {
        Vue.set(this.object, 'pluses', 0);
      }
      this.setCurrentData();
    },
  }
}
</script>