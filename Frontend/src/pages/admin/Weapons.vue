<template>
  <div class="flex flex-col">
    <div class="flex flex-row flex-wrap items-center mb-4">
      <a class="mr-4" href="/admin">Up</a>
      <button class="btn btn-white mr-4" @click="saveData()">Save</button>
      <button class="btn btn-white mr-4" @click="hideNonEmptySkills()">Hide</button>

      <input class="" type="checkbox" id="hide_skill_job_weapon" v-model="hide_skill_job_weapon">
      <label for="hide_skill_job_weapon">hide_skill_job_weapon</label>
    </div>

    Skills: {{ getSkills.length }}

    <div 
      class="flex flex-row items-center mb-4 space-x-2 border-b-2"
      v-for="(item, index) in getSkills" :key="item.skillname + item.icon"
    >
      <span>{{ index }}</span>
      <span>
        <img style="min-width: 20px; width: 30px;" :src="'/img/weapon_skills/' + item.icon">
      </span>
      <span>
        {{ item.skillname }}<br>
        {{ item.icon }}
        <span v-if="item.boost"><br>{{ item.boost }}</span>
      </span>
      <span class="w-32" v-if="item.weapons">
        <a :href="'https://gbf.wiki/' + item.weapons[0].nameen" target="_blank">
          Wiki link
          <!--<img style="height: 60px;" :src="'/img/weapon/' + item.weapons[0].weaponid + '00.jpg'">--><br>
        </a>            
        <span>
          <dropdown class="w-32" value="0">
            <option v-for="(weapon, index) in item.weapons" :key="item.skillname+index+item.icon+weapon.weaponid" :value="index">
              {{ weapon.nameen }}
            </option>
          </dropdown>
          {{ item.weapons.length }}
        </span>
      </span>
      <span>
        <button class="btn btn-blue btn-sm" @click="addProp(item)">+</button>
      </span>
      <span class="flex flex-grow">
        <span v-if="item.data" class="flex flex-col flex-grow space-y-2">
          <weapon-props v-for="(d, i) in item.data" :key="i" :object="d"></weapon-props>
        </span>
      </span>
      <span>
        <button class="btn btn-blue btn-sm" @click="removeProp(item)">-</button>
      </span>
    </div>

  </div>
</template>

<script>
import WeaponProps from './WeaponProps.vue'
import Dropdown from '@/components/common/Dropdown.vue'

/**
 * .data object
 [
    percent: { // Object for stats with multiple values
      1: 0,    // Number for stamina (modifier value)
      10: 0,
      15: 0,
      20: 0
    }

    restriction: { // An Object of restrictions. The character must match one of each category.
                   // Each category is an array of at least one restriction
                   // Or null, if no restrictions
      "element": ["", ...], // Can be fire, wind, water, earth, light, dark, any. Default: any
      "weapon": ["", ...],  // Can be axe, ..., any. Default: any.
      "race": ["", ...]     // Can be human, ..., any. Default: any.
    }
    aura_type: '' // Can be elemental, normal, optimus, omega, ex, mysterious, seraphic
    stat: '' // Can be atk, atk_cap, hp, da, ta, crit, ca_dmg, ca_cap, chainburst_dmg, chainburst_cap, stamina, enmity, supplemental_dmg

    slot: '' // The slot this aura takes effect. Can be main. Default: undefined (all)
    condition: '' // For baha, cosmic, atma keys, ... TODO
  ]
 */
export default {
  components: {
    WeaponProps,
    Dropdown
  },
  head: {
    title: 'Granblue.Party - Admin',
    desc: '',
    image: '',
    keywords: ''
  },
  data() {
    return {
      message: [],
      hide_skill_job_weapon: true,
    }
  },
  methods: {
    saveData() {
      let postdata = {
        data: [],
      }

      this.message.forEach(s => {
        if (s.data) {
          postdata.data.push([s.skilldataid, { data: s.data }]);
        }
        else {
          postdata.data.push([s.skilldataid, null]);
        }
      })

      this.axios.post('/admin/weapons', postdata)
        .then(response => this.$store.dispatch('addMessage', {message: 'Saved'}))
        .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
    },
    addProp(item) {
      if ( ! item.data) {
        this.$set(item, 'data', []);
      }
      item.data.push({percent: {}});
    },
    removeProp(item) {
      if (item.data) {
        item.data.pop();
        
        if (item.data.length === 0) {
          this.$delete(item, 'data');
        }
      }
    },
    hideNonEmptySkills() {
      this.message.forEach(s => {
        if (s.data !== null) {
          this.$set(s, 'hide', true);
        }
      })
    }
  },
  computed: {
    getSkills() {
      return this.message.flatMap(s => {
        if (s.hide === true || s.icon === 'ws_skill_blank.png' || (s.icon === 'ws_skill_job_weapon.png' && this.hide_skill_job_weapon === true)) {
          return [];
        }
        return [s];
      });
    }
  },
  mounted() {
    this.axios.get('/admin/weapons')
      .then(response => {
        for (let s of response.data) {
          if (s.data) {
            s.data = s.data.data;
          }
        }
        this.message = response.data;
      })
      .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
  }
}
</script>