<template>
  <div class="flex flex-row items-center">
    <a :href="'https://gbf.wiki/' + name" target="_blank" title="Go to gbf.wiki" class="mr-2">
      <img :src="'/img/item/' + tag + (animated ? '.gif' : '.jpg')" style="max-height: 25px; max-width: 25px;">
      {{ name }}
    </a>    
    <div>
      <stat-input
        longName="Quantity"
        :prop.sync="localQuantity"
        :length="max.toString().length + 1"
        :max="max"
        :alignRight="true"
      ></stat-input> / {{ max }}
      <fa-icon
        v-if="localQuantity < max"
        @click="localQuantity = max"
        :icon="['fas', 'check']"
        class="ml-1 cursor-pointer"
        title="Max quantity"
      ></fa-icon>
    </div>
  </div>
</template>

<script>
import StatInput from '@/components/common/StatInput.vue'

export default {
  components: {
    StatInput
  },
  props: {
    tag: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true,
    },
    animated: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    localQuantity: {
      get() {
        return this.quantity;
      },
      set(value) {
        this.$emit('update:quantity', value);
      }
    }
  }
}
</script>