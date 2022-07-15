<template>
  <div class="flex flex-col" style="min-width: 78px; max-width: 78px;">
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
      :showRing="showRing"
      @drag-portrait="$emit('drag-portrait', $event)"
      @drop-portrait="drop"
      @click-portrait="$emit('click-portrait')"
      @click-pring="clickPRing"
      @stars-changed="starsChanged"
    ></portrait>

    <!-- Stats -->
    <div class="flex flex-row flex-nowrap justify-around text-xs" v-if="! objectIsEmpty && showLevel">
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
import { objectIsEmpty, getName } from "@/js/mixins"
import { mapState } from 'vuex'
import UtilsParty from '@/js/utils-party'

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
    objectIsEmpty,
    getName
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
    showRing: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    drop(ev) {
      const data = ev.dataTransfer.getData("character");
      if (data.length > 0) {
        this.$emit('swap', JSON.parse(data));
      }
    },
    clickPRing() {
      if (this.party_mode !== this.$MODE.ReadOnly) {
        this.object.haspring = ! this.object.haspring
      }
    },
    starsChanged(object, count) {
      this.$set(object, "stars", count);

      if ( ! this.showLevel || object.level > this.getLevel) {
        this.$set(object, "level", this.getLevel);
      }
    },
  },
  computed: {
    ...mapState({
      party_mode: state => state.party_builder.party_mode
    }),
    getLevel() {
      return UtilsParty.getCharacterLevel(this.object);
    }
  },
}
</script>