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
      <!--
      <label class="mr-2">
        Enemy Defense
        <input
          class="input"
          style="width: 4ch;"
          v-model.number="enemy_defense"
          @keydown.arrow-up="enemy_defense++"
          @keydown.arrow-down="enemy_defense--"
        >
      </label>-->

      <label>
        %HP
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
            <!--<th>Atk</th>
            <th>HP</th>-->
            <th>Elem</th>
            <th><abbr title="Normal and Optimus modifiers ratio">Norm</abbr></th>
            <th>Omega</th>
            <th>Ex</th>
            <th><abbr title="Character-specific unique attack ratio">Chara</abbr></th>
            <th><abbr title="Critical damage ratio">Crit</abbr></th>
            <th>Atk cap</th>
            <!--<th>Total</th>
            <th><abbr title="Capped attack with crit ratio (probability %)">Capped w/crit</abbr></th>-->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(chara, index) in getStatsForCharacters" :key="index">
            <td class="truncate" style="max-width: 4rem;">{{ chara.name }}</td>
            <!--<td>{{ chara.atk }}</td>
            <td>{{ chara.hp }}</td>-->
            <td>{{ (chara.elem_atk * 100).toFixed(0) }}%</td>
            <td>{{ (chara.normal_atk * 100).toFixed(0) }}%</td>
            <td>{{ (chara.omega_atk * 100).toFixed(0) }}%</td>
            <td>{{ (chara.ex_atk * 100).toFixed(0) }}%</td>
            <td>{{ (chara.chara_atk * 100).toFixed(0) }}%</td>
            <td>{{ Math.floor(chara.crit * 100) }}%</td>
            <td>{{ ((chara.atk_cap-1) * 100).toFixed(0) }}%</td>                  
            <!--<td>{{ chara.total_atk }}</td>
            <td>
              <span v-for="v in chara.total_atk_crit" :key="v.value">
                {{ v.atk_capped }} ({{ v.proba }}%) [capped: {{ v.capped }}]<br>
              </span>
            </td>-->
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4">
      <span class="tag bg-red-600">Beware</span>
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
/*
const addToProbabilityTree = (array, proba, value) => {
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
};*/

export default {
  components: {
    Dropdown
  },
  data() {
    return {
      enemy_element: "water",
      enemy_defense: 10,
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
    getSummonAuras(character, chara_element) {
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
            atk: c.stars > 4 ? c.atkflb : c.atkmlb,
            hp: c.stars > 4 ? c.hpflb : c.hpmlb,
            name: c.nameen,
            ratio: {
              elemental: Object.assign({}, RATIO_TYPES),
              normal: Object.assign({}, RATIO_TYPES),
              optimus: Object.assign({}, RATIO_TYPES),
              omega: Object.assign({}, RATIO_TYPES),
              ex: Object.assign({}, RATIO_TYPES),
              mysterious: Object.assign({}, RATIO_TYPES),
              seraphic: Object.assign({}, RATIO_TYPES),
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
          
          for (let index=0; index<this.weapons.length; index++) {
            const w = this.weapons[index];

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

          data.atk += this.$store.getters.getSummonsStats.atk + c.pluses * 3;
          data.hp += this.$store.getters.getSummonsStats.hp + c.pluses;

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
          //let crit_array = [ { proba: 1, value: 0 } ];
          data.crit = 0;
          if (elem_sup > 0 || this.enemy_element === "none") {
            data.crit = data.ratio.omega.crit * (1 + chara_auras.omega.atk)
                      + data.ratio.optimus.crit * (1 + chara_auras.optimus.atk)
                      + data.ratio.normal.crit;
            //crit_array = addToProbabilityTree(crit_array, Math.min(data.crit, 1), 0.5);
          }
/*
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
            v.atk = (data.total_atk / this.enemy_defense) * (1 + v.value);
          });
          crit_array.sort((a, b) => a.value - b.value);

          data.total_atk_crit = crit_array;

          // Supplemental damage
          supplemental_dmg = Object.values(data.ratio).reduce((acc, cur) => acc + cur.supplemental_dmg, 0);

          // Attack damage cap
          const cap_array = [
            300000 * data.atk_cap,
            300000 * data.atk_cap + 100000 * data.atk_cap * 0.8,
            300000 * data.atk_cap + 100000 * data.atk_cap * 0.8 + 100000 * data.atk_cap * 0.6,
            300000 * data.atk_cap + 100000 * data.atk_cap * 0.8 + 100000 * data.atk_cap * 0.6 + 100000 * data.atk_cap * 0.05];

          crit_array.forEach(v => {
            v.capped = false;

            if (v.atk > cap_array[3]) {
              v.atk_capped = Math.floor(cap_array[3] + (v.atk - cap_array[3]) * 0.01) + supplemental_dmg;
              v.capped = true;
            }
            else if (v.atk > cap_array[2]) {
              v.atk_capped = Math.floor(cap_array[2] + (v.atk - cap_array[2]) * 0.05) + supplemental_dmg;
            }
            else if (v.atk > cap_array[1]) {
              v.atk_capped = Math.floor(cap_array[1] + (v.atk - cap_array[1]) * 0.60) + supplemental_dmg;
            }
            else if (v.atk > cap_array[0]) {
              v.atk_capped = Math.floor(cap_array[0] + (v.atk - cap_array[0]) * 0.80) + supplemental_dmg;
            }
            else {
              v.atk_capped = Math.floor(v.atk) + supplemental_dmg;
            }
          });
*/
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
    enemy_defense() {
      lsMgt.setValue('enemy_defense', this);
    }
  },
  mounted() {
    lsMgt.getValue(this, 'enemy_element');
    lsMgt.getValue(this, 'enemy_defense');
  }
}
</script>