<template>
  <div class="flex flex-col flex-wrap gap-4 items-center">
    <h1>Bullets Calculator</h1>

    <!-- Toolbar -->
    <div class="flex flex-row flex-wrap gap-4 items-center">
      <label>Display bullets:&nbsp;
        <dropdown v-model.number="displayList">
          <option :value="0">Grid</option>
          <option :value="1">List</option>
        </dropdown>
      </label>
    </div>

    <!-- Selection: Bullets to craft -->
    <calc-bullets-list
      :bullets="getBullets"
      :showBullets="show_bullets_craft"
      @update:showBullets="val => show_bullets_craft = val"
      :displayList="displayList"
      :header="'Bullets to craft'"
      :explainer="'These are bullets you intend to craft.'"
      :getBullet="getBulletToCraftCount"
      :addBullet="addBulletToCraft"
      :removeBullet="removeBulletFromCraft"
    ></calc-bullets-list>
    
    <!-- Selection: Bullets in stock -->
    <calc-bullets-list
      :bullets="getBullets"
      :showBullets="show_bullets_stock"
      @update:showBullets="val => show_bullets_stock = val"
      :displayList="displayList"
      :header="'Bullets in stock'"
      :explainer="'These are bullets you currently have in stock. They will be deduced from the materials you need to farm.'"
      :getBullet="getStockOfBullet"
      :addBullet="addBulletToStock"
      :removeBullet="removeBulletFromStock"
    ></calc-bullets-list>

    <!-- Bullets in stock -->
    <h2 v-if="getBulletsInStock.length > 0">In stock</h2>
    <div class="flex flex-row flex-wrap w-full lg:w-1/2">
      <div v-for="bullet in getBulletsInStock" class="tooltip-parent cursor-pointer" @click="removeBulletFromStock(bullet)">
        <img :src="'/img/item/' + bullet.image + '.jpg'" width="60px" :title="bullet.name">
        <span class="tooltip">
          {{ bullet.name }}
        </span>
        <div
          v-if="getStockOfBullet(bullet) > 0"
          class="absolute text-center w-5 top-1 left-1 z-10 rounded-full text-xs leading-5 tracking-tight bg-tertiary text-primary"
        >
          {{ getStockOfBullet(bullet) }}
        </div>
      </div>
    </div>

    <!-- Bullets to craft -->
    <h2 v-if="getBulletsToCraft.length > 0">Currently farming</h2>
    <div class="flex flex-row flex-wrap w-full lg:w-1/2">
      <div v-for="bullet in getBulletsToCraft" class="tooltip-parent cursor-pointer" @click="removeBulletFromCraft(bullet)">
        <img :src="'/img/item/' + bullet.image + '.jpg'" width="60px" :title="bullet.name">
        <span class="tooltip">
          {{ bullet.name }}
        </span>
        <div
          v-if="getBulletToCraftCount(bullet) > 0"
          class="absolute text-center w-5 top-1 left-1 z-10 rounded-full text-xs leading-5 tracking-tight bg-tertiary text-primary"
        >
          {{ getBulletToCraftCount(bullet) }}
        </div>
      </div>
    </div>

    <div v-if="getComponents.length > 0">            
      <calc-preview-list v-for="(item, keyItem) in getComponents" :key="keyItem"
        :tag="item.image"
        :name="item.name"
        :quantity="getQuantityForItem(item)"
        @update:quantity="val => setQuantityForItem(item, val)"
        :max="item.quantity"
        :animated="false"
      ></calc-preview-list>
    </div>
    <div v-else>
      Nothing to farm
    </div>
  </div>
</template>

<script>
import Utils from '@/js/utils.js'
import Bullets from '@/js/bullets.js'

import CalcBulletsList from '@/components/CalcBulletsList.vue'
import CalcPreviewList from '@/components/CalcPreviewList.vue'
import Dropdown from '@/components/common/Dropdown.vue'

const lsMgt = new Utils.LocalStorageMgt('CalcBullets');

export default {
  components: {
    CalcBulletsList,
    CalcPreviewList,
    Dropdown
  },
  head: {
    title: 'Granblue.Party - Bullets Calculator',
    desc: 'Calculator for Bullets farming',
    image: 'https://www.granblue.party/img/card_index.jpg',
    keywords: 'Granblue Fantasy, GBF, Bullet, farm, gun, gunslinger, soldier, Parabellum, Rifle, Cartridge, Aetherial'
  },
  data() {
    return {
      displayList: 0,
      show_bullets_craft: true,
      show_bullets_stock: false,
      bullets_craft: {},
      bullets_stock: {},
      items_quantity: {}
    }
  },
  methods: {
    // Craft
    addBulletToCraft(bullet) {
      if (this.bullets_craft.hasOwnProperty(bullet.image)) {
        this.$set(this.bullets_craft, bullet.image, this.bullets_craft[bullet.image] + 1);
      }
      else {
        this.$set(this.bullets_craft, bullet.image, 1);
      }
    },
    removeBulletFromCraft(bullet) {
      if (this.bullets_craft.hasOwnProperty(bullet.image) && this.bullets_craft[bullet.image] > 0) {
        this.$set(this.bullets_craft, bullet.image, this.bullets_craft[bullet.image] - 1);
      }
    },
    getBulletToCraftCount(bullet) {
      if (this.bullets_craft.hasOwnProperty(bullet.image)) {
        return this.bullets_craft[bullet.image];
      }
      return 0;
    },
    // Stock
    addBulletToStock(bullet) {
      if (this.bullets_stock.hasOwnProperty(bullet.image)) {
        this.$set(this.bullets_stock, bullet.image, this.bullets_stock[bullet.image] + 1);
      }
      else {
        this.$set(this.bullets_stock, bullet.image, 1);
      }
    },
    removeBulletFromStock(bullet) {
      if (this.bullets_stock.hasOwnProperty(bullet.image) && this.bullets_stock[bullet.image] > 0) {
        this.$set(this.bullets_stock, bullet.image, this.bullets_stock[bullet.image] - 1);
      }
    },
    getStockOfBullet(bullet) {
      if (this.bullets_stock.hasOwnProperty(bullet.image)) {
        return this.bullets_stock[bullet.image];
      }
      return 0;
    },
    // Items
    getQuantityForItem(item) {
      if (this.items_quantity.hasOwnProperty(item.image)) {
        return this.items_quantity[item.image];
      }
      return 0;
    },
    setQuantityForItem(item, quantity) {
      this.$set(this.items_quantity, item.image, quantity);
    }
  },
  computed: {
    getBullets() {
      return Bullets;
    },
    getBulletsByName() {
      let result = {};
      this.getBullets.forEach(cat => cat.bullets.forEach(
        bullets => result[bullets.image] = bullets
      ));
      return result;
    },
    getComponentsPerBullet() {
      let result = {};
      this.getBullets.forEach(cat => cat.bullets.forEach(
        bullets => result[bullets.image] = bullets.items
      ));
      return result;
    },
    getBulletsToCraft() {
      return Object.entries(this.bullets_craft).flatMap(([key, value]) => {
        if (value > 0) {
          return this.getBulletsByName[key];
        }
        return [];
      })
      .sort((lhs, rhs) => lhs.image > rhs.image);
    },
    getBulletsInStock() {
      return Object.entries(this.bullets_stock).flatMap(([key, value]) => {
        if (value > 0) {
          return this.getBulletsByName[key];
        }
        return [];
      })
      .sort((lhs, rhs) => lhs.image > rhs.image);
    },
    getComponents() {
      let allComponents = {};
      let bulletStock = Utils.copy(this.bullets_stock);

      const addComponents = (items, mult = 1) => {
        for (let item of items) {
          if (this.getComponentsPerBullet.hasOwnProperty(item.image)) {
            // It's a bullet, do we have stock?
            if (bulletStock.hasOwnProperty(item.image) && bulletStock[item.image] > 0) {
              bulletStock[item.image]--;
            }
            else {
              addComponents(this.getComponentsPerBullet[item.image], item.quantity * mult);
            }
          }
          else if (allComponents.hasOwnProperty(item.image)) {
            allComponents[item.image].quantity += item.quantity * mult;
          }
          else {
            allComponents[item.image] = Utils.copy(item);
            allComponents[item.image].quantity *= mult;
          }
        }
      };

      for (const [key, value] of Object.entries(this.bullets_craft)) {
        for (let i=0; i<value; i++) {
          if (bulletStock.hasOwnProperty(key) && bulletStock[key] > 0) {
            bulletStock[key]--;
          }
          else {
            addComponents(this.getComponentsPerBullet[key]);
          }
        }
      }

      return Object.values(allComponents)
        .sort((lhs, rhs) => {
          const lastWordL = lhs.name.split(' ');
          const lastWordR = rhs.name.split(' ');
          if (lastWordL[lastWordL.length - 1] !== lastWordR[lastWordR.length - 1]) {
            return lastWordL[lastWordL.length - 1] > lastWordR[lastWordR.length - 1];
          }
          return lhs.name > rhs.name;
        });
    }
  },
  watch: {
    displayList() {
      lsMgt.setValue('displayList', this);
    },
    show_bullets_craft() {
      lsMgt.setValue('show_bullets_craft', this);
    },
    show_bullets_stock() {
      lsMgt.setValue('show_bullets_stock', this);
    },
    bullets_craft: {
      handler() {
        lsMgt.setValue('bullets_craft', this);
      },
      deep: true
    },
    bullets_stock: {
      handler() {
        lsMgt.setValue('bullets_stock', this);
      },
      deep: true
    },
    items_quantity: {
      handler() {
        lsMgt.setValue('items_quantity', this);
      },
      deep: true
    },
  },
  mounted() {
    lsMgt.getValue(this, 'displayList');
    lsMgt.getValue(this, 'show_bullets_craft');
    lsMgt.getValue(this, 'show_bullets_stock');
    lsMgt.getValue(this, 'bullets_stock');
    lsMgt.getValue(this, 'bullets_craft');
    lsMgt.getValue(this, 'items_quantity');
  },
};
</script>