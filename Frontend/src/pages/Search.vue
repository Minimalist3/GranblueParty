<template>
  <div class="flex flex-col">
    <h1 class="self-center mb-8">Search</h1>

    <!-- Tabs -->
    <span class="flex flex-col w-full">
      <div class="self-start flex flex-row border-primary border-b font-bold w-full">
        <a @click="show_tab = 0" class="px-4 py-2 text-primary cursor-pointer rounded-t" :class="show_tab === 0 ? 'bg-secondary' : ''">Characters</a>
        <a @click="show_tab = 1" class="px-4 py-2 text-primary cursor-pointer rounded-t" :class="show_tab === 1 ? 'bg-secondary' : ''">Weapons</a>
        <a @click="show_tab = 2" class="px-4 py-2 text-primary cursor-pointer rounded-t" :class="show_tab === 2 ? 'bg-secondary' : ''">Summons</a>
      </div>

      <div v-if="show_tab === 0" class="flex-grow">
        <search-characters></search-characters>
      </div>
      <div v-if="show_tab === 1" class="flex-grow">
        <search-weapons></search-weapons>
      </div>
      <div v-if="show_tab === 2" class="flex-grow">
        <search-summons></search-summons>
      </div>
    </span>
  </div>
</template>

<script>
import SearchCharacters from '@/components/SearchCharacters.vue'
import SearchSummons from '@/components/SearchSummons.vue'
import SearchWeapons from '@/components/SearchWeapons.vue'

export default {
  components: {
    SearchCharacters,
    SearchSummons,
    SearchWeapons
  },
  head: {
    title: 'Granblue.Party - Search',
    desc: 'Search engine for character skills, weapon skills and summon effects',
    image: 'https://www.granblue.party/img/preview_search.png',
    keywords: 'search, characters, summons, weapons, skill'
  },
  data() {
    return {
      show_tab: -1,
    };
  },
}
</script>