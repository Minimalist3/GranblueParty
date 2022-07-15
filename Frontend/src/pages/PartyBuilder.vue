<template>
  <div class="flex flex-col">
    <!-- Options -->
    <div class="flex flex-row flex-wrap items-center gap-2 mb-4">
      <button 
        class="btn"
        :class="show_bookmarklet ? 'btn-blue' : 'btn-white'"
        @click="show_bookmarklet = ! show_bookmarklet; show_help = false"
      >
        <fa-icon :icon="['fas', 'info-circle']" class="text-xl"></fa-icon> Get Export Bookmarklet
      </button>

      <button
        class="btn"
        :class="show_help ? 'btn-blue' : 'btn-white'"
        @click="show_help = ! show_help; show_bookmarklet = false"
      >
        <fa-icon :icon="['fas', 'info-circle']" class="text-xl"></fa-icon> Usage
      </button>

      <label class="flex flex-row items-center gap-2">
        <span>Layout</span>
        <dropdown v-model="layout">
          <option value="square">Square</option>
          <option value="wide">Wide</option>
          <option value="compact">Compact</option>
        </dropdown>
      </label>

      <checkbox :value="party_mode === $MODE.Edit" @input="party_mode = ($event ? $MODE.Edit : $MODE.Action)">Edit Grid</checkbox>

      <checkbox v-model="show_level">Levels and pluses</checkbox>

      <checkbox v-model="show_rings">Perpetuity Rings</checkbox>

      <checkbox v-model="arcarum_weapons">Arcarum weapon slots</checkbox>
    </div>

    <!-- Bookmarklet -->
    <div class="bg-secondary self-center rounded p-4 mb-2" v-if="show_bookmarklet">
      <div v-if="show_update_bookmarklet">
        <h2>A new version of the Bookmarklet is available</h2>
        <p class="pb-4">
          You should update to the last version to benefit from an improved export.<br>
          All you need to do is to update your Bookmark in Chrome with the following JavaScript code:
          <a href="https://github.com/Minimalist3/GBF-Bookmarklet/raw/master/bookmarklet.min.js" target="_blank">bookmarklet.min.js</a>.
        </p>
      </div>
      <div v-else>
        <h2>What is this</h2>
        <p class="pb-4">
          Open a Party page in GBF and export the class, characters, summons and weapons here in a single click.
        </p>
        <h2>How to install</h2>
        <p class="pb-4">
          All you need is to create a new Bookmark in Chrome with the following JavaScript code:
          <a href="https://github.com/Minimalist3/GBF-Bookmarklet/raw/master/bookmarklet.min.js" target="_blank">bookmarklet.min.js</a>.
        </p>
      </div>

      <h2>More information</h2>
      <p class="pb-4">
        You can find the source code and a comprehensive Readme here:
        <a href="https://github.com/Minimalist3/GBF-Bookmarklet" target="_blank">GBF-Bookmarklet</a>.
      </p>
    </div>
    <div v-else></div>

    <!-- Usage -->
    <div class="bg-secondary self-center rounded p-4 mb-2" v-if="show_help">
      <h2>My Parties</h2>
      <p class="pb-4">
        By logging into your account, you can save and load as many parties as you want, then share the link to your friends.<br>
        Only you can modify your parties. When you click the Save button, people will automatically see the updated version.
      </p>
      <h2>The Edit checkbox</h2>
      <p class="pb-4">
        When the Edit checkbox is checked, you can add elements to your party.<br>
        Uncheck it to click on character skills and summons to add Actions.
      </p>
      <h2>Drag and Drop support</h2>
      <p class="pb-4">
        You can drag and drop character, summons and weapons to other slots.<br>
        If something is already at the destination, the two items will swap places.
      </p>
      <h2>Customize your party</h2>
      <p class="pb-4">
        Set the uncap level of your party by clicking on the stars.<br>
        You can set a Perpetuity Ring on each character by clicking on the lower right corner of the portrait.<br>
        Click on the lock icon of the weapon skills to select a skill key.
      </p>
    </div>

    <!-- My parties -->
    <my-parties @update-bookmarklet="updateBookmarklet()"></my-parties>

    <!-- Main layout -->
    <div class="flex flex-row flex-wrap justify-center items-start gap-2">
      <div class="flex flex-wrap justify-center items-center gap-2" :class="layout === 'compact' ? 'flex-col' : 'flex-row'">
        <div class="flex flex-row gap-2">
          <group-class></group-class>

          <group-characters :showLevel="show_level" :showRing="show_rings"></group-characters>
        </div>

        <group-summons :showLevel="show_level"></group-summons>
      </div>

      <hr v-if="layout === 'square'" class="w-full invisible">

      <group-weapons :showLevel="show_level" :showArcarum="arcarum_weapons"></group-weapons>

      <hr v-if="layout === 'wide'" class="w-full invisible">

      <!-- Tabs -->
      <span class="flex flex-col w-full self-stretch" :class="layout === 'wide' ? '' : 'md:w-128'">
        <div class="self-start flex flex-row flex-wrap border-primary border-b font-bold w-full">
          <a @click="show_tab = 0" class="px-4 py-2 text-primary cursor-pointer rounded-t whitespace-nowrap" :class="show_tab === 0 ? 'bg-secondary' : ''">Actions</a>
          <a @click="show_tab = 1" class="px-4 py-2 text-primary cursor-pointer rounded-t whitespace-nowrap" :class="show_tab === 1 ? 'bg-secondary' : ''">Stats</a>
          <a @click="show_tab = 2" class="px-4 py-2 text-primary cursor-pointer rounded-t whitespace-nowrap" :class="show_tab === 2 ? 'bg-secondary' : ''">Weapon Keys</a>
          <a @click="show_tab = 3" class="px-4 py-2 text-primary cursor-pointer rounded-t whitespace-nowrap" :class="show_tab === 3 ? 'bg-secondary' : ''">Description</a>
        </div>

        <!-- Tab actions -->
        <group-actions v-if="show_tab === 0" class="grow w-full md:w-128"></group-actions>        

        <!-- Tab stats -->
        <div v-else-if="show_tab === 1" class="grow">
          <group-party-stats></group-party-stats>
        </div>

        <!-- Tab Weapon Keys -->
        <div v-else-if="show_tab === 2" class="grow">
          <group-weapon-keys></group-weapon-keys>
        </div>

        <!-- Description -->
        <div v-else-if="show_tab === 3" class="grow">
          <group-description></group-description>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import Utils from '@/js/utils.js'

import Checkbox from '@/components/common/Checkbox.vue';
import Dropdown from '@/components/common/Dropdown.vue';

import GroupActions from '@/components/GroupActions.vue';
import GroupClass from "@/components/GroupClass.vue";
import GroupCharacters from "@/components/GroupCharacters.vue";
import GroupDescription from "@/components/GroupDescription.vue";
import GroupPartyStats from '@/components/GroupPartyStats.vue'
import GroupSummons from "@/components/GroupSummons.vue";
import GroupWeapons from "@/components/GroupWeapons.vue";
import GroupWeaponKeys from "@/components/GroupWeaponKeys.vue";
import MyParties from '@/components/Parties.vue';

const lsMgt = new Utils.LocalStorageMgt('PartyBuilder');

export default {
  components: {
    Checkbox,
    Dropdown,
    GroupActions,
    GroupClass,
    GroupDescription,
    GroupCharacters,
    GroupPartyStats,
    GroupSummons,
    GroupWeapons,
    GroupWeaponKeys,
    MyParties,    
  },
  head: {
    title: 'Granblue.Party - Party Builder',
    desc: 'Build and share Granblue Fantasy teams and grids with your friends.',
    image: 'https://www.granblue.party/img/card_party.jpg',
    keywords: 'party builder, team builder, grid, characters, summons, weapons, share, import, bookmarklet, damage calculator, OTK'
  },
  data() {
    return {
      show_help: false,
      show_level: true,
      show_rings: true,
      arcarum_weapons: false,
      show_tab: 3,
      layout: 'square',
    };
  },
  methods: {
    updateBookmarklet() {
      this.show_bookmarklet = true;
      this.show_update_bookmarklet = true;
    }
  },
  computed: {
    party_mode: {
      get() { return this.$store.state.party_builder.party_mode },
      set(value) { this.$store.commit('setPartyMode', value) }
    },
    show_bookmarklet: {
      get() { return this.$store.state.party_builder.show_bookmarklet },
      set(value) { this.$store.commit('setShowBookmarklet', value) }
    },
    // Edit BOOKMARKLET_VERSION to update required version
    show_update_bookmarklet: {
      get() { return this.$store.state.party_builder.show_update_bookmarklet },
      set(value) { this.$store.commit('setShowUpdateBookmarklet', value) }
    },
  },
  watch: {
    show_tab() {
      lsMgt.setValue('show_tab', this);
    },
    show_level() {
      lsMgt.setValue('show_level', this);
    },
    show_rings() {
      lsMgt.setValue('show_rings', this);
    },
    arcarum_weapons() {
      lsMgt.setValue('arcarum_weapons', this);
    },
    layout() {
      lsMgt.setValue('layout', this);
    },
  },
  mounted() {
    lsMgt.getValue(this, 'show_tab');
    lsMgt.getValue(this, 'show_level');
    lsMgt.getValue(this, 'show_rings');
    lsMgt.getValue(this, 'arcarum_weapons');
    lsMgt.getValue(this, 'layout');
    this.$store.commit('setPartyMode', this.$MODE.Edit);
  }
}
</script>