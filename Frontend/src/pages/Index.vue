<template>
  <div>
    <h1>Granblue &#x1F389;</h1>
    <h2>Useful tools for Granblue Fantasy</h2>

    <!-- Center -->
    <div class="flex flex-col items-center mt-8">
      <ul class="flex flex-row mb-2">
        <li v-for="index in sections.length" :key="index">
          <a
            class="text-primary mr-2 py-1 px-2 rounded cursor-pointer"
            :class="index-1 === preview_index ? 'bg-tertiary' : 'bg-secondary'"
            @click="clickIndex(index-1)"
          >{{ index }}</a>
        </li>
      </ul>

      <div style="max-width: 600px" v-for="(section, index) in sections " :key="index">
        <div v-show="preview_index === index" @mouseenter="change_image = false" @mouseleave="change_image = true"  @mousedown="change_image = false" @mouseup="change_image = true">
          <h1>{{ section.title }}</h1>
          <router-link :to="section.link"><picture>
            <source v-if="section.webp" type="image/webp" :srcset="section.webp">
            <img :src="section.image">
          </picture></router-link>
          <div class="self-start bg-secondary mt-2 p-2 rounded" style="min-height: 8em" v-html="section.text"/>
        </div>
      </div>
    </div>
    
    <!-- About -->
    <div class="pt-16 flex flex-row flex-wrap justify-around">
      <div class="mb-4">
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

      <div class="mb-4">
        <h2 class="text-center">Last update</h2>
        <p><b>2021-06-18:</b> Lennah (Earth), Nehan</p>
      </div>

      <div>
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
        </ul>
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
`Check the Edit checkbox to add or remove elements from your party.
Uncheck it to use skills and summons.
You can share your team setup by saving it in your account, then clicking the "Share" button to copy the URL of the page.
Get <a href="https://github.com/Minimalist3/GBF-Bookmarklet" style="color: #209cee;">the bookmarklet</a> to load a GBF party in a single click.`
  },
  {
    title: 'My Collection',
    link: '/collection',
    image: '/img/preview_collection.png',
    text: 
`Create a free account to gain access to "My Collection".
Choose the characters and summons you own, then hit the "Save changes" button.
You can share your collection by clicking the "Share" button and giving the unique URL of the page to your friends.`
  },
  {
    title: 'Calculators',
    link: '/calcevoker',
    image: '/img/preview_calc.png',
    text:
`Choose what you want to unlock and get the complete list of materials needed to do it.
Each material has a link to the english wiki.
Your selection is memorized for when you want to come back.`
  },
  {
    title: 'Release Schedule',
    link: '/release',
    image: '/img/preview_release.png',
    text: 
`Browse previous releases of characters and summons, with custom filters.`
  },
  {
    title: 'Friend Summons',
    link: '/friendsum',
    image: '/img/preview_friendsum.png',
    webp: '/img/preview_friendsum.webp',
    text: 
`Set your friend summons and profile ID, then take a screenshot or share the link with your friends.`
  },
  {
    title: 'Daily Grind List',
    link: '/dailygrind',
    image: '/img/preview_dailygrind.png',
    text: 
`Create lists of raids and launch them one by one by pressing a single button.
All the raids will open in the same window, reducing the number of clicks needed to farm daily raids.`
  },
  {
    title: 'Room Name Generator',
    link: '/roomname',
    image: '/img/preview_roomname.png',
    text: 
`Generate a japanese co-op room name in a few clicks for the raid you want to host.`
  },
  {
    title: 'Spark Maker',
    link: '/spark',
    image: '/img/preview_spark.png',
    webp: '/img/preview_spark.webp',
    text: 
`Record the result of your Spark while drawing it, then share it with your friends.
You can search units by English, Japanese or Weapon name.
The result of your Spark can be directly added to your Collection.`
  },
]

export default {
  head: {
    title: 'Granblue.Party - Home',
  },
  data() {
    return {
      preview_index: 0,
      update_timer: null,
      change_image: true,
    }
  },
  methods: {
    changeIndex() {
      if (this.change_image === true) {
        if (this.preview_index < this.sections.length-1) {
          this.preview_index++;
        }
        else {
          this.preview_index = 0;
        }
      }
    },
    clickIndex(index) {
      this.preview_index = index;
      this.stopTimer();
      this.startTimer();
    },
    startTimer() {
      this.update_timer = setInterval(this.changeIndex, 3000);
    },
    stopTimer() {
      clearInterval(this.update_timer);
    }
  },
  computed: {
    sections() {
      return SECTIONS;
    }
  },
  mounted() {
    this.startTimer();
  },
  beforeDestroy() {
    this.stopTimer();
  }
}
</script>