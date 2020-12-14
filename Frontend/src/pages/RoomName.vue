<template>
  <div>
    <h1>Room Name Generator</h1>

    <div class="sticky top-0 bg-secondary shadow-md">
      <button class="btn btn-white mr-2" @click="clickCopyURL">
        <fa-icon :icon="['fas', 'share-alt']" class="text-xl"></fa-icon> Copy
      </button>
      Room name: <span lang="ja">{{ getRoomName }}</span>
    </div>

    <h2 class="py-4">General</h2>
    <div class="flex flex-col">
      <span><input class="input input-sm" type="number" min="1" style="width: 5ch;" v-model="train">-party train</span>
      <span>The room owner will host the specified battle <input class="input input-sm" type="number" min="1" style="width: 5ch;" v-model="times"> times</span>
      <span>Participants must be rank <input class="input input-sm" type="number" min="1" style="width: 6ch;" v-model="rank_higher"> or higher</span>
      <span>Participants must be rank <input class="input input-sm" type="number" min="1" style="width: 6ch;" v-model="rank_lower"> or below</span>
      <span><checkbox v-model="weak_owner">The room owner is weak and wants higher rank players to help him defeat the raid</checkbox></span>
      <span><checkbox v-model="firepower">The room owner wants firepower and welcomes DPS racers</checkbox></span>
    </div>

    <div v-for="content in getContent" :key="content.name">        
      <h2 class="py-4">{{ content.name }}</h2>

      <div v-for="(catVal, catKey) in content.data" :key="catKey" class="flex flex-col md:flex-row">
        <div class="self-center pr-4 whitespace-nowrap">{{ catVal.name }}</div>

        <div class="flex flex-row flex-wrap select-none">
          <a v-for="(raidVal, raidKey) in catVal.raids"
              :key="raidKey"
              @click="current_raid = raidVal.namejp"
              class="p-1 cursor-pointer"
          >
            <div
              class="p-2 rounded flex flex-col items-center"
              :class="current_raid == raidVal.namejp ? 'bg-inverse text-inverse' : 'bg-secondary text-primary hover:bg-tertiary hover:text-primary'"
            >{{ raidVal.name }}</div>
          </a>
        </div>
      </div>
    </div>

    <div class="py-4">
      More terms can be found on
      <a href="https://gbf.wiki/Co-op_Terms" target="_blank">gbf.wiki/Co-op_Terms
        <fa-icon :icon="['fas', 'external-link-alt']" class="text-sm"></fa-icon>
      </a>.
    </div>

    <!-- Clipboard -->
    <input v-show="clipboard_text.length > 0" id="clipboardInput" readonly type="text" :value="clipboard_text">
  </div>
</template>

<script>
import Raids from '@/js/raids.js'

import Checkbox from '@/components/common/Checkbox.vue'

function replaceNumber(number) {
  return number.toString(10).replace(/[0123456789]/g, m => {
    return {
        '0': '０',
        '1': '１',
        '2': '２',
        '3': '３',
        '4': '４',
        '5': '５',
        '6': '６',
        '7': '７',
        '8': '８',
        '9': '９'        
    }[m];
  });
}

function filterContent(data) {
  return Object.values(data).flatMap(cat => {
      const res = {
        name: cat.name,
        raids: Object.values(cat.raids).flatMap(raid => {
          if (raid.namejp) {
            return {
              name: raid.name,
              namejp: raid.namejp
            }
          }
          return []
        })
      }
      return (res.raids.length > 0) ? res : [];
    });
}

const CONTENT = [
  { name: 'Standard Raids', data: filterContent(Raids.CAT_STANDARD) },
  { name: 'Impossible Raids', data: filterContent(Raids.CAT_IMPOSSIBLE) },
];

export default {
  components: {
    Checkbox
  },
  head: {
    title: 'Granblue.Party - Room Name Generator',
    desc: 'Create the japanese name of the co-op room you want to host',
    image: 'https://www.granblue.party/img/preview_roomname.png',
    keywords: 'raid, raids, host, coop, train, ubaha, lucifaa, japanese, kanji'
  },
  data() {
    return {
      current_raid: '',
      train: '',
      times: '',
      rank_higher: '',
      rank_lower: '',
      weak_owner: false,
      firepower: false,
      clipboard_text: ''
    }
  },
  methods: {
    clickCopyURL() {
      this.clipboard_text = this.getRoomName;

      let self = this;
      this.$nextTick().then(_ => {
        const input = document.getElementById("clipboardInput");
        input.select();
        document.execCommand("copy");
        self.clipboard_text = '';

        self.$store.dispatch('addMessage', {message: 'Message copied to clipboard'})
      });
    }
  },
  computed: {
    getContent() {
      return CONTENT;
    },
    getRoomName() {
      let result = this.current_raid;

      if (this.train.length > 0) {
        result += ' ' + replaceNumber(this.train) + '連';
      }
      if (this.times.length > 0) {
        result += ' ' + replaceNumber(this.times) + '回';
      }
      if (this.rank_higher.length > 0) {
        result += ' ' + replaceNumber(this.rank_higher) + '↑';
      }
      if (this.rank_lower.length > 0) {
        result += ' ' + replaceNumber(this.rank_lower) + '↓';
      }
      if (this.weak_owner) {
        result += ' 主弱';
      }
      if (this.firepower) {
        result += ' 火力';
      }

      return result;
    }
  }
}
</script>