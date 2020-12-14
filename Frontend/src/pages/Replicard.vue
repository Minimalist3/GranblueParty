<template>
  <div class="flex flex-col">
    <h1 class="pb-4">Replicard Sandbox Maps</h1>

    <div class="flex flex-row flex-wrap mb-4 items-center space-x-4">
        <button class="btn" :class="show_help ? 'btn-blue' : 'btn-white'" @click="show_help = ! show_help">
          <fa-icon :icon="['fas', 'info-circle']" class="text-xl"></fa-icon> Usage
        </button>
      <checkbox v-model="show_loot">Show loot</checkbox>
      <checkbox v-model="scrollbar">Show scrollbar</checkbox>
    </div>

    <!-- Usage -->
    <div class="bg-secondary rounded p-4 mb-2" v-if="show_help">
      <h2>Number of fights</h2>
      <p class="pb-4">
        The number above each circle represents the number of fights needed to guarantee the appearance of a Defender.
      </p>
      <h2>To fight the Boss</h2>
      <p class="pb-4">
        To fight the Boss of each zone, you need 3 components dropped by the Defenders.
        Each component is indicated in parentheses after the color of its Defender.
      </p>
    </div>

    <!-- Tabs -->
    <span class="flex flex-col w-full">
      <div class="self-start flex flex-row flex-wrap border-primary border-b font-bold w-full">
        <a @click="show_tab = 'E'" class="px-4 py-2 text-primary cursor-pointer rounded-t" :class="show_tab === 'E' ? 'bg-secondary' : ''">Eletio</a>
        <a @click="show_tab = 'F'" class="px-4 py-2 text-primary cursor-pointer rounded-t" :class="show_tab === 'F' ? 'bg-secondary' : ''">Faym</a>
        <a @click="show_tab = 'G'" class="px-4 py-2 text-primary cursor-pointer rounded-t" :class="show_tab === 'G' ? 'bg-secondary' : ''">Goliath</a>
        <a @click="show_tab = 'H'" class="px-4 py-2 text-primary cursor-pointer rounded-t" :class="show_tab === 'H' ? 'bg-secondary' : ''">Harbinger</a>
      </div>

      <div>
        <div><span class="text-pink-500">Pink:</span> {{ zone[show_tab].boss1 }} (Organ)</div>
        <div><span class="text-green-500">Green:</span> {{ zone[show_tab].boss2 }} (Rib)</div>
        <div><span class="text-yellow-500">Yellow:</span> {{ zone[show_tab].boss3 }} (Core)</div>
      </div>

      <div class="relative bg-primary" :class="scrollbar ? 'overflow-x-auto' : ''">
        <img
          v-if="show_loot" :src="'/img/arcarum/replicard_' + show_tab + '_loot.png'"
          :style="scrollbar ? 'min-width: 1377px;' : ''"
        >
        <img
          :src="'/img/arcarum/replicard_' + show_tab + '.png'"
          :class="show_loot ? 'absolute top-0 left-0' : ''"
          :style="scrollbar ? 'min-width: 1377px;' : ''"
        >
      </div>
    </span>

  </div>
</template>

<script>
import Utils from '@/js/utils.js'

import Checkbox from '@/components/common/Checkbox.vue'

const lsMgt = new Utils.LocalStorageMgt('Replicard');

const ZONES = {
  'E': {
    boss1: 'The Devil',
    boss2: 'The Sun',
    boss3: 'The Star'
  },
  'F': {
    boss1: 'Justice',
    boss2: 'The Moon',
    boss3: 'Death'
  },
  'G': {
    boss1: 'The Hanged Man',
    boss2: 'The Tower',
    boss3: 'Death'
  },
  'H': {
    boss1: 'Temperance',
    boss2: 'Judgement',
    boss3: 'The Star'
  },
}

export default {
  components: {
    Checkbox
  },
  head: {
    title: 'Granblue.Party - Replicard Sandbox Maps',
    desc: 'View Replicard Sandbox Maps with loots and colors for each node',
    image: 'https://www.granblue.party/img/preview_replicard.png',
    keywords: 'Replicard, Sandbox, Maps, Arcarum'
  },
  data() {
    return {
      show_help: false,
      show_loot: true,
      scrollbar: true,
      show_tab: 'E',
    };
  },
  computed: {
    zone() {
      return ZONES;
    }
  },
  watch: {
    show_loot() {
      lsMgt.setValue('show_loot', this);
    },
    scrollbar() {
      lsMgt.setValue('scrollbar', this);
    },
    show_tab() {
      lsMgt.setValue('show_tab', this);
    },
  },
  mounted() {
    lsMgt.getValue(this, 'show_loot');
    lsMgt.getValue(this, 'scrollbar');
    lsMgt.getValue(this, 'show_tab');
  },
};
</script>