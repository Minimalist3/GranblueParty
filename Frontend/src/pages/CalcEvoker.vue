<template>
  <div>
    <h1>Arcarum Summon and Evoker Materials Calculator</h1>

    <!-- Form -->
    <div class="flex flex-row flex-wrap items-center mb-8">

      <dropdown class="mr-2" v-model.number="evoker_index">
        <option :value="-1" disabled hidden>--- Select an Evoker ---</option>
        <option
          v-for="(target, index) in getTargets"
          :key="target.summon"
          :value="index"
        >
          {{ target.name }}
        </option>
      </dropdown>

      <span class="mr-2">
        from step
        <dropdown v-model.number="from_index" @change="selectFromStep">
          <option :value="0">No Summon</option>
          <option
            v-for="(step, index) in getSteps.slice(0, -1)"
            :key="step.name"
            :value="index + 1"
          >
            {{ step.name }}
          </option>
        </dropdown>
      </span>
      
      <span class="mr-2">
        to step
        <dropdown v-model.number="to_index">
          <option
            v-for="(step, index) in getSteps"
            :key="step.name"
            :value="index + 1"
            :disabled="from_index > index"
          >
            {{ step.name }}
          </option>
        </dropdown>
      </span>

      <checkbox v-model="splitMats">Split materials for each step</checkbox>
    </div>

    <!-- Show materials -->
    <div v-for="step in getMaterials" :key="step.name" class="mb-4">
      <h2>{{ step.name }}</h2>

      <ul>
        <li v-for="item in getItems(step.items)" :key="item.icon">
          <img :src="'/img/item/' + item.icon" style="max-height: 25px; max-width: 25px;">
          {{ item.name }} x {{ item.q }}
          <a :href="'https://gbf.wiki/' + item.name" target="_blank" ref="external" class="ml-2">
            Wiki <fa-icon :icon="['fas', 'external-link-alt']" class="text-sm"></fa-icon>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import supplies from '@/js/supplies'
import utils from '@/js/utils'

import Checkbox from '@/components/common/Checkbox.vue'
import Dropdown from '@/components/common/Dropdown.vue'

const lsMgt = new utils.LocalStorageMgt('CalcEvoker');

export default {
  components: {
    Checkbox,
    Dropdown
  },
  data() {
    return {
      evoker_index: -1,
      from_index: 0,
      to_index: 1,
      splitMats: false,
    }
  },
  methods: {
    selectFromStep() {
      // Used as start index of steps array
      lsMgt.setValue('from_index', this);
      if (this.from_index >= this.to_index) {
        this.to_index = this.from_index + 1;
      }
    },
    getItems(items) {
      return Object.values(items).sort((lhs, rhs) => {
        if (lhs.category === rhs.category) {
          // Smaller quantity first
          return lhs.q > rhs.q;
        }
        // Group by category
        return supplies.categories[lhs.category] > supplies.categories[rhs.category];
      })
    }
  },
  computed: {
    getTargets() {
      return [
        {
          name: 'Justice - Maria Theresa',
          summon: 2040236, // Justice
          character: 3040160, // Maria Theresa
          element: 'water'
        },
        {
          name: 'The Hanged Man - Caim',
          summon: 2040237, // The Hanged Man
          character: 3040164, // Caim
          element: 'earth'
        },
        {
          name: 'Death - Nier',
          summon: 2040238, // Death
          character: 3040169, // Nier
          element: 'dark'
        },
        {
          name: 'Temperance - Estarriola',
          summon: 2040239, // Temperance
          character: 3040163, // Estarriola
          element: 'wind'
        },
        {
          name: 'The Devil - Fraux',
          summon: 2040240, // The Devil
          character: 3040161, // Fraux
          element: 'fire'
        },
        {
          name: 'The Tower - Lobelia',
          summon: 2040241, // The Tower
          character: 3040165, // Lobelia
          element: 'earth'
        },
        {
          name: 'The Star - Geisenborger',
          summon: 2040242, // The Star
          character: 3040162, // Geisenborger
          element: 'light'
        },
        {
          name: 'The Moon - Haaselia',
          summon: 2040243, // The Moon
          character: 3040168, // Haaselia
          element: 'water'
        },
        {
          name: 'The Sun - Alanaan',
          summon: 2040244, // The Sun
          character: 3040167, // Alanaan
          element: 'fire'
        },
        {
          name: 'Judgement - Katzelia',
          summon: 2040245, // Judgement
          character: 3040166, // Katzelia
          element: 'wind'
        },
      ];
    },
    getSteps() {
      return [
        {
          name: 'SR Summon 0*',
          items: [
            {
              item: 'sephirastone',
              q: 2
            },
            {
              item: 'flawlessprism',
              q: 100
            },
            {
              ref: 'astra',
              q: 3
            },
            {
              ref: 'idean',
              q: 2
            },
            {
              ref: 'verum',
              q: 6
            },
            {
              ref: 'omegaanima',
              q: 30
            },
            {
              ref: 'haze',
              q: 1
            },
          ]
        },
        {
          name: 'SR Summon 1*',
          items: [
            {
              item: 'sephirastone',
              q: 5
            },
            {
              item: 'rainbowprism',
              q: 100
            },
            {
              ref: 'astra',
              q: 5
            },
            {
              ref: 'idean',
              q: 3
            },
            {
              ref: 'verum',
              q: 16
            },
            {
              ref: 'quartz',
              q: 100
            },
            {
              ref: 'haze',
              q: 3
            },
          ]
        },
        {
          name: 'SR Summon 2*',
          items: [
            {
              item: 'sephirastone',
              q: 10
            },
            {
              ref: 'astra',
              q: 10
            },
            {
              ref: 'idean',
              q: 5
            },
            {
              ref: 'verum',
              q: 30
            },
            {
              ref: 't1anima',
              q: 30
            },
            {
              ref: 'haze',
              q: 7
            },
          ]
        },
        {
          name: 'SR Summon 3*',
          items: [
            {
              item: 'sephirastone',
              q: 15
            },
            {
              item: 'legendarymerit',
              q: 3
            },
            {
              ref: 'astra',
              q: 15
            },
            {
              ref: 'idean',
              q: 7
            },
            {
              ref: 'verum',
              q: 50
            },
            {
              ref: 't2anima',
              q: 30
            },
            {
              ref: 'haze',
              q: 16
            },
          ]
        },
        {
          name: 'Upgrade Summon to SSR',
          items: [
            {
              item: 'sephirastone',
              q: 30
            },
            {
              item: 'silvercentrum',
              q: 5
            },
            {
              item: 'sunlightstone',
              q: 1
            },
            {
              ref: 'astra',
              q: 30
            },
            {
              ref: 'idean',
              q: 15
            },
            {
              ref: 'verum',
              q: 80
            },
            {
              ref: 'primarchanima',
              q: 20
            },
            {
              ref: 'haze',
              q: 24
            },
          ]
        },  
        {
          name: 'SSR Summon 4*',
          items: [
            {
              item: 'sephirastone',
              q: 45
            },
            {
              ref: 'astra',
              q: 45
            },
            {
              ref: 'idean',
              q: 25
            },
            {
              ref: 'verum',
              q: 120
            },
            {
              ref: 'haze',
              q: 32
            },
            {
              ref: 'omega2omegaanima',
              q: 10
            },
            {
              ref: 'arcarumfragment',
              q: 10
            },
          ]
        },
        {
          name: 'SSR Summon 5*',
          items: [
            {
              ref: 'coopshowdownitem',
              q: 100
            },
            {
              ref: 'trialfragment',
              q: 50
            },
            {
              ref: 'verum',
              q: 250
            },
            {
              ref: 'arcarumssr5treasure',
              q: 50
            },
            {
              item: 'genesisfragment',
              q: 80
            },
            {
              item: 'primevalhorn',
              q: 10
            },
            {
              ref: 'arcarumfragment',
              q: 20
            },
          ]
        },
        {
          name: 'Recruit Evoker',
          items: [
            {
              ref: 'idean',
              q: 20
            },
            {
              ref: 'astra',
              q: 200
            },
            {
              item: 'sephirastone',
              q: 30
            },
            {
              item: 'sephiraevolite',
              q: 1
            },
          ]
        },
        {
          name: 'Uncap Evoker 1*',
          items: [
            {
              ref: 'verum',
              q: 2
            },
            {
              item: 'flawlessprism',
              q: 5
            },
            {
              item: 'suprememerit',
              q: 1
            },      
            {
              item: 'rupie',
              q: 1000
            },
          ]
        },
        {
          name: 'Uncap Evoker 2*',
          items: [
            {
              ref: 'astra',
              q: 1
            },
            {
              ref: 'verum',
              q: 2
            },
            {
              item: 'flawlessprism',
              q: 10
            },
            {
              ref: 'dragonscale',
              q: 1
            },
            {
              item: 'suprememerit',
              q: 3
            },      
            {
              item: 'rupie',
              q: 2000
            },
          ]
        },
        {
          name: 'Uncap Evoker 3*',
          items: [
            {
              ref: 'astra',
              q: 2
            },
            {
              ref: 'verum',
              q: 6
            },
            {
              item: 'rainbowprism',
              q: 3
            },
            {
              ref: 'idean',
              q: 1
            },
            {
              item: 'suprememerit',
              q: 6
            },      
            {
              item: 'rupie',
              q: 4000
            },
          ]
        },
        {
          name: 'Uncap Evoker 4*',
          items: [
            {
              ref: 'astra',
              q: 3
            },
            {
              ref: 'verum',
              q: 10
            },
            {
              ref: 'haze',
              q: 3
            },
            {
              ref: 'idean',
              q: 1
            },
            {
              item: 'suprememerit',
              q: 10
            },      
            {
              item: 'rupie',
              q: 20000
            },
          ]
        },
      ];
    },
    getMaterials() {
      let steps = [];

      if (this.evoker_index === -1) {
        // No evoker selected
        return steps;
      }
      if (this.from_index >= this.to_index) {
        // Invalid from/to selection
        return steps;
      }

      const evoker = this.getTargets[this.evoker_index];

      for (let i=this.from_index; i<this.to_index; i++) {
        // Create a step
        const stepData = this.getSteps[i];
        let step = {
          name: this.splitMats ? stepData.name : 'Total materials needed:',
          items: {},
        };

        // Get materials for the step
        for (let itemData of stepData.items) {
          let supplyRefs = [];
          
          if (itemData.item) {
            supplyRefs.push(itemData.item);
          }
          else if (itemData.ref) {
            switch (supplies.groups[itemData.ref].type) {
              case 'element': {
                const tmpRef = supplies.groups[itemData.ref][evoker.element];
                if (tmpRef instanceof Array) {
                  supplyRefs = tmpRef;
                }
                else {
                  supplyRefs.push(tmpRef);
                }
              } break;
              case 'summon': {
                const tmpRef = supplies.groups[itemData.ref][evoker.summon];
                if (tmpRef instanceof Array) {
                  supplyRefs = tmpRef;
                }
                else {
                  supplyRefs.push(tmpRef);
                }
              } break;
            }            
          }
          else {
            console.log("Unknown type of item for:");
            console.log(itemData);
          }

          for (let supplyRef of supplyRefs) {
            const item = {
              name: supplies.items[supplyRef].name,
              category: supplies.items[supplyRef].category,
              icon: supplyRef + '.jpg',
              q: itemData.q / supplyRefs.length,
              done: false,
            }
            step.items[supplyRef] = item;
          }          
        }

        if (this.splitMats || steps.length === 0) {
          steps.push(step);
        }
        else {
          // Merge materials
          for (let [k, v] of Object.entries(step.items)) {
            if (k in steps[0].items) {
              steps[0].items[k].q += v.q;
            }
            else {
              steps[0].items[k] = v;
            }
          }
        }
      }

      return steps;
    },
  },
  watch: {
    evoker_index() {
      lsMgt.setValue('evoker_index', this);
    },
    to_index() {
      // Used as stop index of steps array
      lsMgt.setValue('to_index', this);
    },
    splitMats() {
      lsMgt.setValue('splitMats', this);
    }
  },
  created() {
    lsMgt.getValue(this, 'evoker_index');
    lsMgt.getValue(this, 'from_index');
    lsMgt.getValue(this, 'to_index');
    lsMgt.getValue(this, 'splitMats');
  }
}
</script>