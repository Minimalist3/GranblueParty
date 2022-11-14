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
        <h3 class="text-center">2022-10-31</h3>
        <p class="text-center mt-2">Yuel and Societte, Alliah</p>
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

    <!-- Sections -->
    <div class="flex flex-row flex-wrap justify-center mt-8 gap-8">

      <div v-for="(section, index) in sections " :key="index" class="flex flex-row sm:w-2/5 lg:w-1/4 bg-secondary rounded px-2 py-2">
        <img :src="'/img/index' + section.link + '.jpg'" width="48px" class="self-start mt-2 mr-2">

        <div>
          <router-link :to="section.link">
            <h2>{{ section.title }}</h2>
          </router-link>

          <div class="mt-2 text-sm" v-html="section.text"/>
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
    text: 
`Share your team setups with your friends.
Get <a href="https://github.com/Minimalist3/GBF-Bookmarklet">the bookmarklet</a> to load an existing party in a single click.`
  },
  {
    title: 'My Collection',
    link: '/collection',
    text: 
`Keep a list of your characters and summons and share it with your friends.
You can track the uncap and awakening level of each unit.`
  },
  {
    title: 'Public Teams',
    link: '/teams',
    text: 
`Browse public teams made by fellow players, and share your own.`
  },  
  {
    title: 'Eternals Calculator',
    link: '/calceternal',
    text:
`Keep track of the materials needed to unlock each step of each Eternal.
Everything is memorized for when you want to come back.`
  },
  {
    title: 'Evokers Calculator',
    link: '/calcevoker',
    text:
`Keep track of the materials needed to unlock each step of each Evoker.
Everything is memorized for when you want to come back.`
  },
  {
    title: 'Spark Maker',
    link: '/spark',
    text: 
`Record your Spark while drawing it, share it with your friends, then add it to your Collection.
You can search units by English, Japanese or Weapon name.`
  },
  {
    title: 'Guild Wars tokens Calculator',
    link: '/calcgw',
    text: 
`Calculate how many tickets you need to get a given number of boxes.`
  },
  {
    title: 'Daily Grind List',
    link: '/dailygrind',
    text: 
`Create lists of raids and launch them by pressing a single button.
All the raids will open in the same window, speeding up your daily farm.`
  },
  {
    title: 'Friend Summons',
    link: '/friendsum',
    text: 
`Share your friend summons and profile ID with a handy link.`
  },
  {
    title: 'Room Name Generator',
    link: '/roomname',
    text: 
`Generate a japanese co-op room name for the raid you want to host.`
  },
  {
    title: 'Replicard Sandbox Maps',
    link: '/replicard',
    text: 
`Maps of the Replicard Sandbox, with loot and progress for each node.`
  },
  {
    title: 'Search',
    link: '/search',
    text: 
`A search engine for the characters, summons and weapons of the site.`
  },
  {
    title: 'Release Schedule',
    link: '/release',
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