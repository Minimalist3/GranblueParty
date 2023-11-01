<template>
  <div class="flex flex-col flex-wrap gap-4 items-center w-full">
    <a 
      class="btn-blue rounded-t font-bold hover:text-primary cursor-pointer p-2"
      :class="show ? '' : 'rounded-b'"
      @click="show = !show"
      title="Click to toggle..."
    >
      {{ header }}
      <fa-icon v-if=" ! show" :icon="['fas', 'angle-right']" class="ml-2"></fa-icon>
      <fa-icon v-else :icon="['fas', 'angle-down']" class="ml-2"></fa-icon>
    </a>
    <div v-if="show" class="flex flex-col w-full items-center" >
      <span class="mb-4">{{ explainer }}</span>
      <div v-for="bullets in getBullets" class="flex flex-col bg-secondary p-2 w-full lg:w-1/2 items-center rounded">
        <h2 class="mb-4">{{ bullets.name }}</h2>

        <div :class="displayList === 0 ? 'flex flex-row flex-wrap' : 'grid grid-cols-1 sm:grid-cols-2'">
          <div v-for="bullet in bullets.bullets" class="tooltip-parent">
            <div v-if="displayList === 0">
              <img :src="'/img/item/' + bullet.image + '.jpg'" width="60px" :title="bullet.name" :class="getBullet(bullet) > 0 ? '' : 'grayscale-80'">
              <div class="flex flex-row justify-around">
                <a :class="getBullet(bullet) > 0 ? 'cursor-pointer' : ''" @click="removeBullet(bullet)">
                  <fa-icon
                    :icon="['fa', 'minus-circle']"
                    class="text-sm"
                    :class="getBullet(bullet) > 0 ? 'text-primary hover:text-link-hover' : 'text-transparent'"
                  ></fa-icon>
                </a>
                <span class="select-none">{{ getBullet(bullet) }}</span>
                <a class="cursor-pointer" @click="addBullet(bullet)">
                  <fa-icon :icon="['fa', 'plus-circle']" class="text-primary text-sm hover:text-link-hover"></fa-icon>
                </a>
              </div>
              <span class="tooltip">
                {{ bullet.name }}
              </span>
            </div>
            <div v-else class="flex flex-row flex-wrap items-center">
              <img :src="'/img/item/' + bullet.image + '.jpg'" width="40px" :title="bullet.name" class="ml-4 mr-2" :class="getBullet(bullet) > 0 ? '' : 'grayscale-80'">
              <span class="flex flex-col">
                <div>{{ bullet.name }}</div>
                <div class="flex flex-row gap-4">
                  <a :class="getBullet(bullet) > 0 ? 'cursor-pointer' : ''" @click="removeBullet(bullet)">
                    <fa-icon
                      :icon="['fa', 'minus-circle']"
                      class="text-sm"
                      :class="getBullet(bullet) > 0 ? 'text-primary hover:text-link-hover' : 'text-transparent'"
                    ></fa-icon>
                  </a>
                  <span class="select-none">{{ getBullet(bullet) }}</span>
                  <a class="cursor-pointer" @click="addBullet(bullet)">
                    <fa-icon :icon="['fa', 'plus-circle']" class="text-primary text-sm hover:text-link-hover"></fa-icon>
                  </a>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    header: {
      type: String,
      required: true
    },
    explainer: {
      type: String,
      required: true
    },
    displayList: {
      type: Number,
      required: true
    },
    showBullets: {
      type: Boolean,
      required: true
    },
    bullets: {
      type: Array,
      required: true
    },
    getBullet: {
      type: Function,
      required: true
    },
    addBullet: {
      type: Function,
      required: true
    },
    removeBullet: {
      type: Function,
      required: true
    },
  },
  methods: {
  },
  computed: {
    getBullets() {
      return this.bullets;
    },
    show: {
      get() {
        return this.showBullets;
      },
      set(value) {
        this.$emit('update:showBullets', value);
      }
    }
  }
}
</script>