<template>
  <div>
    <div class="field is-grouped is-grouped-multiline vcenter-line">
      <div class="control">
        <button
          class="button is-light is-outlined"
          @click="clickCopyURL"
        >
          Copy PermaURL
        </button>
      </div>

      <div class="control">
        <button
          class="button is-light is-info"
          :class="showBookmarklet ? '' : 'is-outlined'"
          @click="showBookmarklet = ! showBookmarklet; showHelp = false"
        >
          Get Export Bookmarklet
        </button>
      </div>

      <div class="control">
        <button
          class="button is-light is-info"
          :class="showHelp ? '' : 'is-outlined'"
          @click="showHelp = ! showHelp; showBookmarklet = false"
        >
          💡Usage
        </button>
      </div>

      <div class="control">
        Layout
      </div>

      <div class="control">
        <div class="field has-addons">        
          <div class="control">
            <button
              class="button is-info"
              :class="layout === 'square' ? '' : 'is-outlined'"
              @click="layout = 'square'"
            >
              Square
            </button>
          </div>
          <div class="control">
            <button
              class="button is-info"
              :class="layout === 'wide' ? '' : 'is-outlined'"
              @click="layout = 'wide'"
            >
              Wide
            </button>
          </div>
        </div>        
      </div>

      <div class="control">
        <button
          class="button is-light is-outlined is-warning"
          @click="clickPartyNew()"
        >
          📄Clear Party
        </button>
      </div>

      <div class="control">
        <input class="switch is-rounded is-info" type="checkbox" id="editMode" v-model="editMode">
        <label for="editMode">Edit mode</label>
      </div>
    </div>


    <div class="box has-background-light" v-if="showBookmarklet">
      <div v-if="showUpdateBookmarklet">
        <p class="has-topbot-margins">
          <span class="title">A new version of the Bookmarklet is available</span><br>
          You should update to the last version to benefit from an improved export.<br>
          All you need to do is to update your Bookmark in Chrome with the following JavaScript code:
          <a href="https://github.com/Minimalist3/GBF-Bookmarklet/raw/master/bookmarklet.min.js" target="_blank">bookmarklet.min.js</a>.
        </p>
      </div>
      <div v-else>
        <p class="has-topbot-margins">
          <span class="title">What is this</span><br>
          Open a Party page in GBF and export the class, characters, summons and weapons here in a single click.
        </p>
        <p class="has-topbot-margins">
          <span class="title">How to install</span><br>
          All you need is to create a new Bookmark in Chrome with the following JavaScript code:
          <a href="https://github.com/Minimalist3/GBF-Bookmarklet/raw/master/bookmarklet.min.js" target="_blank">bookmarklet.min.js</a>.
        </p>
      </div>

      <p class="has-topbot-margins">
        <span class="title">More information</span><br>
        You can find the source code and a comprehensive Readme here:
        <a href="https://github.com/Minimalist3/GBF-Bookmarklet" target="_blank">GBF-Bookmarklet</a>.
      </p>
    </div>

    <div class="box has-background-light" v-if="showHelp">
      <p class="has-topbot-margins">
        <span class="title">My Parties</span><br>
        By logging into your account, you can save and load as many parties as you want, then share the link to each one with your friends.<br>
        Only you can modify your parties. When you click the Update button, people will automatically see the updated version.
      </p>
      <p class="has-topbot-margins">
        <span class="title">The Edit checkbox</span><br>
        When the Edit checkbox is checked, you can add elements to your party.<br>
        Uncheck it to click on character skills and summons.
      </p>
      <p class="has-topbot-margins">
        <span class="title">Drag and Drop support</span><br>
        You can drag and drop character, summons and weapons to other slots.<br>
        If something is already at the destination, the two items will swap places.<br>
        You can also hold the Ctrl key while before dropping to duplicate the item instead.<br>
      </p>
      <p class="has-topbot-margins">
        <span class="title">Customize your party</span><br>
        Set the uncap level of your party by clicking of the stars.<br>
        You can set a Perpetuity Ring on each character by clicking on the lower right corner of the portrait.<br>
        Click on the lock icon of the weapon skills to select a skill key.<br>
      </p>
      <p class="has-topbot-margins">
        <span class="title">Copy PermaURL (deprecated)</span><br>
        You can share your team setup by clicking the "Copy PermaURL" button and copying the URL of the page.<br>
        This feature will be removed in the coming months, to be replaced by "My Parties".
      </p>
    </div>

    <div class="field is-grouped is-grouped-multiline vcenter-line" v-if="isUserLogged">
      <div class="control">
        My parties
      </div>

      <div class="control">
        <div class="field has-addons">
          <div class="control">
            <div class="select">
              <select :disabled="parties.length === 0" ref="partyId" v-model="selected_party">
                <option disabled value="">Please select a party</option>
                <option
                  v-for="(party, index) in parties"
                  :key="party.id"
                  :value="party.id"
                >Party{{ index+1 }}: {{ party.name }}</option>
              </select>
            </div>
          </div>

          <div class="control" v-if="parties.length > 0 && selected_party_index > 0">
            <button
              class="button is-light is-outlined"
              @click="clickPartyLoad"
            >
              📂Load
            </button>
          </div>
        </div>
      </div>

      <div class="control">
        <button
          class="button is-light is-outlined"
          @click="clickPartyShare()"
          v-if="parties.length > 0 && selected_party_index > 0"
        >
          🔗Share Party{{ selected_party_index }}
        </button>
      </div>

      <div class="control">
        <button
          class="button is-light is-outlined is-danger"
          v-if="parties.length > 0 && selected_party_index > 0"
          @click="clickPartyDelete"
        >
          🗑️Delete Party{{ selected_party_index }}
        </button>
      </div>
    </div>

    <div class="field is-grouped is-grouped-multiline vcenter-line" v-if="isUserLogged">
      <div class="control">
        Party Name
      </div>

      <div class="control">
        <input class="input" type="text" placeholder="Unnamed party" v-model="party_name">
      </div>

      <div class="control">
        <div class="field has-addons">
          <div class="control">
            <button
              class="button is-light is-outlined"
              @click="clickPartySave(null)"
            >
              💾Save New
            </button>
          </div>

          <div class="control" v-if="parties.length > 0 && selected_party_index > 0">
            <button
              class="button is-light is-outlined"
              @click="clickPartySave(selected_party)"
            >
              📝Update Party{{ selected_party_index }}
            </button>
          </div>
        </div>
      </div>

      <div class="control" v-if="current_party === null">
        (unsaved)
      </div>

      <transition name="fade" mode="out-in">
        <div class="control" :key="party_message">
          {{ party_message }}
        </div>
      </transition>
    </div>

    <div class="row">

      <span class="block" style="order: 1">
        <!-- MC -->
        <class-box
          :object="classe"
          :onClickPortrait="clickMCPortrait"
          :onClickSkill="clickMCSkill"
        ></class-box>
        &nbsp;&nbsp;
        <!-- Characters -->
        <character-box
          v-for="(character, index) in characters"
          :key="index"
          :index="index"
          :object="character"
          :onClickPortrait="clickCharacterPortrait"
          :onClickSkill="clickCharacterSkill"
          :onSwap="swapCharacters"
          :showLevel="showStats"
        ></character-box>
      </span>
      
      <!-- Summons -->
      <span class="block" :style="layout === 'square' ? 'order: 2' : 'order: 3'">
        <span class="main-item-left">
          <span class="tag is-medium is-rounded is-black is-unselectable">Main</span>
          <summon-box
            :index="0"
            :object="summons[0]"
            :onClick="clickSummon"
            :onSwap="swapSummons"
            :showLevel="showStats"
          ></summon-box>
        </span>
        <span class="main-summons">
          <span class="is-unselectable" style="margin-left: auto; margin-right: auto;">
            <span class="tag is-dark is-medium">Atk</span> {{ getStatsFromSummons[0] }}
            <span class="tag is-dark is-medium">HP</span> {{ getStatsFromSummons[1] }}
          </span>
          <summon-box
            v-for="index in range(1, 4)"
            :key="index"
            :index="index"
            :object="summons[index]"
            :onClick="clickSummon"
            :onSwap="swapSummons"
            :showLevel="showStats"
          ></summon-box>
        </span>
        <span class="main-item-right">
          <span class="tag is-medium is-rounded is-black is-unselectable">Friend</span>
          <summon-box
            :index="5"
            :object="summons[5]"            
            :onClick="clickSummon"
            :onSwap="swapSummons"
            :showLevel="showStats"
          ></summon-box>
        </span>
      </span>

      <hr v-if="layout === 'square'" style="order: 3">

      <!-- Weapons -->
      <span class="block" :style="layout === 'square' ? 'order: 4' : 'order: 2'">
        <span class="main-item-left">
          <weapon-box
            :index="0"
            :object="weapons[0]"            
            :onClick="clickWeapon"
            :onSwap="swapWeapons"
            :showLevel="showStats"
            :percentHP="partyHP"
          ></weapon-box>
        </span>
        <span class="main-weapons">
          <weapon-box
            v-for="index in range(1, 9)"
            :key="index"
            :index="index"
            :object="weapons[index]"
            :onClick="clickWeapon"
            :onSwap="swapWeapons"
            :showLevel="showStats"
            :percentHP="partyHP"
          ></weapon-box>
        </span>
      </span>

      <hr v-if="layout === 'wide'" style="order: 4">

      <span
        class="actions"
        :class="layout === 'wide' ? 'wide-block' : ''"
        style="order: 5"
      >
        <div class="tabs has-background-dark has-text-grey-light">
          <ul>
            <li :class="showTab === 0 ? 'is-active' : ''"><a @click="showTab = 0">Actions</a></li>
            <li :class="showTab === 1 ? 'is-active' : ''"><a @click="showTab = 1">Details</a></li>
          </ul>
        </div>

        <!-- Actions tab -->
        <div v-if="showTab === 0">
          <span class="actions-tab">
            <button class="button is-light is-outlined" @click="clickAttack">Attack</button>
            <span>
              <button class="button is-danger is-outlined" @click="clickCancelAction">Undo</button>
              <button class="button is-danger is-outlined" @click="clickResetActions">Clear</button>
            </span>
          </span>
          <textarea class="textarea has-background-black has-text-grey-light" v-model="getPlayerActions" readonly></textarea>
        </div>

        <!-- Details tab -->
        <div v-if="showTab === 1">
          <input class="switch is-rounded is-info" type="checkbox" id="showStats" v-model="showStats">
          <label for="showStats">Show levels and + bonuses</label>
          <br>
          Enemy Element
          <div class="select is-small">
            <select v-model="enemyElement">
              <option value="fire">Fire</option>
              <option value="wind">Wind</option>
              <option value="earth">Earth</option>
              <option value="water">Water</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="none">None</option>
            </select>
          </div>
          Enemy Defense
          <input
            class="input is-small has-background-dark has-text-light"
            style="width: 5ch;"
            v-model.number="enemyDefense"            
            @keydown.arrow-up="enemyDefense++"
            @keydown.arrow-down="enemyDefense--"
          >
          Party HP
          <input
            class="input is-small has-background-dark has-text-light"
            style="width: 6ch;"
            v-model.number="partyHP"            
            @keydown.arrow-up="partyHP++"
            @keydown.arrow-down="partyHP--"
          >%          
          <br>

          <span class="tag is-danger">Experimental</span> A lot is still missing to get accurate results.
          Mouse over the skills and summons to see what's already implemented.

          <div class="table-container" v-if="getStatsForCharacters.length > 0">
            <table class="table is-hoverable ">
              <thead>
                <tr>
                  <th></th>
                  <th>Atk</th>
                  <th>HP</th>
                  <th>Elem</th>
                  <th><abbr title="Normal and Optimus modifiers ratio">Norm</abbr></th>
                  <th>Omega</th>
                  <th>Ex</th>
                  <th><abbr title="Character-specific unique attack ratio">Chara</abbr></th>
                  <th><abbr title="Optimus Critical ratio">Crit N</abbr></th>
                  <th><abbr title="Omega Critical ratio">Crit &Omega;</abbr></th>
                  <th>Atk cap</th>
                  <th>Total</th>
                  <th><abbr title="Capped attack with crit ratio (probability %)">Capped w/crit</abbr></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(chara, index) in getStatsForCharacters"
                  :key="index"
                >
                  <td>{{ chara.name }}</td>
                  <td>{{ chara.atk }}</td>
                  <td>{{ chara.hp }}</td>
                  <td>{{ (chara.elem_atk * 100).toFixed(0) }}%</td>
                  <td>{{ (chara.normal_atk * 100).toFixed(0) }}%</td>
                  <td>{{ (chara.omega_atk * 100).toFixed(0) }}%</td>
                  <td>{{ (chara.ex_atk * 100).toFixed(0) }}%</td>
                  <td>{{ (chara.chara_atk * 100).toFixed(0) }}%</td>
                  <td>{{ Math.floor(chara.optimus_crit * 100) }}%</td>
                  <td>{{ Math.floor(chara.omega_crit * 100) }}%</td>
                  <td>{{ ((chara.atk_cap-1) * 100).toFixed(0) }}%</td>                  
                  <td>{{ chara.total_atk }}</td>
                  <td><span v-for="v in chara.total_atk_crit" :key="v.value">{{ v.atk_capped }} ({{ v.proba }}%) [capped: {{ v.capped }}]<br></span></td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </span>

    </div>

    <modal-selector      
      ref="modalClass"
      route="party/classes"
      :categories="modalClassData"
      :selected="whenClassSelected"
    ></modal-selector>
    <modal-selector
      ref="modalSkill"
      route="party/skills"
      :route-parameters="'family=' + classe.family"
      :categories="modalSkillData"
      :selected="whenSkillSelected"
    ></modal-selector>
    <modal-selector
      ref="modalCharacter"
      route="party/characters"
      :categories="modalCharacterData"
      :selected="whenCharacterSelected"
    ></modal-selector>
    <modal-selector
      ref="modalSummon"
      route="party/summons"
      :categories="modalSummonData"
      :selected="whenSummonSelected"
    ></modal-selector>
    <modal-selector
      ref="modalWeapon"
      route="party/weapons"
      :categories="modalWeaponData"
      :selected="whenWeaponSelected"
    ></modal-selector>

    <input
      v-show="clipboardText.length > 0"
      id="clipboardInput"
      readonly
      type="text"
      :value="clipboardText"
    >
  </div>  
</template>

<script>

import ClassBox from '@/components/ClassBox.vue'
import CharacterBox from '@/components/CharacterBox.vue'
import SummonBox from '@/components/SummonBox.vue'
import WeaponBox from '@/components/WeaponBox.vue'
import ModalSelector from '@/components/ModalSelector.vue'

import msgpack from '@/js/msgpack.js'
import base64js from '@/js/base64js.js'
import Utils from '@/js/utils.js'

import DataModel from '@/js/dataModel.js'
import KeyData from '@/js/keyData.js'

const lsMgt = new Utils.LocalStorageMgt('PartyBuilder');

const actionType = {
  SKILL: 0,
  SUMMON: 1,
  ATTACK: 2,
}

const ratio_types = {
  atk: 0,
  atk_cap: 0,
  hp: 0,
  da: 0,
  ta: 0,
  crit: 0,
  ca_dmg: 0,
  ca_cap: 0,
  chainburst_dmg: 0,
  chainburst_cap: 0,
  stamina: 0,
  enmity: 0,
  supplemental_dmg: 0,
};

const elem_superiority = {
  fire: {
    superior: 'wind',
    weak: 'water'
  },
  wind: {
    superior: 'earth',
    weak: 'fire'
  },
  earth: {
    superior: 'water',
    weak: 'wind'
  },
  water: {
    superior: 'fire',
    weak: 'earth'
  },

  light: {
    superior: 'dark',
    weak: ''
  },
  dark: {
    superior: 'light',
    weak: ''
  },

  none: {
    superior: '',
    weak: ''
  },
}

const defaultValues = {
  classe: {},
  characters: [{}, {}, {}, {}, {}],
  summons: [{}, {}, {}, {}, {}, {}],
  weapons: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {},],
};

// Helper to match categories with proper default values
const getDefaultValues = (data, category) => {
  if (Utils.isEmpty(data[category])) {
    return Utils.copy(defaultValues[category]);
  }
  if (data[category] instanceof Array) {          
    return data[category].map(e => Utils.isEmpty(e) ? {} : e);
  }
  return data[category];
};

export default {
  components: {
    ClassBox,
    CharacterBox,
    SummonBox,
    WeaponBox,
    ModalSelector
  },
  data() {
    return {
      editMode: true,
      clipboardText: '',
      showBookmarklet: false,
      showUpdateBookmarklet: false,
      showHelp: false,
      showTab: 0,
      showStats: false,
      layout: 'square',

      classe: Utils.copy(defaultValues['classe']),
      characters: Utils.copy(defaultValues['characters']),
      summons: Utils.copy(defaultValues['summons']),
      weapons: Utils.copy(defaultValues['weapons']),
      playerActions: [],

      modalClassData: [
        {
          name: "Name",
          isColumn: true,
          isFilter: false,
          key: "n",
        },
        {
          name: "Row",
          isColumn: true,
          isFilter: true,
          key: "row",
        },
      ],
      modalSkillData: [
        {
          name: "Name",
          isColumn: true,
          isFilter: false,
          key: "n",
        },      
      ],
      modalCharacterData: [
        {
          name: "Name",
          isColumn: true,
          isFilter: false,
          key: "n",
        },
        {
          name: "Rarity",
          isColumn: false,
          isFilter: true,
          key: "ri",
        },
        {
          name: "Element",
          isColumn: true,
          isFilter: true,
          key: "e",
        },
        {
          name: "Type",
          isColumn: true,
          isFilter: true,
          key: "t",
        },
        {
          name: "Race",
          isColumn: true,
          isFilter: true,
          key: "ra",        
        },
        {
          name: "Weapon",
          isColumn: true,
          isFilter: true,
          key: "w",        
        },
      ],
      modalSummonData: [
        {
          name: "Name",
          isColumn: true,
          isFilter: false,
          key: "n",
        },
        {
          name: "Rarity",
          isColumn: true,
          isFilter: true,
          key: "ri",
        },
        {
          name: "Element",
          isColumn: true,
          isFilter: true,
          key: "e",
        },
      ],
      modalWeaponData: [
        {
          name: "Name",
          isColumn: true,
          isFilter: false,
          key: "n",
        },
        {
          name: "Rarity",
          isColumn: false,
          isFilter: false,
          key: "ri",
        },
        {
          name: "Element",
          isColumn: true,
          isFilter: true,
          key: "e",
        },
        {
          name: "Weapon",
          isColumn: true,
          isFilter: true,
          key: "w",        
        },
      ],

      summonsAtk: 0,
      summonsHP: 0,
      enemyElement: "water",
      partyHP: 100,
      enemyDefense: 10,

      parties: [],
      selected_party: "",       // Select Option value
      selected_party_index: null, // Select Option index
      current_party: null,
      party_name: "",
      party_message: "",
    }
  },
  methods: {
    range(start, end) {
      return Array(end - start + 1).fill().map((_, idx) => start + idx)
    },
    /**
     * Classes
     */
    clickMCPortrait() {
      if (this.editMode) {
        this.$refs.modalClass.showModal();
      }
    },
    whenClassSelected(id) {
      return this.$http.get('/party/classes/' + id)
        .then(response => {
          this.classe = response.data;
          this.fixMCSkills();
        })
        .catch(error => console.log(error));
    },
    /**
     * MC Skills
     */
    fixMCSkills() {
      if ( ! Utils.isEmpty(this.classe)) {
        // Fix default skills
        this.classe.skills.forEach(s => {
          if (s !== null) {
            s['fixed'] = true;
          }
        });
        // MC has 4 skills (ignore row 1 and 2 classes limitation)
        while (this.classe.skills.length < 4) {
          this.classe.skills.push(null);
        }
      }
    },    
    clickMCSkill(index) {
      if (this.classe.skills === undefined) return;
      
      if (this.editMode) {
        if (this.classe.skills[index] === null || ! this.classe.skills[index].fixed) {
          this.$refs.modalSkill.showModal(index);          
        }
      }
      else if (this.classe.skills[index] !== null) {
        this.playerActions.push({
          sourceName: this.classe.nameen,
          sourceSlot: 0,
          skillName: this.classe.skills[index].nameen,
          skillSlot: index + 1,
          type: actionType.SKILL,
        });
      }
    },    
    whenSkillSelected(id, slot) {
      if (Utils.isEmpty(id)) return;

      if (this.classe.skills[slot] === null || ! this.classe.skills[slot].fixed) {
        return this.$http.get('/party/skills/' + id)
          .then(response => Vue.set(this.classe.skills, slot, response.data))
          .catch(error => console.log(error));
      }
    },
    /**
     * Characters
     */
    clickCharacterPortrait(slot) {
      if (this.editMode) {
        this.$refs.modalCharacter.showModal(slot);
      }
    },
    clickCharacterSkill(index, skillIndex) {
      if ( ! this.editMode && this.characters[index].skills[skillIndex] !== undefined) {
        this.playerActions.push({
          sourceName: this.characters[index].nameen,
          sourceSlot: index + 1,
          skillName: this.characters[index].skills[skillIndex].name,
          skillSlot: skillIndex + 1,
          type: actionType.SKILL,
        });
      }
    },
    whenCharacterSelected(id, slot) {
      if (Utils.isEmpty(id)) return;

      return this.$http.get('/party/characters/' + id)
        .then(response => Vue.set(this.characters, slot, response.data))
        .catch(error => console.log(error));
    },
    swapCharacters(from, to) {
      let tmp = this.characters[from];
      Vue.set(this.characters, from, this.characters[to]);
      Vue.set(this.characters, to, tmp);
    },
    /**
     * Summons
     */
    whenSummonSelected(id, slot) {
      if (Utils.isEmpty(id)) return;

      return this.$http.get('/party/summons/' + id)
        .then(response => Vue.set(this.summons, slot, response.data))
        .catch(error => console.log(error));
    },
    clickSummon(slot) {
      if (this.editMode) {
        this.$refs.modalSummon.showModal(slot);
      }
      else if (this.summons[slot].nameen !== undefined) {
        this.playerActions.push({
          skillName: this.summons[slot].nameen,
          sourceSlot: slot+1,
          type: actionType.SUMMON,
        });
      }
    },
    swapSummons(from, to, type) {
      if (type === "copy") {
        Vue.set(this.summons, to, Utils.copy(this.summons[from]));
      }
      else {
        let tmp = this.summons[from];
        Vue.set(this.summons, from, this.summons[to]);
        Vue.set(this.summons, to, tmp);
      }
    },
    /**
     * Weapons
     */
    clickWeapon(slot) {
      if (this.editMode) {
        this.$refs.modalWeapon.showModal(slot);
      }
    },
    whenWeaponSelected(id, slot) {
      if (Utils.isEmpty(id)) return;

      return this.$http.get('/party/weapons/' + id)
        .then(response => Vue.set(this.weapons, slot, response.data))
        .catch(error => console.log(error));
    },
    swapWeapons(from, to, type) {
      if (type === "copy") {
        Vue.set(this.weapons, to, Utils.copy(this.weapons[from]));
      }
      else {
        let tmp = this.weapons[from];
        Vue.set(this.weapons, from, this.weapons[to]);
        Vue.set(this.weapons, to, tmp);
      }
    },
    /** 
     * Actions
     */
    clickCopyURL() {
      const data = [
        // MC
        Utils.isEmpty(this.classe.skills) ? null : 
          [this.classe.classid,
           this.classe.skills.map(s => {return s ? s.skillid : null}),
          ].flat(),
        // Characters
        this.characters.map(e => { return Utils.isEmpty(e) ? null : e.characterid }),
        // Summons
        this.summons.map(e => { return Utils.isEmpty(e) ? null : e.summonid }),
        // Weapons
        this.weapons.map(e => { return Utils.isEmpty(e) ? null : e.weaponid }),
        // Actions
        this.playerActions.map(e => { return [e.sourceSlot-1, e.skillSlot-1, e.type] })
      ];

      const text = '?t=' + Utils.escapeBase64(base64js.fromByteArray(msgpack.serialize(data))) + window.location.hash;
      this.clipboardText = window.location.href.split('?')[0] + text;
      history.pushState(null, null, text);

      let self = this;
      Vue.nextTick().then(() => {
        const input = document.getElementById("clipboardInput");
        input.select();
        document.execCommand("copy");
        self.clipboardText = '';
      });
    },
    clickAttack() {
      this.playerActions.push({
        type: actionType.ATTACK,
      });
    },
    clickCancelAction() {
      this.playerActions.pop();
    },
    clickResetActions() {
      this.playerActions = [];
    },
    /**
     * Party
     */
    clickPartyNew({clean_url = true} = {}) {
      this.current_party = null;
      this.party_message = "";
      this.classe = Utils.copy(defaultValues['classe']);
      this.characters = Utils.copy(defaultValues['characters']);
      this.summons = Utils.copy(defaultValues['summons']);
      this.weapons = Utils.copy(defaultValues['weapons']);
      this.playerActions = [];

      // Clean the URL
      if (clean_url) {
        history.pushState(null, null, window.location.origin + window.location.pathname);
        this.selected_party = "";
        this.selected_party_index = null;
      }
    },
    clickPartyLoad() {
      this.$http.get('/party/load/' + this.selected_party)
        .then(response => {
          this.loadPartyFromResponse(response);
          
          this.current_party = parseInt(this.selected_party, 10);
        })
        .catch(error => console.log(error));
    },
    clickPartySave(partyId) {
      let data = {
        classe: this.classe.classid,
        class_skills: Utils.isEmpty(this.classe.skills) ? null : this.classe.skills.map(s => {return s ? s.skillid : null}), // Skill ids
        characters: this.characters.map(e => { return Utils.isEmpty(e) ? null : e.characterid }),
        characters_stars: this.characters.map(e => { return Utils.isEmpty(e) ? null : e.stars }),
        characters_levels: this.characters.map(e => { return Utils.isEmpty(e) ? null : e.level }),
        characters_pluses: this.characters.map(e => { return Utils.isEmpty(e) ? null : e.pluses }),
        characters_prings: this.characters.map(e => { return Utils.isEmpty(e) ? null : e.haspring }),
        summons: this.summons.map(e => { return Utils.isEmpty(e) ? null : e.summonid }),
        summons_levels: this.summons.map(e => { return Utils.isEmpty(e) ? null : e.level }),
        summons_pluses: this.summons.map(e => { return Utils.isEmpty(e) ? null : e.pluses }),
        summons_stars: this.summons.map(e => { return Utils.isEmpty(e) ? null : e.stars }),
        weapons: this.weapons.map(e => { return Utils.isEmpty(e) ? null : e.weaponid }),
        weapons_levels: this.weapons.map(e => { return Utils.isEmpty(e) ? null : e.level }),
        weapons_pluses: this.weapons.map(e => { return Utils.isEmpty(e) ? null : e.pluses }),
        weapons_skill_levels: this.weapons.map(e => { return Utils.isEmpty(e) ? null : e.sklevel }),
        weapons_skill_names: this.weapons.map(e => { return Utils.isEmpty(e) ? null : e.keys.map(k => k ? k.name : null) }),
        weapons_stars: this.weapons.map(e => { return Utils.isEmpty(e) ? null : e.stars }),
        actions: this.playerActions.map(e => { return [e.sourceSlot-1, e.skillSlot-1, e.type] })
      }

      this.$http.post('/party/save', {
          id: partyId,
          name: this.party_name,
          data: data
        })
        .then(response => {
          this.current_party = response.data.id;
          this.loadParties(this.current_party);
          this.party_message = 'Party saved successfully at ' + new Date().toLocaleTimeString();
        })
        .catch(error => console.log(error));
    },
    clickPartyDelete() {
      if (this.parties.length !== 0) {
        this.$http.post('/party/delete', {id: this.selected_party})
          .then(() => {
            this.clickPartyNew();
            this.loadParties();
            this.party_message = 'Party deleted successfully at ' + new Date().toLocaleTimeString();
          })
          .catch(error => console.log(error));
      }
    },
    clickPartyShare() {
      const text = '?p=' + this.selected_party;

      this.clipboardText = window.location.href.split('?')[0] + text;
      history.pushState(null, null, text);

      let self = this;
      Vue.nextTick().then(() => {
        const input = document.getElementById("clipboardInput");
        input.select();
        document.execCommand("copy");
        self.clipboardText = '';
        self.party_message = 'URL copied to clipboard';
      });
    },
    loadPartyFromResponse(response) {
      this.loadParty(response.data, {
        actions: response.data.actions,
        characters_stars: response.data.characters_stars,
        characters_levels: response.data.characters_levels,
        characters_pluses: response.data.characters_pluses,
        characters_prings: response.data.characters_prings,
        summons_levels: response.data.summons_levels,
        summons_pluses: response.data.summons_pluses,
        summons_stars: response.data.summons_stars,
        weapons_levels: response.data.weapons_levels,
        weapons_pluses: response.data.weapons_pluses,
        weapons_skill_levels: response.data.weapons_skill_levels,
        weapons_skill_names: response.data.weapons_skill_names,
        weapons_stars: response.data.weapons_stars,
      });
    },
    loadParty(data, {actions = null,
      characters_levels = null, characters_stars = null, characters_pluses = null, characters_prings = null,
      summons_levels = null, summons_stars = null, summons_pluses = null,
      weapons_levels = null, weapons_stars = null, weapons_pluses = null, weapons_skill_levels = null, weapons_skill_names = null} = {}) 
    {
      // Clear current party
      this.clickPartyNew({clean_url: false});

      this.classe = getDefaultValues(data, 'classe');
      this.fixMCSkills();

      if ( ! Utils.isEmpty(data['class_skills']) && ! Utils.isEmpty(this.classe)) {
        data['class_skills'].forEach((e, slot) => {
          if (Utils.isEmpty(this.classe.skills[slot]) || ! this.classe.skills[slot].fixed) {
            this.classe.skills[slot] = e;
          }
        });
      }
      this.characters = getDefaultValues(data, 'characters');
      this.summons = getDefaultValues(data, 'summons');
      this.weapons = getDefaultValues(data, 'weapons');

      // Set stars
      if (characters_stars) {
        for (let i=0; i<this.characters.length && i<characters_stars.length; i++) {
          if (characters_stars[i] !== null) {
            Vue.set(this.characters[i], 'stars', characters_stars[i]);
          }
        }
      }
      else if (characters_levels) {
        for (let i=0; i<this.characters.length && i<characters_levels.length; i++) {
          if (characters_levels[i] === null) {
            continue;
          }
          let lvl = parseInt(characters_levels[i], 10);
          if (lvl > 80) {
            Vue.set(this.characters[i], 'stars', 5);
          }
          else if (lvl > 60) {
            Vue.set(this.characters[i], 'stars', 4);
          }
          else if (lvl > 40) {
            Vue.set(this.characters[i], 'stars', 3);
          }
          else if (lvl > 20) {
            Vue.set(this.characters[i], 'stars', 2);
          }
          else if (lvl > 1) {
            Vue.set(this.characters[i], 'stars', 1);
          }
          else {
            Vue.set(this.characters[i], 'stars', 0);
          }
        }
      }
      if (characters_levels) {
        for (let i=0; i<this.characters.length && i<characters_levels.length; i++) {
          if (characters_levels[i] !== null) {
            Vue.set(this.characters[i], 'level', characters_levels[i]);
          }
        }
      }
      if (characters_pluses) {
        for (let i=0; i<this.characters.length && i<characters_pluses.length; i++) {
          if (characters_pluses[i] !== null) {
            Vue.set(this.characters[i], 'pluses', characters_pluses[i]);
          }
        }
      }
      if (characters_prings) {
        for (let i=0; i<this.characters.length && i<characters_prings.length; i++) {
          if (characters_prings[i] !== null) {
            Vue.set(this.characters[i], 'haspring', characters_prings[i]);
          }
        }
      }

      if (summons_stars) {
        for (let i=0; i<this.summons.length && i<summons_stars.length; i++) {
          if (summons_stars[i] !== null) {
            Vue.set(this.summons[i], 'stars', summons_stars[i]);
          }
        }
      }
      if (summons_levels) {
        for (let i=0; i<this.summons.length && i<summons_levels.length; i++) {
          if (summons_levels[i] !== null) {
            Vue.set(this.summons[i], 'level', summons_levels[i]);
          }
        }
      }
      if (summons_pluses) {
        for (let i=0; i<this.summons.length && i<summons_pluses.length; i++) {
          if (summons_pluses[i] !== null) {
            Vue.set(this.summons[i], 'pluses', summons_pluses[i]);
          }
        }
      }

      if (weapons_stars) {
        for (let i=0; i<this.weapons.length && i<weapons_stars.length; i++) {
          if (weapons_stars[i] !== null) {
            Vue.set(this.weapons[i], 'stars', weapons_stars[i]);
          }
        }
      }
      else if (weapons_skill_levels) {
        for (let i=0; i<this.weapons.length && i<weapons_skill_levels.length; i++) {
          let sl = parseInt(weapons_skill_levels[i], 10);
          if (sl > 15) {
            Vue.set(this.weapons[i], 'stars', 5);
          }
          else if (sl > 10) {
            Vue.set(this.weapons[i], 'stars', 4);
          }
          else if (sl > 1) {
            Vue.set(this.weapons[i], 'stars', 3);
          }
          // SL1 means Special Skill with no SL
        }
      }
      if (weapons_skill_levels) {
        for (let i=0; i<this.weapons.length && i<weapons_skill_levels.length; i++) {
          if (weapons_skill_levels[i] !== null) {
            Vue.set(this.weapons[i], 'sklevel', weapons_skill_levels[i]);
          }
        }
      }
      if (weapons_levels) {
        for (let i=0; i<this.weapons.length && i<weapons_levels.length; i++) {
          if (weapons_levels[i] !== null) {
            Vue.set(this.weapons[i], 'level', weapons_levels[i]);
          }
        }
      }
      if (weapons_pluses) {
        for (let i=0; i<this.weapons.length && i<weapons_pluses.length; i++) {
          if (weapons_pluses[i] !== null) {
            Vue.set(this.weapons[i], 'pluses', weapons_pluses[i]);
          }
        }
      }
      if (weapons_skill_names) {
        for (let i=0; i<this.weapons.length && i<weapons_skill_names.length; i++) {
          if (weapons_skill_names[i] !== null) {
            Vue.set(this.weapons[i], 'keys', [null, null, null]);

            for (let j=0; j<weapons_skill_names[i].length; j++) {
              if (weapons_skill_names[i][j]) {
                Vue.set(this.weapons[i].keys, j, KeyData.getSkillByName(weapons_skill_names[i][j].trim()));
              }
            }
          }
        }
      }

      if ( ! Utils.isEmpty(actions)) {
        this.editMode = false;
        actions.forEach(e => {
          switch(e[2]) {
            case actionType.SUMMON:
              this.clickSummon(e[0]);
              break;
            case actionType.SKILL:
              if (e[0] < 0) {
                this.clickMCSkill(e[1]);
              } else {
                this.clickCharacterSkill(e[0], e[1]);
              }              
              break;
            case actionType.ATTACK:
              this.clickAttack();
              break;
          }
        })
        this.editMode = true;
      }        
    },
    loadParties(select_value = null) {
      this.$http.get('/party/list')
        .then(response => {
          this.parties = response.data;
          if (select_value !== null) {
            let context = this;
            Vue.nextTick().then(() => {
              context.selected_party = select_value;
            });            
          }
        })
        .catch(error => console.log(error));
    },
    /**
     * Details, damage calculator
     */
    getSummonAuras(character, chara_element) {
      let auras = {
        elemental: Object.assign({}, ratio_types),
        normal: Object.assign({}, ratio_types),
        optimus: Object.assign({}, ratio_types),
        omega: Object.assign({}, ratio_types),
        mysterious: Object.assign({}, ratio_types),
        seraphic: Object.assign({}, ratio_types),
        ranko: Object.assign({}, ratio_types),
      };

      [this.summons[0], this.summons[5]].forEach(summon => {
        if ( ! Utils.isEmpty(summon) && summon.current_data) {
          for (let aura of summon.current_data) {
            if (chara_element === aura.element || aura.element === "any") {
              // TODO formula
              auras[aura.aura_type][aura.stat] += aura.percent / 100;
            }
          }
        }
      })

      this.summons.slice(1, 5).forEach(summon => {
        if ( ! Utils.isEmpty(summon) && summon.current_data) {
          for (let aura of summon.current_data) {
            if (aura.slot === 'sub' && (chara_element === aura.element || aura.element === "any")) {
              // TODO formula
              auras[aura.aura_type][aura.stat] += aura.percent / 100;
            }
          }
        }
      })

      return auras;
    },
    getElemSuperiority(chara_element) {
      if (this.enemyElement === "none") {
        return 0;
      }

      if (elem_superiority[chara_element].superior === this.enemyElement) {
        return 0.50;
      }
      if (elem_superiority[chara_element].weak === this.enemyElement) {
        return -0.25;
      }
      return 0;
    },
    addToProbabilityTree(array, proba, value) {
      if (proba > 0) {
        if (proba === 1) {
          array.forEach(v => v.value += value);
        }
        else {
          array = array.flatMap(d => [
            { proba: d.proba * proba, value: d.value + value },
            { proba: d.proba * (1 - proba), value: d.value }
          ]);
        }
      }

      return array;
    },
  },
  computed: {
    getPlayerActions() {
      let actions = '';
      this.playerActions.forEach(a => {
        switch (a.type) {
          case actionType.SUMMON:
            actions += 'Summon ' + a.skillName + '\n';
            break;
          case actionType.SKILL:
            actions += a.sourceName + ' (' + a.skillSlot + ') ' + a.skillName + '\n';
            break;
          case actionType.ATTACK:
            actions += 'Attack\n';
            break;
        }
      })
      return actions;
    },
    isUserLogged() {
      return this.$store.getters.getUserId !== null;
    },
    getStatsFromSummons() {
      this.summonsAtk = 0;
      this.summonsHP = 0;
      
      // Support summon doesn't count in the sum
      for (let i=0; i<5; i++) {
        const s = this.summons[i];

        if (s.nameen) {
          this.summonsAtk += s.atk;
          this.summonsHP += s.hp;

          if (s.level > 1) {
            this.summonsAtk += (s.atkmlb - s.atk) / 99 * Math.min(s.level-1, 99);
            this.summonsHP += (s.hpmlb - s.hp) / 99 * Math.min(s.level-1, 99);
          }
          if (s.level > 100) {
            this.summonsAtk += (s.atkflb - s.atkmlb) / 50 * Math.min(s.level - 100, 50);
            this.summonsHP += (s.hpflb - s.hpmlb) / 50 * Math.min(s.level - 100, 50);
          }
          if (s.level > 150) {
            this.summonsAtk += (s.atkulb - s.atkflb) / 50 * Math.min(s.level - 150, 50);
            this.summonsHP += (s.hpulb - s.hpflb) / 50 * Math.min(s.level - 150, 50);
          }

          this.summonsAtk = Math.floor(this.summonsAtk);
          this.summonsHP = Math.floor(this.summonsHP);
        }
        if (s.pluses) {
          this.summonsAtk += s.pluses * 5;
          this.summonsHP += s.pluses;
        }
      }

      return [this.summonsAtk, this.summonsHP];
    },
    getStatsForCharacters() {
      let stats = [];

      for (let c of this.characters) {
        if ( ! Utils.isEmpty(c)) {
          let data = {
            atk: c.stars > 4 ? c.atkflb : c.atkmlb,
            hp: c.stars > 4 ? c.hpflb : c.hpmlb,
            name: c.nameen,
            ratio: {
              elemental: Object.assign({}, ratio_types),
              normal: Object.assign({}, ratio_types),
              optimus: Object.assign({}, ratio_types),
              omega: Object.assign({}, ratio_types),
              ex: Object.assign({}, ratio_types),
              mysterious: Object.assign({}, ratio_types),
              seraphic: Object.assign({}, ratio_types),
            },
          }

          let chara_element = DataModel.e.data[c.elementid].name.toLowerCase();
          // Characters with "any" element get the main weapon element
          if (chara_element === "any") {
            if ( ! Utils.isEmpty(this.weapons[0])) {
              chara_element = DataModel.e.data[this.weapons[0].elementid].name.toLowerCase();
            }
            else {
              chara_element = "dark";
            }
          }
          const chara_race = DataModel.ra.data[c.raceid].name.toLowerCase();
          const chara_weapons = c.weapontypeid.flatMap(w => [DataModel.w.data[w].name.toLowerCase()]);
          
          for (let w of this.weapons) {
            if ( ! Utils.isEmpty(w)) {
              // Character total attack
              let atk = w.atk;
              let hp = w.hp;

              if (w.level > 1) {
                atk += (w.atkmlb - w.atk) / 100 * Math.min(w.level, 100);
                hp += (w.hpmlb - w.hp) / 100 * Math.min(w.level, 100);
              }
              if (w.level > 100) {
                atk += (w.atkflb - w.atkmlb) / 50 * Math.min(w.level - 100, 50);
                hp += (w.hpflb - w.hpmlb) / 50 * Math.min(w.level - 100, 50);
              }
              if (w.level > 150) {
                atk += (w.atkulb - w.atkflb) / 50 * Math.min(w.level - 150, 50);
                hp += (w.hpulb - w.hpflb) / 50 * Math.min(w.level - 150, 50);
              }

              atk += w.pluses * 5;
              hp += w.pluses;

              if (c.weapontypeid.includes(w.weapontypeid)) {
                atk *= 1.2;
              }

              data.atk += Math.floor(atk);
              data.hp += Math.floor(hp);

              // Weapon skills
              if (w.current_data) {
                for (let skill_data of w.current_data.flat()) {
                  let add_value = true;
                  if (skill_data.restriction) {
                    for (let [key, value] of Object.entries(skill_data.restriction)) {
                      if (key === 'element') {
                        if ( ! value.some(v => v === chara_element)) {
                          add_value = false;
                          break;
                        }
                      }
                      else if (key === 'race') {
                        if ( ! value.some(v => v === chara_race)) {
                          add_value = false;
                          break;
                        }
                      }
                      else if (key === 'weapon') {
                        if ( ! value.some(v => chara_weapons.some(w => v === w))) {
                          add_value = false;
                          break;
                        }
                      }
                    }
                  }

                  if (add_value === true) {
                    data.ratio[skill_data.aura_type][skill_data.stat] += skill_data.value;
                  }
                }
              }
            }
          }

          data.atk += this.getStatsFromSummons[0] + c.pluses * 3;
          data.hp += this.getStatsFromSummons[1] + c.pluses;

          const chara_auras = this.getSummonAuras(c, chara_element);
          const elem_sup = this.getElemSuperiority(chara_element);

          data.elem_atk =  (1
           + elem_sup
           + chara_auras.elemental.atk
           //+ Elem EMP buffs {[Element] ATK up}
           //+ Elem ATK buffs {[Element] ATK up}
           //- Elem ATK debuffs {[Element] ATK down}
          );

          data.normal_atk = 
              (1
               + data.ratio.optimus.atk * (1 + chara_auras.optimus.atk)
               + data.ratio.normal.atk + data.ratio.normal.enmity + data.ratio.normal.stamina
               + chara_auras.normal.atk
             //+ Norm buffs (ATK up)
             //- Norm debuffs (ATK down)
          ) * (1
               + data.ratio.optimus.enmity * (1 + chara_auras.optimus.atk)
          ) * (1
               + data.ratio.optimus.stamina * (1 + chara_auras.optimus.atk)
          );
          data.omega_atk =
              (1
               + data.ratio.omega.atk * (1 + chara_auras.omega.atk)
          ) * (1 
               + data.ratio.omega.enmity * (1 + chara_auras.omega.atk)             
          ) * (1 
               + data.ratio.omega.stamina * (1 + chara_auras.omega.atk)
          );
          data.ex_atk = 
              (1
               + data.ratio.ex.atk
               + data.ratio.mysterious.atk * (1 + chara_auras.ranko.atk)
          ) * (1 
               + data.ratio.ex.enmity
          ) * (1 
               + data.ratio.ex.stamina
          );
          data.fixed_atk_mod = 0; //- Fixed ATK Modifiers {ex: 15% ATK cut from Qinglong Manewhip.}

          data.normal_omega_ex_atk = data.normal_atk * data.omega_atk * data.ex_atk - data.fixed_atk_mod;          

          data.chara_atk = (1
            //+ Jammed mod
            //+ Enmity EMP mod
            //+ Ring Enmity mod
          ) * (1
            //+ Strength mod
            //+ Stamina EMP mod
            //+ Ring Stamina mod
          ) * (1
            + (c.haspring === true ? 0.1 : 0) // Total Char Unique ATK boosts
          )

          data.total_atk = data.atk * data.elem_atk * data.normal_omega_ex_atk * data.chara_atk;

          // Apply elemental superiority
          if (elem_sup > 0) {
            data.total_atk *= (1 + data.ratio.seraphic.atk + chara_auras.seraphic.atk);            
          }
          data.total_atk = Math.floor(data.total_atk);

          // Increase atk cap
          data.atk_cap = 1
            + Object.entries(data.ratio).reduce((acc, [key, cur]) => (key != 'seraphic') ? acc + cur.atk_cap : acc, 0)
            + Object.entries(chara_auras).reduce((acc, [key, cur]) => (key != 'seraphic') ? acc + cur.atk_cap : acc, 0);
          if (elem_sup > 0) {
            data.atk_cap = data.atk_cap * (1 + data.ratio.seraphic.atk_cap + chara_auras.seraphic.atk_cap)
          }

          // Crit proba
          let crit_array = [ { proba: 1, value: 0 } ];
          data.optimus_crit = 0;
          data.omega_crit = 0;
          if (elem_sup > 0 || this.enemyElement === "none") {
            data.optimus_crit = data.ratio.optimus.crit * (1 + chara_auras.optimus.atk);
            data.omega_crit = data.ratio.omega.crit * (1 + chara_auras.omega.atk);

            crit_array = this.addToProbabilityTree(crit_array, Math.min(data.optimus_crit, 1), 0.5);
            crit_array = this.addToProbabilityTree(crit_array, Math.min(data.omega_crit, 1), 0.5);
          }

          // Add proba of duplicate values
          let crit_map = {};
          crit_array.forEach(v => {
            if (crit_map.hasOwnProperty(v.value)) {
              crit_map[v.value].proba += v.proba;
            }
            else {
              crit_map[v.value] = { proba: v.proba, value: v.value }
            }
          })
          crit_array = Object.values(crit_map);
          crit_array.forEach(v => {
            v.proba = (v.proba * 100).toFixed(2);
            v.atk = (data.total_atk / this.enemyDefense) * (1 + v.value);
          });
          crit_array.sort((a, b) => a.value - b.value);

          data.total_atk_crit = crit_array;

          // Supplemental damage
          data.supplemental_dmg = Object.values(data.ratio).reduce((acc, cur) => acc + cur.supplemental_dmg, 0);

          // Attack damage cap
          const cap_array = [
            300000 * data.atk_cap,
            300000 * data.atk_cap + 100000 * data.atk_cap * 0.8,
            300000 * data.atk_cap + 100000 * data.atk_cap * 0.8 + 100000 * data.atk_cap * 0.6,
            300000 * data.atk_cap + 100000 * data.atk_cap * 0.8 + 100000 * data.atk_cap * 0.6 + 100000 * data.atk_cap * 0.05];

          crit_array.forEach(v => {
            v.capped = false;

            if (v.atk > cap_array[3]) {
              v.atk_capped = Math.floor(cap_array[3] + (v.atk - cap_array[3]) * 0.01) + data.supplemental_dmg;
              v.capped = true;
            }
            else if (v.atk > cap_array[2]) {
              v.atk_capped = Math.floor(cap_array[2] + (v.atk - cap_array[2]) * 0.05) + data.supplemental_dmg;
            }
            else if (v.atk > cap_array[1]) {
              v.atk_capped = Math.floor(cap_array[1] + (v.atk - cap_array[1]) * 0.60) + data.supplemental_dmg;
            }
            else if (v.atk > cap_array[0]) {
              v.atk_capped = Math.floor(cap_array[0] + (v.atk - cap_array[0]) * 0.80) + data.supplemental_dmg;
            }
            else {
              v.atk_capped = Math.floor(v.atk) + data.supplemental_dmg;
            }
          });

          stats.push(data);
        }
      }

      
      return stats;
    }
  },
  watch: {
    selected_party() {
      // Firefox triggers this too early
      let context = this;
      Vue.nextTick().then(() => {
        if (context.$refs.partyId.selectedIndex > 0) {
          context.selected_party_index = context.$refs.partyId.selectedIndex;
          context.party_name = context.parties[context.selected_party_index - 1].name;
        }
        else {
          context.selected_party_index = null;
          context.party_name = "";
        }
      });      
    },
    '$store.getters.getUserId'() {
      this.loadParties();
    },
    showTab() {
      lsMgt.setValue('showTab', this);
    },
    showStats() {
      lsMgt.setValue('showStats', this);
    },
    layout() {
      lsMgt.setValue('layout', this);
    },
    enemyElement() {
      lsMgt.setValue('enemyElement', this);
    },
    enemyDefense() {
      lsMgt.setValue('enemyDefense', this);
    }
  },
  mounted() {
    lsMgt.getValue(this, 'showTab');
    lsMgt.getValue(this, 'showStats');
    lsMgt.getValue(this, 'layout');
    lsMgt.getValue(this, 'enemyElement');
    lsMgt.getValue(this, 'enemyDefense');

    /**
     * Load parties list
     */
    if (this.isUserLogged) {
      this.loadParties();
    }
    
    /**
     * Load party from URL
     */
    const urlParams = new URLSearchParams(window.location.search);

    // permaURL
    if (urlParams.has('t')) {
      const param = urlParams.get('t');
      const data = msgpack.deserialize(base64js.toByteArray(Utils.unescapeBase64(param)));
      const postData = {
        classe: Utils.isEmpty(data[0]) ? null : data[0][0],
        skills: Utils.isEmpty(data[0]) ? null : data[0].slice(1), // Skill IDs
        characters: data[1],
        summons: data[2],
        weapons: data[3],
      }

      this.$http.post('/party/load', postData)
        .then(response => this.loadParty(response.data, {actions: data[4]}))
        .catch(error => console.log(error));
    }
    // Bookmarklet
    else if (urlParams.has('l')) {
      const param = urlParams.get('l');
      const data = JSON.parse(param);
      const postData = {
        classe: data.p,
        class_skills: data.ps, // Skill names
        characters: data.c,
        summons: data.s,
        weapons: data.w,
      }

      if ( ! data.v || data.v < 4) {
        this.showBookmarklet = true;
        this.showUpdateBookmarklet = true;
      }

      this.$http.post('/party/load', postData)
        .then(response => this.loadParty(response.data, {
          characters_levels: data.cl,
          characters_stars: data.cs,
          characters_pluses: data.cp,
          characters_prings: data.cwr,
          summons_levels: data.sl,
          summons_stars: data.ss,
          summons_pluses: data.sp,
          weapons_levels: data.wll,
          weapons_skill_levels: data.wl,
          weapons_skill_names: data.wsn,
          weapons_pluses: data.wp
        }))
        .catch(error => console.log(error));
    }
    // Party ID
    else if (urlParams.has('p')) {
      const param = parseInt(urlParams.get('p'), 10);

      this.$http.get('/party/load/' + param)
        .then(response => {
          this.loadPartyFromResponse(response);
          // Preselect party if it belongs to current user
          this.parties.forEach(p => {
            if (p.id === param) {
              this.current_party = p.id;
              this.selected_party = p.id;
            }
          })
        })
        .catch(error => {console.log(error);  this.party_message = 'Party not found'});
    }
  },
}
</script>

<style scoped>

.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 0px !important;
}
  .row > span {
    margin: 5px;
  }

  .row > hr {
    height: 0px;
    width: 100%;
    visibility: hidden;
    margin: 0px;
  }

/* A big block of icons */
.block {
  display: flex;
  align-items: flex-start;    
}

.main-item-left {
  display: flex; flex-direction: column;
  margin-right: 5px;
}
.main-item-right {
  display: flex; flex-direction: column;
  margin-left: 5px
}
.main-summons {
  display: flex; flex-wrap: wrap; flex-direction: row;
  min-width: 220px; max-width: 220px;
}
.main-weapons {
  display: flex; flex-wrap: wrap; flex-direction: row;
  min-width: 315px; max-width: 315px;
}

/* Actions output */
.actions {
  display: flex;
  flex-direction: column;
  width: 500px;
}
  .actions .actions-tab {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .actions textarea {
    height: 100%;
  }

  .actions .tabs:not(:last-child) {
    margin-bottom: 0.5em;
  }

.wide-block {
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .25s
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}

</style>