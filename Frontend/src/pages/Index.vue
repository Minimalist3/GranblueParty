<template>
  <div class="flex flex-col">
    <h1 class="self-center">Granblue <span title="Party">&#x1F389;</span></h1>
    <h2 class="self-center">Useful tools for Granblue Fantasy</h2>

    <!-- About -->
    <div class="pt-16 flex flex-row flex-wrap justify-evenly">
      <div class="mb-4 px-4 py-2 bg-secondary rounded">
        <h2 class="text-center">Social</h2>
        <ul>
          <li>
            <fa-icon :icon="['far', 'envelope']" class="text-primary text-lg"></fa-icon> contact [at] granblue.party
          </li>
          <li>
            <a href="https://twitter.com/GranblueParty" target="_blank">
              <fa-icon :icon="['fab', 'twitter']" class="text-primary text-lg"></fa-icon> @GranblueParty
              <fa-icon :icon="['fas', 'external-link-alt']" class="text-sm"></fa-icon>
            </a>
          </li>
          <li>
            <a href="https://github.com/Minimalist3/GranblueParty" target="_blank">
              <fa-icon :icon="['fab', 'github']" class="text-primary text-lg"></fa-icon> Minimalist3/GranblueParty
              <fa-icon :icon="['fas', 'external-link-alt']" class="text-sm"></fa-icon>
            </a>
          </li>
        </ul>        
      </div>

      <div class="mb-4 px-4 py-2 bg-secondary rounded">
        <h2 class="text-center">Last update</h2>
        <h3 class="text-center">2022-03-15</h3>
        <p class="text-center mt-2">Lyria 5*</p>
      </div>

      <div class="mb-4 px-4 py-2 bg-secondary rounded">
        <h2 class="text-center">Links</h2>
        <ul>
          <li>GBF subreddit:
            <a href="https://reddit.com/r/Granblue_en" target="_blank">
              /r/Granblue_en <fa-icon :icon="['fas', 'external-link-alt']" class="text-sm"></fa-icon>
            </a>
          </li>
          <li>GBF English Wiki:
            <a href="https://gbf.wiki" target="_blank">gbf.wiki
              <fa-icon :icon="['fas', 'external-link-alt']" class="text-sm"></fa-icon>
            </a>
          </li>
          <li>A nice Raid Finder:
            <a href="https://gbf.life" target="_blank">gbf.life
              <fa-icon :icon="['fas', 'external-link-alt']" class="text-sm"></fa-icon>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Center -->
    <div class="flex flex-col items-center">
      <!-- Sections -->
      <div class="flex flex-row flex-wrap justify-center mt-8 gap-8">

        <div v-for="(section, index) in sections " :key="index" class="relative sm:w-2/5 xl:w-1/4 bg-secondary rounded px-2 py-2">
          <h2 class="absolute top-2 left-2 bg-secondary pr-2 pb-2 rounded-br">{{ section.title }}</h2>

          <router-link :to="section.link">
            <picture>
              <source v-if="section.webp" type="image/webp" :srcset="section.webp">
              <img :src="section.image" class="w-full">
            </picture>
          </router-link>

          <div class="mt-2" v-html="section.text"/>
        </div>
      
      </div>
    </div>

  </div>
</template>

<script>
const SECTIONS = [
  {
    title: 'Party Builder',
    link: '/builder',
    image: '/img/preview_party.png',
    webp: '/img/preview_party.webp',
    text: 
`Share your team setups with your friends.
Get <a href="https://github.com/Minimalist3/GBF-Bookmarklet">the bookmarklet</a> to load an existing party in a single click.`
  },
  {
    title: 'My Collection',
    link: '/collection',
    image: '/img/preview_collection.png',
    webp: '/img/preview_collection.webp',
    text: 
`Keep a list of your characters and summons and share it with your friends.
You can track the uncap and awakening level of each unit.`
  },
  {
    title: 'Eternals Calculator',
    link: '/calceternal',
    image: '/img/preview_calceternal.png',
    webp: '/img/preview_calceternal.webp',
    text:
`Keep track of the materials needed to unlock each step of each Eternal.
Everything is memorized for when you want to come back.`
  },
  {
    title: 'Evokers Calculator',
    link: '/calcevoker',
    image: '/img/preview_calcevoker.png',
    webp: '/img/preview_calcevoker.webp',
    text:
`Keep track of the materials needed to unlock each step of each Evoker.
Everything is memorized for when you want to come back.`
  },
  {
    title: 'Spark Maker',
    link: '/spark',
    image: '/img/preview_spark.png',
    webp: '/img/preview_spark.webp',
    text: 
`Record your Spark while drawing it, share it with your friends, then add it to your Collection.
You can search units by English, Japanese or Weapon name.`
  },
  {
    title: 'Guild Wars tokens Calculator',
    link: '/calcgw',
    image: '/img/preview_calcgw.png',
    webp: '/img/preview_calcgw.webp',
    text: 
`Calculate how many tickets you need to get a given number of boxes.`
  },
  {
    title: 'Daily Grind List',
    link: '/dailygrind',
    image: '/img/preview_dailygrind.png',
    webp: '/img/preview_dailygrind.webp',
    text: 
`Create lists of raids and launch them by pressing a single button.
All the raids will open in the same window, speeding up your daily farm.`
  },
  {
    title: 'Friend Summons',
    link: '/friendsum',
    image: '/img/preview_friendsum.png',
    webp: '/img/preview_friendsum.webp',
    text: 
`Share your friend summons and profile ID with a handy link.`
  },
  {
    title: 'Room Name Generator',
    link: '/roomname',
    image: '/img/preview_roomname.png',
    webp: '/img/preview_roomname.webp',
    text: 
`Generate a japanese co-op room name for the raid you want to host.`
  },
  {
    title: 'Replicard Sandbox Maps',
    link: '/replicard',
    image: '/img/preview_replicard.png',
    webp: '/img/preview_replicard.webp',
    text: 
`Maps of the Replicard Sandbox, with loot and progress for each node.`
  },
  {
    title: 'Search',
    link: '/search',
    image: '/img/preview_search.png',
    webp: '/img/preview_search.webp',
    text: 
`A search engine for the characters, summons and weapons of the site.`
  },
  {
    title: 'Release Schedule',
    link: '/release',
    image: '/img/preview_release.png',
    webp: '/img/preview_release.webp',
    text: 
`Browse previous releases of characters and summons, with custom filters.`
  },
]

export default {
  head: {
    title: 'Granblue.Party - Home',
  },
  computed: {
    sections() {
      return SECTIONS;
    }
  },
}
</script>