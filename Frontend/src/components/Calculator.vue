<template>
  <div class="flex flex-col items-center lg:w-3/4">
    <!-- Toolbar -->
    <div class="flex flex-row flex-wrap gap-4 items-center">
      <span>
        <dropdown v-model.number="unit_index" v-if="Object.keys(getUnitToAdd).length > 0" >
          <option :value="-1" disabled hidden>--- Select {{ unitsLabel }} ---</option>
          <option
            v-for="(target, index) in getUnitToAdd"
            :key="target.summon"
            :value="index"
          >
            {{ target.name }}
          </option>
        </dropdown>
        <button class="btn btn-blue" @click="addUnit()" :disabled="unit_index < 0" v-if="Object.keys(getUnitToAdd).length > 0" >
          Add
        </button>
      </span>

      <checkbox v-model="splitMats">Split materials for each step</checkbox>
      <checkbox v-model="hideCompletedMats">Hide completed materials</checkbox>
      <label>Display:&nbsp;
        <dropdown v-model.number="displayList">
          <option :value="0">Grid</option>
          <option :value="1">List</option>
        </dropdown>
      </label>
    </div>

    <!-- Unit box -->
    <div v-for="(_, unitKey) in progress" :key="unitKey" class="flex flex-col mt-8 border-4 border-secondary rounded p-1 lg:p-4 bg-tertiary w-full">

      <span class="text-3xl font-bold self-center">
        <a class="cursor-pointer" @click="toggleFolded(progress[unitKey])">
          {{ getUnits[unitKey].name }}
          <fa-icon v-if="progress[unitKey].fold" :icon="['fas', 'angle-right']" class="ml-2"></fa-icon>
          <fa-icon v-else :icon="['fas', 'angle-down']" class="ml-2"></fa-icon>
        </a>
      </span>

      <span v-if=" ! progress[unitKey].fold" class="flex flex-col mt-6">
        <!-- Options -->
        <div class="flex flex-row flex-wrap self-center items-center gap-2">
          <span>Completed step</span>
          <dropdown v-model.number="progress[unitKey].from" @change="selectFromStep(unitKey)">
            <option :value="-1">-- Nothing --</option>
            <option
              v-for="(step, index) in getUnitsMaterials.slice(0, -1)"
              :key="step.name"
              :value="index"
            >
              {{ step.name }}
            </option>
          </dropdown>

          <span>Target step</span>
          <dropdown v-model.number="progress[unitKey].to">
            <option
              v-for="(step, index) in getUnitsMaterials"
              :key="step.name"
              :value="index"
              :disabled="progress[unitKey].from >= index"
            >
              {{ step.name }}
            </option>
          </dropdown>
        </div>

        <!-- Materials -->
        <div v-for="(material, matKey) in getMaterialsFor(unitKey)" :key="matKey">
          <h2 class="my-4">{{ material.name }}</h2>

          <div v-if="displayList == 0" class="flex flex-row flex-wrap gap-1">
            <calc-preview-item v-for="(item, keyItem) in filterCompletedItems(unitKey, matKey, material.items)" :key="keyItem"
              :tag="item.item"
              :name="item.name"
              :quantity="getQuantityForItem(unitKey, matKey, item.item)"
              @update:quantity="val => setQuantityForItem(unitKey, matKey, item, val)"
              :max="item.max"
              :animated="item.animated"
              class="border-secondary border rounded"
            ></calc-preview-item>
          </div>
          <div v-else class="flex flex-col">
            <calc-preview-list v-for="(item, keyItem) in filterCompletedItems(unitKey, matKey, material.items)" :key="keyItem"
              :tag="item.item"
              :name="item.name"
              :quantity="getQuantityForItem(unitKey, matKey, item.item)"
              @update:quantity="val => setQuantityForItem(unitKey, matKey, item, val)"
              :max="item.max"
              :animated="item.animated"
            ></calc-preview-list>
          </div>
        </div>

      </span>
    </div>
  </div>
</template>

<script>
import supplies from '@/js/supplies'
import utils from '@/js/utils'

import Checkbox from '@/components/common/Checkbox.vue'
import Dropdown from '@/components/common/Dropdown.vue'
import CalcPreviewItem from '@/components/CalcPreviewItem.vue'
import CalcPreviewList from '@/components/CalcPreviewList.vue'

class UnitProgress {
  constructor(dataLength) {
    this.from = -1;
    this.to = 0;
    this.fold = false;
    this.materials = Array.from({length: dataLength}, _ => { return {} });
  }
}

const sortMaterials = (lhs, rhs) => {
  if (lhs.category === rhs.category) {
    // Smaller quantity first
    return lhs.max > rhs.max;
  }
  // Group by category
  return lhs.category > rhs.category;
};

class MaterialStep {
  constructor(name, items) {
    this.name = name;
    this.items = items;
  }
}

export default {
  components: {
    Checkbox,
    Dropdown,
    CalcPreviewItem,
    CalcPreviewList
  },
  props: {
    // { 2040236: new UnitProgress([{chaotichaze: 0, ...}, ...]), ... }
    unitsProgress: {
      type: Object,
      required: true
    },
    unitsData: {
      type: Object,
      required: true,
    },
    unitsLabel: {
      type: String,
      required: true
    },
    unitsSplitMats: {
      type: Boolean,
      required: true
    },
    unitsHideCompletedMats: {
      type: Boolean,
      required: true
    },
    unitsDisplayList: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      unit_index: -1,
    };
  },
  methods: {
    addUnit() {
      this.$set(this.progress, this.unit_index, new UnitProgress(this.unitsData.materials.length));      
      this.unit_index = -1;
    },
    getItemProgressFor(unitKey, item, materialStep) {
      let itemRefs = [];

      if (item.item) {
        itemRefs.push(item.item);
      }
      else if (item.group) {
        switch (supplies.groups[item.group].type) {
          case 'element': {
            const tmpRef = supplies.groups[item.group][this.unitsData.units[unitKey].element];
            if (tmpRef instanceof Array) {
              itemRefs = tmpRef;
            }
            else {
              itemRefs.push(tmpRef);
            }
          } break;
          case 'summon': {
            const tmpRef = supplies.groups[item.group][unitKey];
            if (tmpRef instanceof Array) {
              itemRefs = tmpRef;
            }
            else {
              itemRefs.push(tmpRef);
            }
          } break;
        }
      }
      else {
        console.log("Unknown type of item for:");
        console.log(item);
      }

      let resultArray = [];
      for (let itemRef of itemRefs) {
        if (this.progress[unitKey].materials[materialStep][itemRef] === undefined) {
          this.$set(this.progress[unitKey].materials[materialStep], itemRef, 0);
        }

        // Round non integer values
        let max = item.q / itemRefs.length;
        if (item.q % itemRefs.length > 0) {
          if (max < 5) max = Math.ceil(max);
          else max = Math.floor(max);
        }

        if (supplies.items[itemRef] === undefined) {
          console.log(itemRef + ' does not exist.')
        }

        resultArray.push({
          item: itemRef,
          group: item.group,
          name: supplies.items[itemRef].name,
          category: supplies.items[itemRef].category,
          max: max,
          animated: supplies.items[itemRef].animated,
        });
      }
      return resultArray;
    },
    getMaterialsFor(unitKey) {
      const result = [];

      // In case steps are added later
      while (this.unitsData.materials.length > this.progress[unitKey].materials.length) {
        this.progress[unitKey].materials.push({});
      }

      if (this.splitMats) {
        this.unitsData.materials
          .slice(this.progress[unitKey].from + 1, this.progress[unitKey].to + 1)
          .forEach((items, index) => {
            result.push(new MaterialStep(
              items.name,
              Object.values(items.items
                  .flatMap(item => this.getItemProgressFor(unitKey, item, index + this.progress[unitKey].from + 1))
                  .reduce((buffer, item) => {
                    // Merge materials
                    if (buffer.hasOwnProperty(item.item)) {
                      buffer[item.item].max += item.max;
                    }
                    else {
                      buffer[item.item] = item;
                    }
                    return buffer;
                  }, {})
              )
              .sort(sortMaterials)
            ));
          });
      }
      else {
        const buffer = {};
        this.unitsData.materials
          .slice(this.progress[unitKey].from + 1, this.progress[unitKey].to + 1)
          .forEach((items, index) => {
            items.items
              .flatMap(item => this.getItemProgressFor(unitKey, item, index + this.progress[unitKey].from + 1))
              .forEach(item => {
                // Merge materials
                if (buffer.hasOwnProperty(item.item)) {
                  buffer[item.item].max += item.max;
                }
                else {
                  buffer[item.item] = item;
                }
              });
          });

        result.push(new MaterialStep('Materials', Object.values(buffer)));
        result[0].items.sort(sortMaterials);
      }

      return result;
    },
    selectFromStep(unitKey) {
      // Dropdown takes some time to update
      this.$nextTick().then(() => {
        if (this.progress[unitKey].from >= this.progress[unitKey].to) {
          this.progress[unitKey].to = this.progress[unitKey].from + 1;
        }
      });
    },
    filterCompletedItems(unitKey, matKey, items) {
      if (this.hideCompletedMats) {
        return items.filter(item => this.getQuantityForItem(unitKey, matKey, item.item) != item.max);
      }
      return items;
    },
    toggleFolded(progressForUnit) {
      this.$set(progressForUnit, 'fold', ! progressForUnit.fold);
    },
    getQuantityForItem(unitKey, matKey, itemKey) {
      if (this.splitMats) {
        return this.progress[unitKey].materials[matKey + this.progress[unitKey].from + 1][itemKey];
      }
      return this.progress[unitKey].materials
        .slice(matKey + this.progress[unitKey].from + 1, matKey + this.progress[unitKey].to + 1)
        .reduce((acc, items) => {
          if (items.hasOwnProperty(itemKey)) {
            return acc + items[itemKey];
          }
          return acc;
        }, 0);
    },
    setQuantityForItem(unitKey, matKey, item, value) {
      if (this.splitMats) {
        this.progress[unitKey].materials[matKey + this.progress[unitKey].from + 1][item.item] = value;
      }
      else {
        let totalToAdd = value;
        this.progress[unitKey].materials
          .slice(matKey + this.progress[unitKey].from + 1, matKey + this.progress[unitKey].to + 1)
          .forEach((items, index) => {
            if (items.hasOwnProperty(item.item)) {
              // Find max quantity of item
              const foundItem = this.unitsData.materials[matKey + this.progress[unitKey].from + index + 1].items.find(i => 
                i.item ? i.item == item.item : i.group == item.group
              );
              // Protection against bad localStorage data
              if (foundItem) {
                const max = foundItem.q;
                const toAdd = Math.min(totalToAdd, max);
                this.progress[unitKey].materials[matKey + this.progress[unitKey].from + index + 1][item.item] = toAdd;
                totalToAdd -= toAdd;
              }
            }
          });
      }
    },
  },
  computed: {
    getUnitToAdd() {
      return utils.filterObject(this.unitsData.units, ([key, _]) => ! this.progress.hasOwnProperty(key));
    },
    getUnits() {
      return this.unitsData.units;
    },
    getUnitsMaterials() {
      return this.unitsData.materials;
    },
    localQuantity: {
      get() {
        return this.quantity;
      },
      set(value) {
        this.$emit('update:quantity', value);
      }
    },
    progress: {
      get() {
        return this.unitsProgress;
      },
      set(value) {
        this.$emit('update:unitsProgress', value);
      }
    },
    splitMats: {
      get() {
        return this.unitsSplitMats;
      },
      set(value) {
        this.$emit('update:unitsSplitMats', value);
      }
    },
    hideCompletedMats: {
      get() {
        return this.unitsHideCompletedMats;
      },
      set(value) {
        this.$emit('update:unitsHideCompletedMats', value);
      }
    },
    displayList: {
      get() {
        return this.unitsDisplayList;
      },
      set(value) {
        this.$emit('update:unitsDisplayList', value);
      }
    },
  },
};
</script>