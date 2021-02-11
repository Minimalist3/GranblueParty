<template>
  <div class="flex flex-col">
    <h1 class="pb-4">Replicard Sandbox Maps</h1>

    <div class="flex flex-row flex-wrap mb-4 items-center space-x-4">
      <button class="btn" :class="show_help ? 'btn-blue' : 'btn-white'" @click="show_help = ! show_help">
        <fa-icon :icon="['fas', 'info-circle']" class="text-xl"></fa-icon> Usage
      </button>
      <checkbox v-model="show_loot">Show loot</checkbox>
      <checkbox v-model="show_progression">Show progression</checkbox>
      <button class="btn btn-blue" v-if="show_progression && isUserLogged" @click="save()">
        <fa-icon :icon="['fas', 'save']" class="text-xl"></fa-icon> Save progression
      </button>
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
      <h2>Track your progression</h2>
      <p class="pb-4">
        Click on the stars to track your progression.
        Each node has 3 quests. Add a star when you complete the corresponding quest.<br>
        Mouseover the stars to see the name of the monster.
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

      <div class="relative bg-primary overflow-x-auto">

        <img
          v-if="show_loot" :src="'/img/arcarum/replicard_' + show_tab + '_loot.png'"
          style="min-width: 1377px;"
        >
        <img
          :src="'/img/arcarum/replicard_' + show_tab + '.png'"
          :class="show_loot ? 'absolute top-0 left-0' : ''"
          style="min-width: 1377px;"
        >
        <span
          v-if="show_progression"
          class="absolute top-0 left-0"
          style="min-width: 1377px;"
        >
          <div class="relative">
            <stars-line
              v-for="(star, index) in zone[show_tab].stars"
              :key="index"
              class="absolute bg-black"
              :style="'top: ' + star.top + 'px; left: ' + star.left + 'px;'"
              :base="2"
              :extra="3"
              :current.sync="progression[show_tab][index]"
              :max="3"
              :title="star.name"
            ></stars-line>
          </div>
        </span>
      </div>
    </span>

  </div>
</template>

<script>
import Utils from '@/js/utils.js'

import Checkbox from '@/components/common/Checkbox.vue'
import StarsLine from '@/components/StarsLine.vue'

import replicardModule from '@/store/modules/replicard'

const lsMgt = new Utils.LocalStorageMgt('Replicard');

const ZONES = {
  'E': {
    boss1: 'The Devil',
    boss2: 'The Sun',
    boss3: 'The Star',
    stars: [
      {top: 140, left:   45, name: 'Slithering Seductress'},
      {top: 135, left:  322, name: 'Living Lightning Rod'},
      {top: 265, left:  272, name: 'Eletion Drake'},
      {top: 142, left:  553, name: 'Paradoxical Gate'},
      {top: 128, left:  685, name: 'Blazing Everwing'},
      {top: 208, left:  812, name: 'Death Seer'},
      {top:  66, left:  965, name: 'Hundred-Armed Hulk'},
      {top: 193, left: 1135, name: 'Terror Trifecta'},
      {top: 265, left: 1125, name: 'Rageborn One'},
      {top: 135, left: 1280, name: 'Eletion Glider'}
    ]
  },
  'F': {
    boss1: 'Justice',
    boss2: 'The Moon',
    boss3: 'Death',
    stars: [
      {top: 146, left:   30, name: 'Trident Grandmaster'},
      {top: 206, left:  167, name: 'Hoarfrost Icequeen'},
      {top: 263, left:  352, name: 'Oceanic Archon'},
      {top: 146, left:  508, name: 'Farsea Predator'},
      {top: 206, left:  646, name: 'Faymian Fortress'},
      {top: 146, left:  791, name: 'Draconic Simulacrum'},
      {top: 146, left:  993, name: 'Azureflame Dragon'},
      {top: 263, left: 1091, name: 'Eye of Sorrow'},
      {top: 149, left: 1275, name: 'Mad  Shearwielder'},
      {top: 154, left: 1132, name: 'Faymian Gun'}
    ]
  },
  'G': {
    boss1: 'The Hanged Man',
    boss2: 'The Tower',
    boss3: 'Death',
    stars: [
      {top: 257, left:  164, name: 'Avatar of Avarice'},
      {top:  29, left:  237, name: 'Temptation\'s Guide'},
      {top: 143, left:  285, name: 'World\'s Veil'},
      {top: 138, left:  592, name: 'Bloodstained Barbarian'},
      {top: 257, left:  563, name: 'Goliath Keeper'},
      {top: 120, left:  810, name: 'Frenzied Howler'},
      {top: 141, left:  963, name: 'Vestige of Truth'},
      {top: 257, left:  857, name: 'Goliath Vanguard'},
      {top: 194, left: 1085, name: 'Writhing Despair'},
      {top: 198, left: 1282, name: 'Goliath Triune'}
    ]
  },
  'H': {
    boss1: 'Temperance',
    boss2: 'Judgement',
    boss3: 'The Star',
    stars: [
      {top: 174, left:   29, name: 'Dirgesinger'},
      {top:  34, left:  208, name: 'Vengeful Demigod'},
      {top: 250, left:  159, name: 'Wildwind Conjurer / Fullthunder Conjurer'},
      {top: 146, left:  334, name: 'Harbinger Simurgh'},
      {top: 260, left:  486, name: 'Harbinger Hardwood'},
      {top: 188, left:  583, name: 'Demanding Stormgod'},
      {top: 143, left:  960, name: 'Harbinger Tyrant'},
      {top: 256, left: 1099, name: 'Phantasmagoric Aberration'},
      {top: 186, left: 1220, name: 'Dimentional Riftwalker'},
      {top:  48, left:  670, name: 'Harbinger Stormer'}
    ]
  },
}

export default {
  components: {
    Checkbox,
    StarsLine
  },
  head: {
    title: 'Granblue.Party - Replicard Sandbox Maps',
    desc: 'View Replicard Sandbox Maps with loots, colors, and progression for each node',
    image: 'https://www.granblue.party/img/preview_replicard.png',
    keywords: 'Replicard, Sandbox, Maps, Arcarum'
  },
  data() {
    return {
      show_help: false,
      show_loot: true,
      show_progression: true,
      scrollbar: true,
      show_tab: 'E',
    };
  },
  methods: {
    save() {
      this.axios.post('/replicard/save', this.progression)
        .then(response => this.$store.dispatch('addMessage', {message: 'Data saved successfully'}))
        .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
    },
    loadServerData() {
      if (this.data_fetched === false) {
        return this.axios.get('/replicard/load')
          .then(response => {
            if (response.data !== null) {
              this.$set(this, 'progression', response.data);
              this.data_fetched = true;
            }
          })
          .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
      }
    },
    loadData() {
      if (this.isUserLogged) {
        this.loadServerData();
      }
      else {
        this.$store.commit('replicard/resetReplicard');

        const progression = lsMgt.fetchValue('progression');
        if (progression !== undefined) {
          this.progression = progression;
        }
      }
    },
  },
  computed: {
    isUserLogged() {
      return this.$store.getters.getUserId !== null;
    },
    zone() {
      return ZONES;
    },
    progression: {
      get() { return this.$store.state.replicard.progression },
      set(value) { this.$store.commit('replicard/setReplicardData', value) }
    },
    data_fetched: {
      get() { return this.$store.state.replicard.data_fetched },
      set(value) { this.$store.commit('replicard/setReplicardFetched', value) }
    },
  },
  watch: {
    '$store.getters.getUserId'() {
      this.data_fetched = false;
      this.loadData();
    },
    show_loot() {
      lsMgt.setValue('show_loot', this);
    },
    show_tab() {
      lsMgt.setValue('show_tab', this);
    },
    progression: {
      handler() {
        if ( ! this.isUserLogged) {
          lsMgt.setValue('progression', this);
        }
      },
      deep: true
    },
  },
  serverPrefetch() {
    if (this.isUserLogged) {
      return this.loadServerData();
    }
  },
  mounted() {
    lsMgt.getValue(this, 'show_loot');
    lsMgt.getValue(this, 'show_tab');

    this.loadData();
  },
  beforeCreate() {
    const preserve_state = !! this.$store.state.replicard;
    this.$store.registerModule('replicard', replicardModule, { preserveState: preserve_state });
  },
  destroyed() {
    this.$store.unregisterModule('replicard');
  },
};
</script>