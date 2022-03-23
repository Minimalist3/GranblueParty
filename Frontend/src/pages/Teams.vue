<template>
  <div class="flex flex-col flex-wrap gap-4 items-center">
    <h1>Public Teams
      <div class="text-sm">Beta version. More to come soon</div>
    </h1>

    <!-- Filters -->
    <div class="flex flex-row flex-wrap items-center gap-2">
      <label>
        Content
        <content-categories v-model.number="content_filter" :all="true" :showPrivateCategories="false"></content-categories>
      </label>

      <label>
        Element
        <dropdown v-model.number="element_filter">
          <option :value="-1">--- All ---</option>
          <option :value="0">Fire</option>
          <option :value="1">Wind</option>
          <option :value="2">Earth</option>
          <option :value="3">Water</option>
          <option :value="4">Light</option>
          <option :value="5">Dark</option>
        </dropdown>
      </label>

      <label>
        Age
        <dropdown v-model.number="age_filter">
          <option :value="-1">All time</option>
          <option :value="1">Today</option>
          <option :value="30">This month</option>
          <option :value="90">Last 3 months</option>
          <option :value="365">This year</option>
        </dropdown>
      </label>

      <button class="btn btn-blue" @click="fetchTeams()">Filter</button>
      <button class="btn btn-red" @click="clearFilters()">Reset</button>
    </div>

    <!-- Teams -->
    <div v-if="loading === true">
      Loading...
    </div>
    <div v-else-if="teams.length > 0" class="flex flex-col gap-y-4 items-center">
      <!-- Top nav -->
      <nav role="navigation" aria-label="pagination">
        <ul class="flex flex-row flex-wrap">
          <li v-for="i in Math.ceil(teams.length / slice_size)" :key="i">
            <a
              class="text-primary mr-2 py-1 px-2 rounded"
              :class="index === i-1 ? 'bg-tertiary cursor-default text-link-hover' : 'bg-secondary cursor-pointer'"
              @click="index = i-1"
            >{{i}}</a>
          </li>
        </ul>
      </nav>

      <!-- Teams -->
      <div class="flex flex-row flex-wrap gap-4 justify-center">
        <div v-for="(team, index) in getTeams" :key="index" class="flex flex-col bg-tertiary p-1 gap-y-1">
          <!-- Line 1 -->
          <div class="flex flex-row  justify-center px-1 relative">
            <div class="absolute left-0 text-sm">
              <img height="18" width="18" class="align-text-top" :src="'/img/e_' + getElementName(team.e).toLowerCase() + '.png'">
              {{ getElementName(team.e) }}
            </div>
            <div class="font-semibold text-center w-36 sm:w-72 truncate" :title="team.n">{{ team.n }}&nbsp;</div>
            <div class="absolute right-0">
              <fa-icon v-if="team.desc" :icon="['fas', 'file-lines']" class="pr-1 text-lg" title="Contains a description"></fa-icon>
            </div>
          </div>
          <!-- Line 2 -->
          <div class="grid grid-cols-3 px-1">
            <div class="flex items-center justify-start text-xs md:text-sm w-32 truncate"><fa-icon :icon="['fas', 'user']" class="pr-1"></fa-icon>{{ team.u }}</div>
            <span class="flex flex-row shrink justify-center">
              <div class="tag bg-secondary truncate" :title="content[team.c]">{{ content[team.c] }}</div>
            </span>
            <div class="flex items-center justify-end text-xs md:text-sm truncate"><fa-icon :icon="['fas', 'clock']" class="pr-1"></fa-icon>{{ getPrintableDate(team.d) }}</div>
          </div>
          <!-- Image -->
          <a :href="'/builder?p=' + team.id">
            <img
              :src="'/previews/party/party_' + team.id + '.' + team.d + '.jpg'"
              class="object-cover object-top"
              width="596"
              height="336"
              style=" aspect-ratio: 596 / 314;"
            >
          </a>
        </div>
      </div>

      <!-- Bottom nav -->
      <nav role="navigation" aria-label="pagination">
        <ul class="flex flex-row flex-wrap">
          <li v-for="i in Math.ceil(teams.length / slice_size)" :key="i">
            <a
              class="text-primary mr-2 py-1 px-2 rounded cursor-pointer"
              :class="index === i-1 ? 'bg-tertiary' : 'bg-secondary'"
              @click="index = i-1"
            >{{i}}</a>
          </li>
        </ul>
      </nav>

    </div>
    <div v-else>
      No results
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import ContentCategories from '@/components/common/ContentCategories.vue'
import Dropdown from '@/components/common/Dropdown.vue'

import Content from '@/js/content'
import teamsStoreMixin from '@/store/modules/teams'

export default {
  components: {
    ContentCategories,
    Dropdown
  },
  mixins: [
    teamsStoreMixin
  ],
  head: {
    title: 'Granblue.Party - Public Teams',
    desc: 'Browse public teams made by fellow players',
    image: 'https://www.granblue.party/img/card_index.jpg',
    keywords: 'Granblue Fantasy, GBF, Party, Teams, Public teams, Grid, Share'
  },
  data() {
    return {
      loading: true,
      now: this.getUTCnow(),
      content_filter: -1,
      element_filter: -1,
      age_filter: -1,
      index: 0,
    }
  },
  methods: {
    getUTCnow() {
      const date = new Date(); 
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    },
    getPrintableDate(origin) {
      const date = new Date(this.now - parseInt(origin, 10) * 1000);

      if (date.toUTCString() > 1970) {
        return 'A year ago';
      }
      if (date.getUTCMonth() === 1) {
        return 'One month ago';
      }
      if (date.getUTCMonth() > 1) {
        return date.getUTCMonth() + ' months ago';
      }
      if (date.getUTCDate() === 2) {
        return 'One day ago';
      }
      if (date.getUTCDate() > 2) {
        return (date.getUTCDate() - 1) + ' days ago';
      }
      if (date.getUTCHours() === 1) {
        return 'One hour ago';
      }
      if (date.getUTCHours() > 1) {
        return date.getUTCHours() + ' hours ago';
      }
      if (date.getUTCMinutes() > 1) {
        return date.getUTCMinutes() + ' minutes ago';
      }
      return 'Right now';
    },
    getElementName(element) {
      switch(element) {
        case 0:
          return "Fire";
        case 1:
          return "Wind";
        case 2:
          return "Earth";
        case 3:
          return "Water";
        case 4:
          return "Light";
        case 5:
          return "Dark";
        case 6:
          return "Any";
        default:
      }
      return "";
    },
    fetchTeams() {
      this.loading = true;
      this.index = 0;

      const params = {};
      if (this.content_filter >= 0) {
        params['c'] = this.content_filter;
      }
      if (this.element_filter >= 0) {
        params['e'] = this.element_filter;
      }
      if (this.age_filter >= 0) {
        params['t'] = this.age_filter;
      }

      this.$store.dispatch('teams/fetchTeams', params)
        .then(_ => this.loading = false);
    },
    clearFilters() {
      this.content_filter = -1;
      this.element_filter = -1;
      this.age_filter = -1;
      this.fetchTeams();
    }
  },
  computed: {
    ...mapState('teams', [
      'teams',
    ]),
    slice_size() {
      return 12;
    },
    content() {
      return Object.fromEntries(Content.flatMap(cat =>
        cat.content.map(entry =>
          [entry.id, entry.name])
        )
      );
    },
    getTeams() {
      return this.teams
        .slice(this.index * this.slice_size, this.index * this.slice_size + this.slice_size);
    },
  },
  serverPrefetch() {
    return this.$store.dispatch('teams/fetchTeams');
  },
  async mounted() {
    await this.$store.dispatch('teams/fetchTeams')
      .then(_ => {
        this.loading = false;
      });
  },
};
</script>