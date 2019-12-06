<template>
  <div class="flex flex-col" style="min-width: 78px; max-width: 78px;">
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
      @drag-portrait="$emit('drag-portrait', $event)"
      @drop-portrait="drop"
      @click-portrait="$emit('click-portrait')"
      @click-pring="object.haspring = ! object.haspring"
      @stars-changed="starsChanged"
    ></portrait>

    <!-- Stats -->
    <div class="flex flex-row flex-no-wrap justify-around text-xs" v-if="! objectIsEmpty && showLevel">
      <stat-input shortName="lvl" longName="Character level" :prop.sync="object.level" :length="3"></stat-input>
      <stat-input shortName="+" longName="Plus bonuses" :prop.sync="object.pluses" :length="3"></stat-input>
    </div>

    <!-- Skills -->
    <skills
      :object="object"
      @click-skill="$emit('click-skill', $event)"
    ></skills>
  </div>
</template>

<script>
import { objectIsEmpty } from "@/js/mixins"
import Utils from '@/js/utils'

import Portrait from '@/components/BoxCharacterPortrait.vue'
import Skills from '@/components/BoxCharacterSkills.vue'
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
      required: true
    },
  },
  methods: {
    drop(ev) {
      const data = ev.dataTransfer.getData("character");
      if (data.length > 0) {
        this.$emit('swap', JSON.parse(data));
      }
    },
    starsChanged(object, count) {
      Vue.set(object, "stars", count);

      if (object.level > this.getLevel || ! this.showLevel) {
        Vue.set(object, "level", this.getLevel);
      }
    },
  },
  computed: {
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
  }
}
</script>