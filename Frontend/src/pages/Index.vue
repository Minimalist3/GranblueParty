<template>
  <div>
    <section class="hero is-black" style="background-color: #000;">
      <div class="hero-head">
        <div class="container">
          <h1 class="title">
            Granblue Fantasy Party Builder
          </h1>
          <h2 class="subtitle">
            Not motocal <span class="is-size-7">yet...</span>
          </h2>
        </div>
      </div>

      <div class="hero-body">
        <nav class="pagination is-rounded is-small" role="navigation" aria-label="pagination">
          <ul class="pagination-list" style="justify-content: center;">
            <li v-for="index in MAX_INDEX" :key="index">
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
          <!-- 0 -->
          <div class="tile is-vertical index-menu-box" v-show="preview_index === 0" :key="0">
            <div>
              <router-link to="/builder"><img src="@/img/preview_party.jpg"></router-link>
              <h1 class="title is-unselectable has-text-light">Party Builder</h1>
            </div>
            <div>
              Check the Edit checkbox to add or remove elements from your party.
              Uncheck it to use skills and summons.
              You can share your team setup by saving it in your account, then clicking the "Share" button to copy the URL of the page.
              Get <a href="https://github.com/Minimalist3/GBF-Bookmarklet">the bookmarklet</a> to load a GBF party in a single click.
            </div>
          </div>

          <!-- 1 -->
          <div class="tile is-vertical index-menu-box" v-show="preview_index === 1" :key="1">
            <div>
              <router-link to="/collection"><img src="@/img/preview_collection.jpg"></router-link>
              <h1 class="title is-unselectable has-text-light">My Collection</h1>                
            </div>
            <div>
              Create a free account to gain access to "My Collection".
              Choose the characters and summons you own, then hit the "Save changes" button.
              You can share your collection by clicking the "Share" button and giving the unique URL of the page to your friends.
            </div>
          </div>
          
          <!-- 2 -->
          <div class="tile is-vertical index-menu-box" v-show="preview_index === 2" :key="2">
            <div>
              <router-link to="/calcevoker"><img src="@/img/preview_calc.jpg"></router-link>
              <h1 class="title is-unselectable has-text-light">Calculators</h1>
            </div>
            <div>
              Choose what you want to unlock and get the complete list of materials needed to do it.
              Each material has a link to the english wiki.
              Your selection is memorized for when you want to come back.
            </div>
          </div>
          
          <!-- 3 -->
          <div class="tile is-vertical index-menu-box" v-show="preview_index === 3" :key="3">
            <div>
              <router-link to="/release"><img src="@/img/preview_release.jpg"></router-link>
              <h1 class="title is-unselectable has-text-light">Release Schedule</h1>
            </div>
            <div>
              Browse previous releases of characters and summons, with custom filters.
            </div>
          </div>

          <!-- 4 -->
          <div class="tile is-vertical index-menu-box" v-show="preview_index === 4" :key="4">
            <div>
              <router-link to="/friendsum"><img src="@/img/preview_friendsum.jpg"></router-link>
              <h1 class="title is-unselectable has-text-light">Friend Summons</h1>
            </div>
            <div>
              Set your friend summons and profile ID, then take a screenshot or share the link with your friends.
            </div>
          </div>
          
          <!-- 5 -->
          <div class="tile is-vertical index-menu-box" v-show="preview_index === 5" :key="5">
            <div>
              <router-link to="/dailygrind"><img src="@/img/preview_dailygrind.jpg"></router-link>
              <h1 class="title is-unselectable has-text-light">Daily Grind List</h1>
            </div>
            <div>
              Create lists of raids and launch them one by one by pressing a single button.
              All the raids will open in the same window, reducing the number of clicks needed to farm daily raids.
            </div>
          </div>
        </div>
      </div>

    </section>

    <section class="section">
      <div class="tile is-ancestor">
        <div class="tile is-vertical">
          <div class="tile is-parent">
            <div class="tile is-child is-8">
              <h1 class="title has-text-light">Changelog</h1>
              <p class="content">
                <b>Last update:</b> Nobiyo 4* (2019-09-12)
              </p>
              <ul>
                <li>2019-08-30: Wide layout for Party Builder. The Details tab hides an experimental damage calculator</li>
                <li>2019-08-11: Support for Skill Keys and Perpetuity Rings added in Party Builder.</li>
                <li>2019-08-06: Save and load parties with your account. No need for PermaURL anymore!</li>
                <li>2019-07-26: Drag and drop support in Party Builder</li>
                <li>2019-07-22: New feature: Share Friend Summons</li>
                <li>2019-07-17: New feature: Guild Wars tokens calculator</li>
                <li>2019-07-16: New feature: bookmarklet to load a GBF party to the party builder</li>
                <li>2019-07-12: New feature: release schedule. Unit titles now link to the wiki</li>
                <li>2019-07-11: Collection tracker can show SR and R characters. Click the first star to toggle it</li>
                <li>2019-06-25: New filter for collection, by draw origin</li>
                <li>2019-06-14: New features: Accounts and Collection</li>
                <li>2019-05-21: Display weapon skills</li>
                <li>2019-05-17: Display uncap stars. They aren't saved in the PermaURL yet</li>
              </ul>
            </div>

            <div class="tile is-vertical">
              <div class="tile is-child">
                <h1 class="title has-text-light">Social</h1>
                <img src="/src/img/email.png" class="valign-img"> contact [at] granblue.party
                <br>
                <a href="https://twitter.com/GranblueParty" target="_blank">
                  <img src="/src/img/twitter.png" class="valign-img">
                  @GranblueParty
                </a>
                <br>
                <a href="https://github.com/Minimalist3/GranblueParty" target="_blank">
                  <img src="/src/img/github.png" class="valign-img">
                  Minimalist3/GranblueParty
                </a>
              </div>

              <div class="tile is-child">
                <h1 class="title has-text-light">Links</h1>
                GBF subreddit: <a href="https://reddit.com/r/Granblue_en" target="_blank">/r/Granblue_en</a><br>
                GBF English Wiki: <a href="https://gbf.wiki" target="_blank">gbf.wiki</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      preview_index: 0,
      MAX_INDEX: 6,
      update_timer: null,
    }
  },
  methods: {
    changeIndex() {
      if (this.preview_index < this.MAX_INDEX-1) {
        this.preview_index++;
      }
      else {
        this.preview_index = 0;
      }
    },
    clickIndex(index) {
      this.preview_index = index;
      clearInterval(this.update_timer);
      this.update_timer = setInterval(this.changeIndex, 3000);
    }
  },
  created() {
    this.update_timer = setInterval(this.changeIndex, 3000);
  },
  beforeDestroy() {
    clearInterval(this.update_timer);
  }
}
</script>

<style scoped>
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
