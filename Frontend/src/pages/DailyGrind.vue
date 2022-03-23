<template>
  <div class="flex flex-col">
    <h1 class="self-center">Daily Grind Lists</h1>

    <!-- Top bar -->
    <div class="flex flex-row flex-wrap py-2 gap-2">
      <button class="btn" :class="show_help ? 'btn-blue' : 'btn-white'" @click="show_help = ! show_help">
        <fa-icon :icon="['fas', 'info-circle']" class="text-xl"></fa-icon> Usage
      </button>
      
      <checkbox v-model="isMagfes">MagnaFest</checkbox>

      <checkbox v-model="editMode">Edit mode</checkbox>

      <checkbox v-model="renameLists">Rename lists</checkbox>
    </div>

    <!-- Usage -->
    <div class="bg-secondary self-center rounded p-4 mb-2" v-if="show_help">
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
      <div class="flex flex-row flex-wrap items-center gap-2">
        <div class="relative">
          <dropdown v-model.number="current_list_index" class="w-64">
            <option v-for="(list, index) in my_lists" :key="index" :value="index">{{ list.name }}</option>
          </dropdown>
          <div class="absolute top-0 left-0" v-if="renameLists">
            <input class="input border-none focus:shadow-none ml-2 p-0" style="width: 14rem;" type="text" placeholder="Default list" v-model="currentListName">
          </div>
        </div>

        <button class="btn btn-blue" @click="clickListSave()">
          <fa-icon :icon="['fas', 'save']" class="text-xl"></fa-icon> Save All
        </button>

        <button class="btn btn-blue" @click="clickListNew()">
          <fa-icon :icon="['fas', 'file']" class="text-xl"></fa-icon> New List
        </button>

        <button class="btn btn-red" :disabled="current_list_index === 0" @click="clickListDelete()">
          <fa-icon :icon="['fas', 'trash']" class="text-xl"></fa-icon> Delete List
        </button>
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
        
        <h2 class="py-4 cursor-pointer" @click="content.show = ! content.show">
          <fa-icon v-if=" ! content.show" :icon="['fas', 'angle-right']"></fa-icon>
          <fa-icon v-else :icon="['fas', 'angle-down']"></fa-icon>
          {{ content.name }}
        </h2>

        <span v-if="content.show === true">
          <table class="table-auto">
            <thead>
              <tr>
                <th></th>
                <th class="md:w-full"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(catVal, catKey) in content.data" :key="catKey" class="flex flex-col md:table-row md:flex-none">
                <!-- Category -->
                <td class="pr-2 whitespace-nowrap">
                  <span class="pr-2">{{ catVal.name }}</span>
                  <span class="flex flex-row">
                    <span v-if="catVal.times" class="tag bg-tertiary mr-1">x{{ catVal.times }}</span>
                    <span v-if="catVal.cost" class="tag bg-tertiary">{{ isMagfes ? catVal.magfes : catVal.cost }} AP</span>
                  </span>
                </td>

                <!-- Raids list -->
                <td class="flex flex-row flex-wrap select-none py-1 border-b border-secondary">
                  <a v-for="(raidVal, raidKey) in catVal.raids"
                    :key="raidKey"
                    @click="clickRaid(raidKey)"
                    class="p-1 cursor-pointer"
                  >
                    <div class="rounded flex flex-col items-center bg-secondary text-primary hover:bg-tertiary">
                      <div class="flex flex-row">
                        <img v-if="raidVal.icon" :src="'/img/item/' + raidVal.icon + '.jpg'" style="max-height: 50px; max-width: 50px;">
                        <div class="flex flex-col py-3 px-4">
                          <span class="flex flex-row justify-around">
                            <span
                              v-if="editMode"
                              class="tag text-center inline-block text-inverse mr-1" style="min-width: 2rem"
                              :class="getIndex(raidKey) >= 0 ? 'bg-inverse' : 'bg-tertiary'"
                            >{{ getIndexString(raidKey) }}</span>
                            <span>{{ raidVal.name }}</span>
                          </span>

                          <span class="flex flex-row justify-around">
                            <span v-if="raidVal.times" class="tag bg-tertiary mr-1 mt-1">x{{ raidVal.times }}</span>
                            <span v-if="raidVal.cost" class="tag bg-tertiary mt-1">{{ isMagfes ? raidVal.magfes : raidVal.cost }} AP</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>

        </span>
      </div>
    </div>

    <!-- My List tab -->
    <div v-if="showTab === 1" class="flex flex-col mt-4">
      <span class="font-semibold">AP needed: {{ getTotalAP }}</span>      

      <div class="flex flex-row flex-wrap gap-2 my-4">
        <button class="btn btn-blue" @click="undoRaid()" :disabled="currentListRaidIndex === 0">Undo</button>
        <button class="btn btn-blue" @click="launchRaid()" :disabled="remainingList.length === 0">Launch Raid</button>
        <button class="btn btn-blue" @click="skipRaid()" :disabled="remainingList.length === 0">Skip</button>
      </div>

      <span v-for="raid in remainingList" :key="raid.id" class="mb-1">
        <span class="tag bg-inverse text-inverse mr-1">x{{ raid.remaining }}</span>
        <img v-if="raid.icon" :src="'/img/item/' + raid.icon + '.jpg'" class="vcenter-img" style="max-height: 25px; max-width: 25px;">
        {{ raid.name }}
        <span v-if="getCategories[raid.category].name.length > 0" class="tag bg-tertiary">{{ getCategories[raid.category].name }}</span>
        <br>
      </span>

      <span class="mt-4">
        <button class="btn btn-red" @click="resetRaid()" :disabled="currentListRaidIndex === 0">Reset</button>
      </span>
    </div>

  </div>
</template>

<script>
import Utils from '@/js/utils.js'
import Raids from '@/js/raids.js'
import { grindStoreMixin, RaidList } from '@/store/modules/daily-grind'

import Checkbox from '@/components/common/Checkbox.vue'
import Dropdown from '@/components/common/Dropdown.vue'

const lsMgt = new Utils.LocalStorageMgt('DailyGrind');

// Merge categories
const CATEGORIES = Object.assign({}, Raids.CAT_STANDARD, Raids.CAT_IMPOSSIBLE, Raids.CAT_SOLO);

export default {
  components: {
    Checkbox,
    Dropdown,
  },
  mixins: [
    grindStoreMixin
  ],
  head: {
    title: 'Granblue.Party - Daily Grind',
    desc: 'Choose the content you want to farm and click Next to grind!',
    image: 'https://www.granblue.party/img/card_dailygrind.jpg',
    keywords: 'raid, raids, host, magnafest, grind, farming'
  },
  data() {
    return {
      isMagfes: false,
      show_help: false,
      editMode: false,
      renameLists: true,
      showTab: 0,
      content: [
        { name: 'Solo Content', data: Raids.CAT_SOLO, show: true },
        { name: 'Standard Raids', data: Raids.CAT_STANDARD, show: true },
        { name: 'Impossible Raids', data: Raids.CAT_IMPOSSIBLE, show: true },        
      ]
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
      if (this.currentListRaidIndex > 0) {
        this.currentListRaidIndex--;
        let raid = this.currentList[this.currentListRaidIndex];
        raid.remaining = raid.times;
      }
    },
    launchRaid() {
      if (this.currentListRaidIndex < this.currentList.length) {
        let raid = this.currentList[this.currentListRaidIndex];
        raid.remaining--;
        if (raid.remaining < 1) {
          this.skipRaid();
        }
        window.open('http://game.granbluefantasy.jp/#quest/supporter/' + raid.id, 'gbf');
      }
    },
    skipRaid() {
      if (this.currentListRaidIndex < this.currentList.length) {
        this.currentListRaidIndex++;
      }
    },
    resetRaid() {
      this.currentList.forEach(r => r.remaining = r.times);
      this.currentListRaidIndex = 0;
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
      this.my_lists.forEach(l => {
        data.push({
          name: l.name,
          data: l.data.flatMap(r => [{id: r.id}])
        })
      });

      this.axios.post('/daily/save', data)
        .then(_ => this.$store.dispatch('addMessage', {message: 'Lists saved successfully'}))
        .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
    },
    clickListNew() {
      this.my_lists.push(new RaidList('List ' + (this.my_lists.length + 1), []));
      this.current_list_index = this.my_lists.length-1;
    },
    clickListDelete() {
      if (this.current_list_index > 0) {
        this.my_lists.splice(this.current_list_index, 1);
        this.current_list_index = 0;
      }
    },
    loadServerLists() {
      if (this.list_fetched === false) {
        return this.axios.get('/daily/load')
          .then(response => {
            if (response.data !== null) {
              let user_lists = [];
              response.data.forEach(l => {
                let obj = new RaidList(l.name, []);    
                l.data.forEach(r => this.addRaid(r.id, obj.data));
                user_lists.push(obj);
              });
              this.$set(this, 'my_lists', user_lists);
              this.current_list_index = 0;
              this.list_fetched = true;
            }
          })
          .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
      }
    },
    loadList() {
      if (this.isUserLogged) {
        this.loadServerLists();
      }
      else {
        this.$store.commit('daily_grind/resetMyLists');

        const listIds = lsMgt.fetchValue('currentListIds');
        if (listIds !== undefined) {
          listIds.forEach(r => this.addRaid(r.id, this.my_lists[0].data));
        }
      }
    }
  },
  computed: {
    my_lists: {
      get() { return this.$store.state.daily_grind.my_lists },
      set(value) { this.$store.commit('daily_grind/setMyLists', value) }
    },
    current_list_index: {
      get() { return this.$store.state.daily_grind.current_list_index },
      set(value) { this.$store.commit('daily_grind/setCurrentListIndex', value) }
    },
    list_fetched: {
      get() { return this.$store.state.daily_grind.list_fetched },
      set(value) { this.$store.commit('daily_grind/setListFetched', value) }
    },
    isUserLogged() {
      return this.$store.getters.getUserId !== null;
    },
    getContent() {
      return this.content;
    },
    getCategories() {
      return CATEGORIES;
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
      this.currentList.slice(this.currentListRaidIndex).forEach(val => {
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
      return this.my_lists[this.current_list_index].data;
    },
    currentListIds() {
      return this.currentList.flatMap(r => [{id: r.id}]);
    },
    currentListRaidIndex: {
      get() {
        return this.my_lists[this.current_list_index].raid_index;
      },
      set(value) {
        this.my_lists[this.current_list_index].raid_index = value;
      }      
    },
    remainingList() {
      return this.currentList.slice(this.currentListRaidIndex);
    },
    currentListName: {
      get() {
        return this.my_lists[this.current_list_index].name;
      },
      set(value) {
        this.my_lists[this.current_list_index].name = value;
      }      
    }
  },
  watch: {
    '$store.getters.getUserId'() {
      this.list_fetched = false;
      this.loadList();
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
  serverPrefetch() {
    if (this.isUserLogged) {
      return this.loadServerLists();
    }
  },
  mounted() {
    lsMgt.getValue(this, 'isMagfes');
    lsMgt.getValue(this, 'showTab');
    lsMgt.getValue(this, 'renameLists');

    this.loadList();
  },
}
</script>