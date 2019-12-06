<template>
  <div class="flex flex-col">
    <!-- Options -->
    <div class="flex flex-row flex-wrap items-center mb-4">
      <button 
        class="btn mr-2"
        :class="show_bookmarklet ? 'btn-blue' : 'btn-white'"
        @click="show_bookmarklet = ! show_bookmarklet; show_help = false"
      >
        <fa-icon :icon="['fas', 'info-circle']" class="text-xl"></fa-icon> Get Export Bookmarklet
      </button>

      <button
        class="btn mr-4"
        :class="show_help ? 'btn-blue' : 'btn-white'"
        @click="show_help = ! show_help; show_bookmarklet = false"
      >
        <fa-icon :icon="['fas', 'info-circle']" class="text-xl"></fa-icon> Usage
      </button>

      <label class="mr-4">
        <span class="mr-1">Layout</span>
        <dropdown v-model="layout">
          <option value="square">Square</option>
          <option value="wide">Wide</option>
        </dropdown>
      </label>

      <checkbox class="mr-4" v-model="edit_mode">Edit</checkbox>

      <checkbox v-model="show_level">Show level</checkbox>
    </div>

    <!-- Bookmarklet -->
    <div class="bg-secondary rounded p-4 mb-2" v-if="show_bookmarklet">
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

    <!-- Usage -->
    <div class="bg-secondary rounded p-4 mb-2" v-if="show_help">
      <h2>My Parties</h2>
      <p class="pb-4">
        By logging into your account, you can save and load as many parties as you want, then share the link to each one with your friends.<br>
        Only you can modify your parties. When you click the Update button, people will automatically see the updated version.
      </p>
      <h2>The Edit checkbox</h2>
      <p class="pb-4">
        When the Edit checkbox is checked, you can add elements to your party.<br>
        Uncheck it to click on character skills and summons.
      </p>
      <h2>Drag and Drop support</h2>
      <p class="pb-4">
        You can drag and drop character, summons and weapons to other slots.<br>
        If something is already at the destination, the two items will swap places.<br>
        You can also hold the Ctrl key while before dropping to duplicate the item instead.
      </p>
      <h2>Customize your party</h2>
      <p class="pb-4">
        Set the uncap level of your party by clicking of the stars.<br>
        You can set a Perpetuity Ring on each character by clicking on the lower right corner of the portrait.<br>
        Click on the lock icon of the weapon skills to select a skill key.
      </p>
      <!--<h2>Copy PermaURL (deprecated)</h2>
      <p class="pb-4">
        You can share your team setup by clicking the "Copy PermaURL" button and copying the URL of the page.<br>
        This feature will be removed in the coming months, to be replaced by "My Parties".
      </p>-->
    </div>

    <!-- My parties -->
    <my-parties @update-bookmarklet="updateBookmarklet()"></my-parties>

    <!-- Main layout -->
    <div class="flex flex-row flex-wrap">
      <group-class :editMode="edit_mode" class="pr-2"></group-class>

      <group-characters :objects="getCharacters" :editMode="edit_mode" :showLevel="show_level" class="pr-2"></group-characters>

      <group-summons :objects="getSummons" :editMode="edit_mode" :showLevel="show_level" class="pr-2"></group-summons>

      <hr v-if="layout === 'square'" class="w-full invisible mb-2">

      <group-weapons :objects="getWeapons" :editMode="edit_mode" :showLevel="show_level" class="pr-2"></group-weapons>

      <hr v-if="layout === 'wide'" class="w-full invisible">

      <!-- Tabs -->
      <span class="flex flex-col" :class="layout === 'square' ? 'w-128' : 'w-full'">
        <div class="self-start flex flex-row border-primary border-b font-bold" :class="layout === 'square' ? 'w-128' : 'w-full'">
          <a @click="show_tab = 0" class="px-4 py-2 text-primary cursor-pointer rounded-t" :class="show_tab === 0 ? 'bg-secondary' : ''">Actions</a>
          <a @click="show_tab = 1" class="px-4 py-2 text-primary cursor-pointer rounded-t" :class="show_tab === 1 ? 'bg-secondary' : ''">Details</a>
        </div>

        <!-- Tab actions -->
        <group-actions v-if="show_tab === 0" class="flex-grow w-128"></group-actions>        

        <!-- Tab stats -->
        <div v-if="show_tab === 1" class="flex-grow">
          <party-details></party-details>          
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
import GroupSummons from "@/components/GroupSummons.vue";
import GroupWeapons from "@/components/GroupWeapons.vue";
import MyParties from '@/components/Parties.vue';
import PartyDetails from '@/components/PartyDetails.vue'

const lsMgt = new Utils.LocalStorageMgt('PartyBuilder');

export default {
  components: {
    Checkbox,
    Dropdown,
    GroupActions,
    GroupClass,
    GroupCharacters,
    GroupSummons,
    GroupWeapons,
    MyParties,
    PartyDetails
  },
  data() {
    return {
      show_bookmarklet: false,
      show_update_bookmarklet: false,
      show_help: false,
      edit_mode: true,
      show_level: true,
      show_tab: 0,
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
    getCharacters() {
      return this.$store.getters.getCharacters;
    },
    getSummons() {
      return this.$store.getters.getSummons;
    },
    getWeapons() {
      return this.$store.getters.getWeapons;
    },
  },
  watch: {
    show_tab() {
      lsMgt.setValue('show_tab', this);
    },
    show_level() {
      lsMgt.setValue('show_level', this);
    },
    layout() {
      lsMgt.setValue('layout', this);
    },
  },
  mounted() {
    lsMgt.getValue(this, 'show_tab');
    lsMgt.getValue(this, 'show_level');
    lsMgt.getValue(this, 'layout');
  }
}
</script>