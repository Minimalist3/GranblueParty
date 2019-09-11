<template>
  <div>
    <div>
      <a href="/admin">Up</a>
      <button
        class="button is-light is-outlined"
        @click="saveData()"
      >
        Save
      </button>
      <button
        class="button is-info is-outlined"
        @click="hideNonEmptySkills()"
      >
        Hide
      </button>

      <input class="switch is-rounded is-info" type="checkbox" id="hide_skill_job_weapon" v-model="hide_skill_job_weapon">
      <label for="hide_skill_job_weapon">hide_skill_job_weapon</label>
    </div>

    Skills: {{ getSkills.length }}

    <table class="table is-narrow is-fullwidth has-background-dark">
      <tbody>
        <tr
          v-for="(item, index) in getSkills"
          :key="item.skillname + item.icon"
        >
          <td>
            {{ index }}
          </td>
          <td>
            <img style="min-width: 20px; width: 30px;" :src="'/img/weapon_skills/' + item.icon">
          </td>
          <td>
            {{ item.skillname }}<br>
            {{ item.icon }}
          </td>
          <td>
            <a :href="'https://gbf.wiki/' + item.weapons[0].nameen" target="_blank">
              Wiki link
              <!--<img style="height: 60px;" :src="'/img/weapon/' + item.weapons[0].weaponid + '00.jpg'">--><br>
            </a>            
            <span>
              <div class="select is-small">
                <select>
                  <option v-for="weapon in item.weapons" :key="weapon.weaponid">{{ weapon.nameen }}</option>
                </select>
              </div> {{ item.weapons.length }}
            </span>
          </td>
          <td>
            <button class="button is-small is-dark" @click="addProp(item)">+</button>
          </td>
          <td>
            <span v-if="item.data">
              <weapon-props v-for="(d, i) in item.data" :key="i" :object="d"></weapon-props>
            </span>
            <!--
            <textarea
              class="textarea has-background-dark has-text-grey-light"
              spellcheck="false"
              style="width: 70ch; font-size: 12px; font-family: monospace;"
              v-model="item.data"
            ></textarea>
            -->
          </td>
          <td>
            <button class="button is-small is-dark" @click="removeProp(item)">-</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import WeaponProps from './WeaponProps.vue'

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

      this.$http.post('/admin/weapons', postdata)
        .then(response => console.log('Saved'))
        .catch(error => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data.error.message);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser
            console.log("Cannot contact login server");
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log(error.message);
          }
        });
    },
    addProp(item) {
      if ( ! item.data) {
        Vue.set(item, 'data', []);
      }
      item.data.push({percent: {}});
    },
    removeProp(item) {
      if (item.data) {
        item.data.pop();
        
        if (item.data.length === 0) {
          Vue.delete(item, 'data');
        }
      }
    },
    hideNonEmptySkills() {
      this.message.forEach(s => {
        if (s.data !== null) {
          Vue.set(s, 'hide', true);
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
    this.$http.get('/admin/weapons')
            .then(response => {
              for (let s of response.data) {
                if (s.data) {
                  s.data = s.data.data;
                }
              }
              this.message = response.data;
            })
            .catch(error => console.log(error));
  }
}
</script>

<style scoped>

.table {
    color: hsl(0, 0%, 98%);
}

</style>
