<template>
  <div>
    <section class="hero is-black hero-style">
      <div class="hero-head">
        <div class="container">
          <h1 class="title">
            Granblue &#x1F389;
          </h1>
          <h2 class="subtitle">
            Useful tools for Granblue Fantasy
          </h2>
        </div>
      </div>

      <div class="hero-body">
        <nav class="pagination is-rounded is-small" role="navigation" aria-label="pagination">
          <ul class="pagination-list" style="justify-content: center;">
            <li v-for="index in sections.length" :key="index">
              <a
                class="pagination-link"
                :class="index-1 === preview_index ? 'is-current' : ''"
                :aria-label="index"
                @click="clickIndex(index-1)"
              >{{ index }}</a>
            </li>
          </ul>
        </nav>

        <br>
        
        <div class="container">
          <div class="tile is-vertical index-menu-box" v-show="preview_index === index" v-for="(section, index) in sections " :key="index">
            <div @mouseenter="change_image = false" @mouseleave="change_image = true"  @mousedown="change_image = false" @mouseup="change_image = true">
              <router-link :to="section.link"><img :src="section.image"></router-link>
              <h1 class="title is-unselectable has-text-light">{{ section.title }}</h1>
            </div>
            <div
              @mouseenter="change_image = false"
              @mouseleave="change_image = true"
              @mousedown="change_image = false"
              @mouseup="change_image = true"
              v-html="section.text"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="tile is-ancestor">
        <div class="tile is-parent">

          <div class="tile is-child">
            <h1 class="title has-text-light">Social</h1>
            <img src="/img/email.png" class="valign-img"> contact [at] granblue.party
            <br>
            <a href="https://twitter.com/GranblueParty" target="_blank">
              <img src="/img/twitter.png" class="valign-img">
              @GranblueParty
            </a>
            <br>
            <a href="https://github.com/Minimalist3/GranblueParty" target="_blank">
              <img src="/img/github.png" class="valign-img">
              Minimalist3/GranblueParty
            </a>
          </div>

          <div class="tile is-child">
            <h1 class="title has-text-light">Last update</h1>
            <p class="content">
              <b>2019-11-30:</b> Magisa, Meteon
            </p>
          </div>

          <div class="tile is-child">
            <h1 class="title has-text-light">Links</h1>
            GBF subreddit: <a href="https://reddit.com/r/Granblue_en" target="_blank">/r/Granblue_en</a><br>
            GBF English Wiki: <a href="https://gbf.wiki" target="_blank">gbf.wiki</a>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
const SECTIONS = [
  {
    title: 'Party Builder',
    link: '/builder',
    image: '/img/preview_party.jpg',
    text: 
`Check the Edit checkbox to add or remove elements from your party.
Uncheck it to use skills and summons.
You can share your team setup by saving it in your account, then clicking the "Share" button to copy the URL of the page.
Get <a href="https://github.com/Minimalist3/GBF-Bookmarklet" style="color: #209cee;">the bookmarklet</a> to load a GBF party in a single click.`
  },
  {
    title: 'My Collection',
    link: '/collection',
    image: '/img/preview_collection.jpg',
    text: 
`Create a free account to gain access to "My Collection".
Choose the characters and summons you own, then hit the "Save changes" button.
You can share your collection by clicking the "Share" button and giving the unique URL of the page to your friends.`
  },
  {
    title: 'Calculators',
    link: '/calcevoker',
    image: '/img/preview_calc.jpg',
    text: 
`Choose what you want to unlock and get the complete list of materials needed to do it.
Each material has a link to the english wiki.
Your selection is memorized for when you want to come back.`
  },
  {
    title: 'Release Schedule',
    link: '/release',
    image: '/img/preview_release.jpg',
    text: 
`Browse previous releases of characters and summons, with custom filters.`
  },
  {
    title: 'Friend Summons',
    link: '/friendsum',
    image: '/img/preview_friendsum.jpg',
    text: 
`Set your friend summons and profile ID, then take a screenshot or share the link with your friends.`
  },
  {
    title: 'Daily Grind List',
    link: '/dailygrind',
    image: '/img/preview_dailygrind.jpg',
    text: 
`Create lists of raids and launch them one by one by pressing a single button.
All the raids will open in the same window, reducing the number of clicks needed to farm daily raids.`
  },
]

export default {
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
  created() {
    this.startTimer();
  },
  beforeDestroy() {
    this.stopTimer();
  }
}
</script>

<style scoped>
.hero-style {
  background-color: #000;
  padding-top: 1.5em;
}

.index-menu-box {
  margin-right: 10px !important;
}

.index-menu-box > div {
  margin-left: auto;
  margin-right: auto;
}

.index-menu-box div:first-child {
  position: relative;
}

.index-menu-box div:first-child > h1 {
  position: absolute;
  top: 8px; left: 16px;
  text-shadow: #000 0 0 10px;
}

.index-menu-box div:nth-child(2) {
  min-height: 7.5em;
  max-width: 600px;
}
</style>
