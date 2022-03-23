<template>
  <div class="flex flex-col">
    <!-- Options -->
    <div class="flex flex-row flex-wrap items-center">
      <label class="mr-2">
        Enemy Element
        <dropdown v-model="enemy_element">
          <option value="fire">Fire</option>
          <option value="wind">Wind</option>
          <option value="earth">Earth</option>
          <option value="water">Water</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="none">None</option>
        </dropdown>
      </label>
      <label>
        HP%
        <input
          class="input"
          style="width: 5ch;"
          v-model.number="percentHP"
          @keydown.arrow-up="percentHP++"
          @keydown.arrow-down="percentHP--">
      </label>
    </div>

    <!-- Table -->
    <div class="overflow-y-auto" v-if="getStatsForCharacters.length > 0">
      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th>Elem</th>
            <th><abbr title="Normal and Optimus modifiers ratio">Norm</abbr></th>
            <th><abbr title="Omega">&#x3A9;</abbr></th>
            <th>Ex</th>
            <th><abbr title="Character-specific unique attack ratio">Chara</abbr></th>
            <th><abbr title="Critical damage ratio">Crit</abbr></th>
            <th><abbr title="Double attack ratio">DA</abbr></th>
            <th><abbr title="Triple attack ratio">TA</abbr></th>
            <!--<th><abbr title="Attack cap">Cap</abbr></th>-->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(chara, index) in getStatsForCharacters" :key="index">
            <td class="truncate" style="max-width: 4rem;">{{ chara.name }}</td>
            <td>{{ (chara.elem_atk * 100).toFixed(0) }}%</td>
            <td>{{ (chara.normal_atk * 100).toFixed(0) }}%</td>
            <td>{{ (chara.omega_atk * 100).toFixed(0) }}%</td>
            <td>{{ (chara.ex_atk * 100).toFixed(0) }}%</td>
            <td>{{ (chara.chara_atk * 100).toFixed(0) }}%</td>
            <td>{{ Math.floor(chara.crit * 100) }}%</td>
            <td>{{ Math.min(75, (chara.da * 100).toFixed(0)) }}%</td>
            <td>{{ Math.min(75, (chara.ta * 100).toFixed(0)) }}%</td>
            <!--<td>{{ ((chara.atk_cap-1) * 100).toFixed(0) }}%</td>-->
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4">
      <span class="tag bg-red-500">Warning</span>
      Some things might still be missing.
      Mouse over the skills and summons to see what's already implemented.
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Utils from '@/js/utils.js'
import DataModel from '@/js/data-model'

import Dropdown from '@/components/common/Dropdown.vue';

const lsMgt = new Utils.LocalStorageMgt('PartyBuilder');

const RATIO_TYPES = {
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

const ELEM_SUPERIORITY = {
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
};

export default {
  components: {
    Dropdown
  },
  data() {
    return {
      enemy_element: "water",
      // enemy_defense: 10,
    }
  },
  methods: {
    getElemSuperiority(chara_element) {
      if (this.enemy_element === "none") {
        return 0;
      }

      if (ELEM_SUPERIORITY[chara_element].superior === this.enemy_element) {
        return 0.50;
      }
      if (ELEM_SUPERIORITY[chara_element].weak === this.enemy_element) {
        return -0.25;
      }
      return 0;
    },
    getSummonAuras(chara_element) {
      let auras = {
        elemental: Object.assign({}, RATIO_TYPES),
        normal: Object.assign({}, RATIO_TYPES),
        optimus: Object.assign({}, RATIO_TYPES),
        omega: Object.assign({}, RATIO_TYPES),
        mysterious: Object.assign({}, RATIO_TYPES),
        seraphic: Object.assign({}, RATIO_TYPES),
        ranko: Object.assign({}, RATIO_TYPES),
      };

      [this.summons[0], this.summons[5]].forEach(summon => {
        if ( ! Utils.isEmpty(summon) && summon.current_data !== undefined) {
          for (let aura of summon.data[summon.current_data]) {
            if (chara_element === aura.element || aura.element === "any") {
              // TODO formula
              auras[aura.aura_type][aura.stat] += aura.percent / 100;
            }
          }
        }
      })

      this.summons.slice(1, 5).forEach(summon => {
        if ( ! Utils.isEmpty(summon) && summon.current_data !== undefined) {
          for (let aura of summon.data[summon.current_data]) {
            if (aura.slot === 'sub' && (chara_element === aura.element || aura.element === "any")) {
              // TODO formula
              auras[aura.aura_type][aura.stat] += aura.percent / 100;
            }
          }
        }
      })

      this.summons.slice(6, 8).forEach(summon => {
        if ( ! Utils.isEmpty(summon) && summon.current_data !== undefined) {
          for (let aura of summon.data[summon.current_data]) {
            if (aura.slot === 'sub' && (chara_element === aura.element || aura.element === "any")) {
              // TODO formula
              auras[aura.aura_type][aura.stat] += aura.percent / 100;
            }
          }
        }
      })

      return auras;
    },
  },
  computed: {
    ...mapState({
      characters: state => state.party_builder.characters,
      summons: state => state.party_builder.summons,
      weapons: state => state.party_builder.weapons,
    }),
    percentHP: {
      get() { return this.$store.state.party_builder.percent_HP },
      set(value) { this.$store.commit('setPercentHP', value) }
    },
    getStatsForCharacters() {
      let stats = [];

      for (let c of this.characters) {
        if ( ! Utils.isEmpty(c)) {
          let data = {
            name: c.nameen,
            ratio: {
              elemental: Object.assign({}, RATIO_TYPES),
              normal: Object.assign({}, RATIO_TYPES),
              optimus: Object.assign({}, RATIO_TYPES),
              omega: Object.assign({}, RATIO_TYPES),
              ex: Object.assign({}, RATIO_TYPES),
              mysterious: Object.assign({}, RATIO_TYPES),
              seraphic: Object.assign({}, RATIO_TYPES),
            }
          };

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
          
          for (let index=0; index<this.weapons.length; index++) {
            const w = this.weapons[index];

            if ( ! Utils.isEmpty(w)) {
              // Weapon skills
              for (let skill_data of this.$store.getters.getWeaponsCurrentData[index].flat()) {
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

          const chara_auras = this.getSummonAuras(chara_element);
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

          // Increase atk cap
          //data.atk_cap = 1
          //  + Object.entries(data.ratio).reduce((acc, [key, cur]) => (key != 'seraphic') ? acc + cur.atk_cap : acc, 0)
          //  + Object.entries(chara_auras).reduce((acc, [key, cur]) => (key != 'seraphic') ? acc + cur.atk_cap : acc, 0);
          //if (elem_sup > 0) {
          //  data.atk_cap = data.atk_cap * (1 + data.ratio.seraphic.atk_cap + chara_auras.seraphic.atk_cap)
          //}

          // Crit proba
          data.crit = 0;
          if (elem_sup > 0 || this.enemy_element === "none") {
            data.crit = data.ratio.omega.crit * (1 + chara_auras.omega.atk)
                      + data.ratio.optimus.crit * (1 + chara_auras.optimus.atk)
                      + data.ratio.normal.crit;
          }

          // DA/TA
          data.da =  data.ratio.omega.da * (1 + chara_auras.omega.atk)
                   + data.ratio.optimus.da * (1 + chara_auras.optimus.atk)
                   + data.ratio.normal.da;
          data.ta =  data.ratio.omega.ta * (1 + chara_auras.omega.atk)
                   + data.ratio.optimus.ta * (1 + chara_auras.optimus.atk)
                   + data.ratio.normal.ta;

          stats.push(data);
        }
      }
      
      return stats;
    }
  },
  watch: {
    enemy_element() {
      lsMgt.setValue('enemy_element', this);
    },
  },
  mounted() {
    lsMgt.getValue(this, 'enemy_element');
  }
}
</script>