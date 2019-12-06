<template>
  <div>
    <h1>Daily Grind Lists</h1>

    <!-- Top bar -->
    <div class="flex flex-row flex-wrap py-2">
      <button class="btn mr-2" :class="show_help ? 'btn-blue' : 'btn-white'" @click="show_help = ! show_help">
        <fa-icon :icon="['fas', 'info-circle']" class="text-xl"></fa-icon> Usage
      </button>
      
      <checkbox class="mr-2" v-model="isMagfes">MagnaFest</checkbox>

      <checkbox class="mr-2" v-model="editMode">Edit mode</checkbox>

      <checkbox class="mr-2" v-model="renameLists">Rename lists</checkbox>
    </div>

    <!-- Usage -->
    <div class="bg-secondary rounded p-4 mb-2" v-if="show_help">
      <h2>Launch Raids</h2>
      <p class="pb-4">
        From the "All Content" tab, you can click on any raid to launch it directly in the Granblue Fantasy Tab.
        Keep this tab open, all the raids will open in the same one.<br>
        From the "My List" tab, simply click on "Launch Raid" to start the first raid on the list.
        Click again to start the next one, until the list is empty.<br>
        You can then click on "Reset" to display the whole list again.
      </p>
      <h2>Edit Mode</h2>
      <p class="pb-4">
        Enable Edit Mode to add raids to a list. From the "All Content" tab, click on each raid you want to add to the list.
        The order of the raid in the list in shown on the left of each box.
      </p>
      <h2>List managment</h2>
      <p class="pb-4">
        You can manage multiple lists with different raids in each. Simply select the one you want to use.
        Lists can be created, renamed or deleted. Clicking the "Save All" button saves all the lists at once.
      </p>
    </div>    

    <div v-if="isUserLogged">
      <div class="flex flex-row flex-wrap items-center">
        <dropdown v-model.number="listIndex" class="w-64">
          <option v-for="(list, index) in myLists" :key="index" :value="index">{{ list.name }}</option>
        </dropdown>
        <div class="absolute" v-if="renameLists">
          <input class="input border-none focus:shadow-none ml-1" style="width: 14rem;" type="text" placeholder="Default list" v-model="currentListName">
        </div>

        <button class="btn btn-blue ml-2" @click="clickListSave()">
          <fa-icon :icon="['fas', 'save']" class="text-xl"></fa-icon> Save All
        </button>

        <button class="btn btn-blue ml-2" @click="clickListNew()">
          <fa-icon :icon="['fas', 'file']" class="text-xl"></fa-icon> New List
        </button>

        <button class="btn btn-red ml-2" :disabled="listIndex === 0" @click="clickListDelete()">
          <fa-icon :icon="['fas', 'trash']" class="text-xl"></fa-icon> Delete List
        </button>

        <p class="pl-4 self-center">
          {{ saveMessage }}
        </p>        
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex flex-row border-primary border-b pt-4 font-bold">
      <a @click="showTab = 0" class="px-4 py-2 text-primary cursor-pointer rounded-t" :class="showTab === 0 ? 'bg-secondary' : ''">All Content</a>
      <a @click="showTab = 1" class="px-4 py-2 text-primary cursor-pointer rounded-t" :class="showTab === 1 ? 'bg-secondary' : ''">My List</a>
    </div>

    <!-- All Content tab -->
    <div v-if="showTab === 0">
      <div v-for="content in getContent" :key="content.name">
        
        <h2 class="py-4">{{ content.name }}</h2>

        <div v-for="(catVal, catKey) in content.data" :key="catKey" class="flex flex-row">

          <div class="flex flex-col pr-4 whitespace-no-wrap">
            {{ catVal.name }}
            <span v-if="catVal.times !== undefined" class="flex flex-row">
              <span class="tag bg-tertiary mr-1">x{{ catVal.times }}</span>
              <span class="tag bg-tertiary">{{ isMagfes ? catVal.magfes : catVal.cost }} AP</span>
            </span>
          </div>

          <div class="flex flex-row flex-wrap select-none py-1">
            <a v-for="(raidVal, raidKey) in catVal.raids"
               :key="raidKey"
               @click="clickRaid(raidKey)"
               class="p-1 cursor-pointer"
            >
              <div class="p-4 rounded flex flex-col items-center bg-secondary text-primary hover:bg-tertiary">
                <span>
                  <span
                    v-if="editMode"
                    class="tag inline-block text-inverse" style="min-width: 1.5rem"
                    :class="getIndex(raidKey) >= 0 ? 'bg-inverse' : 'bg-tertiary'"
                  >{{ getIndexString(raidKey) }}</span>
                  <img v-if="raidVal.icon" :src="'/img/item/' + raidVal.icon + '.jpg'" style="max-height: 25px; max-width: 25px;">
                  {{ raidVal.name }}
                </span>
                <span v-if="raidVal.times" class="flex flex-row">
                  <span class="tag bg-tertiary mr-1">x{{ raidVal.times }}</span>
                  <span class="tag bg-tertiary">{{ isMagfes ? raidVal.magfes : raidVal.cost }} AP</span>
                </span>                
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- My List tab -->
    <div v-if="showTab === 1" class="flex flex-col mt-4">
      <span class="font-semibold">AP needed: {{ getTotalAP }}</span>      

      <div class="flex flex-row flex-wrap my-4">
        <button class="btn btn-white mr-2" @click="undoRaid()">Undo</button>
        <button class="btn btn-blue mr-2" @click="launchRaid()">Launch Raid</button>
        <button class="btn btn-white" @click="skipRaid()">Skip</button>
      </div>

      <span v-for="raid in currentList.slice(raidIndex)" :key="raid.id" class="mb-1">
        <span class="tag bg-inverse text-inverse">x{{ raid.remaining }}</span>
        <img v-if="raid.icon" :src="'/img/item/' + raid.icon + '.jpg'" class="vcenter-img" style="max-height: 25px; max-width: 25px;">
        {{ raid.name }}
        <span class="tag bg-tertiary">{{ getCategories[raid.category].name }}</span>
        <br>
      </span>

      <span class="mt-4">
        <button class="btn btn-white" @click="resetRaid()">Reset</button>
      </span>
    </div>

  </div>
</template>

<script>
import Utils from '@/js/utils.js'

import Checkbox from '@/components/common/Checkbox.vue'
import Dropdown from '@/components/common/Dropdown.vue'

const lsMgt = new Utils.LocalStorageMgt('DailyGrind');

// Standard raids
const catStandard = {
  30: {
    name: 'Hard',
    stars: 3,
    cost: 15,
    magfes: 0,
    times: 3,
    raids: {
      '300041/1': {
        name: 'Tiamat',
      },
      '300091/1': {
        name: 'Colossus',
      },
      '300151/1': {
        name: 'Leviathan',
      },
      '300191/1': {
        name: 'Yggdrasil',
      },
      '300221/1': {
        name: 'Luminiera',
      },
      '300251/1': {
        name: 'Celeste',
      },
    }
  },
  31: {
    name: 'Hard +',
    stars: 3,
    cost: 45,
    magfes: 0,
    times: 1,    
    raids: {
      '305011/1': {
        name: 'Tiamat',       
      },
      '305021/1': {
        name: 'Colossus',       
      },
      '305031/1': {
        name: 'Leviathan',       
      },
      '305041/1': {
        name: 'Yggdrasil',       
      },
      '305051/1': {
        name: 'Luminiera',       
      },
      '305061/1': {
        name: 'Celeste',       
      },
    },
  },
  40: {
    name: 'Omega',
    stars: 4,
    cost: 30,
    magfes: 15,
    times: 3,
    raids: {
      '300051/1/0/18': {
        name: 'Tiamat',        
      },
      '300101/1/0/19': {
        name: 'Colossus',        
      },
      '300161/1/0/20': {
        name: 'Leviathan',
      },
      '300261/1/0/21': {
        name: 'Yggdrasil',        
      },
      '300271/1/0/26': {
        name: 'Luminiera',        
      },
      '300281/1/0/31': {
        name: 'Celeste',        
      },
    }
  },
  41: {
    name: 'Omega+',
    stars: 4,
    cost: 90,
    magfes: 45,
    times: 1,
    raids: {
      '305081/1/0/18': {
        name: 'Tiamat',        
      },
      '305091/1/0/19': {
        name: 'Colossus',        
      },
      '305101/1/0/20': {
        name: 'Leviathan',
      },
      '305111/1/0/21': {
        name: 'Yggdrasil',        
      },
      '305121/1/0/26': {
        name: 'Luminiera',        
      },
      '305131/1/0/31': {
        name: 'Celeste',        
      },
    }
  },
  50: {
    name: 'Tier 1 Summon',
    stars: 5,
    cost: 40,
    magfes: 20,
    times: 2,
    raids: {
      '300411/1/0/1313': {
          name: 'Twin Elements',
          icon: 'infernalwhorl',
      },
      '300411/1/0/1111': {
          name: 'Twin Elements',
          icon: 'reddragonscale',
      },
      '300381/1/0/1323': {
          name: 'Macula M.',
          icon: 'tidalwhorl',
      },
      '300381/1/0/1121': {
          name: 'Macula M.',
          icon: 'bluedragonscale',
      },
      '300391/1/0/1333': {
          name: 'Medusa',
          icon: 'seismicwhorl',
      },
      '300391/1/0/1131': {
          name: 'Medusa',
          icon: 'browndragonscale',
      },
      '300421/1/0/1343': {
          name: 'Nezha',
          icon: 'tempestwhorl',
      },
      '300421/1/0/1141': {
          name: 'Nezha',
          icon: 'greendragonscale',
      },
      '300431/1/0/1353': {
          name: 'Apollo',
          icon: 'radiantwhorl',
      },
      '300431/1/0/1151': {
          name: 'Apollo',
          icon: 'whitedragonscale',
      },
      '300401/1/0/1363': {
          name: 'D.A.Olivia',
          icon: 'umbralwhorl',
      },
      '300401/1/0/1161': {
          name: 'D.A.Olivia',
          icon: 'blackdragonscale',
      },
    }
  },
  60: {
    name: 'Tier 2 Summon',
    stars: 6,
    cost: 40,
    magfes: 20,
    times: 2,
    raids: {
      '301071/1/0/1313': {
          name: 'Athena',
          icon: 'infernalwhorl',
      },
      '301071/1/0/1111': {
          name: 'Athena',
          icon: 'reddragonscale',
      },
      '300481/1/0/1323': {
          name: 'Grani',
          icon: 'tidalwhorl',
      },
      '300481/1/0/1121': {
          name: 'Grani',
          icon: 'bluedragonscale',
      },
      '301371/1/0/1333': {
          name: 'Baal',
          icon: 'seismicwhorl',
      },
      '301371/1/0/1131': {
          name: 'Baal',
          icon: 'browndragonscale',
      },
      '301381/1/0/1343': {
          name: 'Garuda',
          icon: 'tempestwhorl',
      },
      '301381/1/0/1141': {
          name: 'Garuda',
          icon: 'greendragonscale',
      },
      '300461/1/0/1353': {
          name: 'Odin',
          icon: 'radiantwhorl',
      },
      '300461/1/0/1151': {
          name: 'Odin',
          icon: 'whitedragonscale',
      },
      '300551/1/0/1363': {
          name: 'Lich',
          icon: 'umbralwhorl',
      },
      '300551/1/0/1161': {
          name: 'Lich',
          icon: 'blackdragonscale',
      },
    }
  },
  70: {
    name: 'Nightmare',
    stars: 7,
    raids: {
      '300291/1/0/58': {
          name: 'Proto Bahamut',
          cost: 80,
          magfes: 40,
          times: 3,
      },
      '301051/1/0/82': {
          name: 'Grand Order',
          cost: 80,
          magfes: 40,
          times: 2,
      },
      '301671/1/0/6005': {
          name: 'Huanglong',
          cost: 80,
          magfes: 40,
          times: 1,
      },
      '301681/1/0/6005': {
          name: 'Qilin',
          cost: 80,
          magfes: 40,
          times: 1,
      },
    }
  },
  80: {
    name: 'Primarch',
    stars: 8,
    cost: 50,
    magfes: 25,
    times: 1,
    raids: {
      '303101/1/0/5311': {
        name: 'Michael',
      },
      '303091/1/0/5321': {
        name: 'Gabriel',
      },
      '303111/1/0/5331': {
        name: 'Uriel',
      },
      '303081/1/0/5341': {
        name: 'Raphael',
      },
    }
  },
  90: {
    name: 'Ultimate',
    stars: 9,
    cost: 80,
    magfes: 40,
    times: 1,
    raids: {
      '303131/1/0/133': {
        name: 'Ultimate Bahamut',
      },
    },
  },
};

// Impossible raids
const catImpossible = {
  1010: {
    name: 'Impossible Omega',
    tier: 'impossible',
    stars: 1,
    cost: 50,
    magfes: 25,
    times: 2,
    raids: {
      '300441/1/0/32': {
        name: 'Tiamat',
      },
      '300491/1/0/47': {
        name: 'Colossus',
      },
      '300511/1/0/48': {
        name: 'Leviathan',
      },
      '300531/1/0/49': {
        name: 'Yggdrasil',
      },
      '300561/1/0/50': {
        name: 'Luminiera',
      },
      '300581/1/0/51': {
        name: 'Celeste',
      },
    }
  },
  1020: {
    name: 'Impossible Tier 1 Summon',
    tier: 'impossible',
    stars: 2,
    cost: 50,
    magfes: 25,
    times: 1,
    raids: {
      '300501/1/0/41': {
        name: 'Twin Elements'
      },
      '300521/1/0/42': {
        name: 'Macula Marius'
      },
      '300541/1/0/43': {
        name: 'Medusa'
      },
      '300451/1/0/44': {
        name: 'Nezha'
      },
      '300571/1/0/45': {
        name: 'Apollo'
      },
      '300591/1/0/46': {
        name: 'D.A.Olivia'
      },
      '300471/1/0/1204': {
        name: 'Rose Queen'
      },
    }
  },
  1030: {
    name: 'Impossible Omega II',
    tier: 'impossible',
    stars: 3,
    cost: 90,
    magfes: 45,
    times: 2,
    raids: {
      '303151/1/0/522': {
        name: 'Shiva',
      },
      '303161/1/0/523': {
        name: 'Europa',
      },
      '303171/1/0/524': {
        name: 'Alexiel',
      },
      '303181/1/0/525': {
        name: 'Grimnir',
      },
      '303191/1/0/526': {
        name: 'Metatron',
      },
      '303221/1/0/527': {
        name: 'Avatar',
      },
    }
  },
  1031: {
    name: 'Impossible Beasts',
    tier: 'impossible',
    stars: 3,
    cost: 90,
    magfes: 45,
    times: 1,
    raids: {
      '303231/1/0/6005': {
        name: 'Huanglong & Qilin'
      }
    }
  },
  1040: {
    name: 'Impossible Tier 3 Summon',
    tier: 'impossible',
    stars: 4,
    cost: 80,
    magfes: 40,
    times: 1,
    raids: {
      '302751/1/0/41': {
        name: 'Prometheus',
      },
      '303041/1/0/42': {
        name: 'Ca Ong',
      },
      '302711/1/0/43': {
        name: 'Gilgamesh',
      },
      '303051/1/0/44': {
        name: 'Morrigna',
      },
      '303061/1/0/45': {
        name: 'Hector',
      },
      '303071/1/0/46': {
        name: 'Anubis',
      },
    }
  },
  1041: {
    name: 'Impossible Malice',
    tier: 'impossible',
    stars: 4,
    cost: 80,
    magfes: 40,
    times: 1,
    raids: {
      '303241/1/0/104': {
        name: 'Tiamat Malice',
        icon: 'galbinuscentrum'
      },
      '303241/1/0/106': {
        name: 'Tiamat Malice',
        icon: 'atercentrum'
      }
    }
  },
  1050: {
    name: 'Impossible Nightmare',
    tier: 'impossible',
    stars: 5,
    raids: {
      '301061/1/0/59': {
        name: 'Proto Bahamut',
        cost: 90,
        magfes: 45,
        times: 1,
      },
      '303251/1/0/533': {
        name: 'Akasha',
        cost: 90,
        magfes: 45,
        times: 1,
      },
      '303271/1/0/506': {
        name: 'Lucilius',
        cost: 80,
        magfes: 40,
        times: 1,
      },
      '303291/1/0/5311': {
        name: 'The Four Primarchs',
        cost: 80,
        magfes: 40,
        times: 1,
      },
    }
  },
  1060: {
    name: 'Impossible Ultimate',
    tier: 'impossible',
    stars: 6,
    cost: 100,
    magfes: 50,
    times: 1,
    raids: {
      '303141/1/0/136': {
        name: 'Ultimate Bahamut',
      },
    }
  },
  1070: {
    name: 'Impossible Rapture',
    tier: 'impossible',
    stars: 7,
    cost: 100,
    magfes: 50,
    times: 1,
    raids: {
      '303281/1/0/537': {
        name: 'Lucilius (Hard)',
      },
    }
  },
};

export default {
  components: {
    Checkbox,
    Dropdown,
  },
  data() {
    return {
      isMagfes: false,
      show_help: false,
      editMode: false,
      renameLists: true,
      showTab: 0,

      raidIndex: 0,

      myLists: [{name: 'Default list', data: []}],
      listIndex: 0,
      listName: "",
      saveMessage: "",
    }
  },
  methods: {
    clickRaid(raidKey) {
      if (this.editMode) {
        let index = this.getIndex(raidKey);
        if (index === -1) {
          this.addRaid(raidKey, this.currentList);
        }
        else {
          this.currentList.splice(index, 1);
        }
      }
      else {
        window.open('http://game.granbluefantasy.jp/#quest/supporter/' + raidKey, 'gbf');
      }
    },
    addRaid(raidKey, raidList) {
      if (this.getRaids.hasOwnProperty(raidKey)) {
        let raid = Utils.copy(this.getRaids[raidKey]);
        raid.times = raid.times || this.getCategories[raid.category].times;
        raid.remaining = raid.times;
        raidList.push(raid);
      }
    },
    undoRaid() {
      if (this.raidIndex > 0) {
        this.raidIndex--;
        let raid = this.currentList[this.raidIndex];
        raid.remaining = raid.times;
      }
    },
    launchRaid() {
      if (this.raidIndex < this.currentList.length) {
        let raid = this.currentList[this.raidIndex];
        window.open('http://game.granbluefantasy.jp/#quest/supporter/' + raid.id, 'gbf');
        raid.remaining--;
        if (raid.remaining < 1) {
          this.skipRaid();
        }
      }
    },
    skipRaid() {
      if (this.raidIndex < this.currentList.length) {
        this.raidIndex++;
      }
    },
    resetRaid() {
      this.currentList.forEach(r => r.remaining = r.times);
      this.raidIndex = 0;
    },
    getIndex(raidKey) {
      return this.currentList.findIndex(e => e.id === raidKey);
    },
    getIndexString(raidKey) {
      const index = this.getIndex(raidKey);
      return index >= 0 ? index + 1 : '.';
    },
    clickListSave() {
      let data = [];
      this.myLists.forEach(l => {
        data.push({
          name: l.name,
          data: l.data.flatMap(r => [{id: r.id}])
        })
      });

      this.$http.post('/daily/save', data)
        .then(response => {
          this.saveMessage = 'Lists saved successfully at ' + new Date().toLocaleTimeString();
        })
        .catch(error => console.log(error));
    },
    clickListNew() {
      this.myLists.push({name: 'List ' + (this.myLists.length + 1), data: []});
      this.listIndex = this.myLists.length-1;
    },
    clickListDelete() {
      if (this.listIndex > 0) {
        this.myLists.splice(this.listIndex, 1);
        this.listIndex = 0;
      }
    },
    loadLists() {
      this.$http.get('/daily/load')
        .then(response => {
          if (response.data !== null) {
            this.myLists = [];            
            response.data.forEach(l => {
              let obj = {
                name: l.name,
                data: []
              }              
              l.data.forEach(r => this.addRaid(r.id, obj.data));
              this.myLists.push(obj);
            });
            this.listIndex = 0;
          }
        })
        .catch(error => console.log(error));
    },
  },
  computed: {
    isUserLogged() {
      return this.$store.getters.getUserId !== null;
    },
    getContent() {
      return [
        {
          name: 'Standard Raids',
          data: catStandard
        },
        {
          name: 'Impossible Raids',
          data: catImpossible
        },
      ];
    },
    getCategories() {
      // Merge categories
      return Object.assign({}, catStandard, catImpossible);
    },
    getRaids() {
      // Index by raid ID
      let raids = {};
      for (let [catKey, catValue] of Object.entries(this.getCategories)) {
        for (let [raidKey, raidValue] of Object.entries(catValue.raids)) {
          raids[raidKey] = Utils.copy(raidValue);
          raids[raidKey].id = raidKey;
          raids[raidKey].category = parseInt(catKey, 10);
        }
      }
      return raids;
    },
    getTotalAP() {
      if (this.currentList.length === 0) {
        return 0;
      }

      let total = 0;
      this.currentList.slice(this.raidIndex).forEach(val => {
        let res = 0;
        if (this.isMagfes) {
          res = (val.magfes ? val.magfes : this.getCategories[val.category].magfes);
        }
        else {
          res = (val.cost ? val.cost : this.getCategories[val.category].cost);
        }
        total += res * val.remaining;
      });
      return total;
    },
    currentList() {
      return this.myLists[this.listIndex].data;
    },
    currentListIds() {
      return this.currentList.flatMap(r => [{id: r.id}]);
    },
    currentListName: {
      get() {
        return this.myLists[this.listIndex].name;
      },
      set(value) {
        this.myLists[this.listIndex].name = value;
      }      
    }
  },
  watch: {
    '$store.getters.getUserId'() {
      this.loadLists();
    },
    isMagfes() {
      lsMgt.setValue('isMagfes', this);
    },
    showTab() {
      lsMgt.setValue('showTab', this);
    },
    renameLists() {
      lsMgt.setValue('renameLists', this);
    },
    currentList() {
      if ( ! this.isUserLogged) {
        lsMgt.setValue('currentListIds', this);
      }
    }
  },
  mounted() {
    lsMgt.getValue(this, 'isMagfes');
    lsMgt.getValue(this, 'showTab');
    lsMgt.getValue(this, 'renameLists');

    if (this.isUserLogged) {
      this.loadLists();
    }
    else {
      const listIds = lsMgt.fetchValue('currentListIds');
      if (listIds !== undefined) {
        listIds.forEach(r => this.addRaid(r.id, this.myLists[0].data));
      }
    }
  }
}
</script>

<style scoped>

.columns:not(:last-child) {
  margin-bottom: 0px;
}

</style>