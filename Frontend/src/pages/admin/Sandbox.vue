<template>
  <div class="flex flex-col items-center">
    <h1 class="self-center mb-8">Arcarum Summon and Evoker Materials Calculator</h1>

    <calculator
      :unitsProgress="progress"
      :unitsSplitMats.sync="splitMats"
      :unitsHideCompletedMats.sync="hideCompletedMats"
      :unitsData="getEvokerData"
      unitsLabel="an Evoker"
    ></calculator>
  </div>
</template>

<script>
import utils from '@/js/utils'
import supplies from '@/js/supplies-evokers'

import Calculator from '@/components/Calculator.vue'

const lsMgt = new utils.LocalStorageMgt('CalcEvoker');

export default {
  components: {
    Calculator,
  },
  head: {
    title: 'Granblue.Party - Evoker Calculator',
    desc: 'Get the complete list of materials needed to unlock a specific Arcarum summon and Evoker',
    image: 'https://www.granblue.party/img/preview_calcevoker.png',
    keywords: 'Arcarum, summon, Evoker, astra, evolite, New world weapon'
  },
  data() {
    return {
      // { 2040236: new EvokerProgress([{chaotichaze: 0, ...}, ...]), ... }
      progress: {},
      splitMats: true,
      hideCompletedMats: false,
    };
  },
  computed: {
    getEvokerData() {
      return supplies.EVOKERS_DATA;
    }
  },
  watch: {
    progress: {
      handler() {
        lsMgt.setValue('progress', this);
      },
      deep: true
    },
    splitMats() {
      lsMgt.setValue('splitMats', this);
    },
    hideCompletedMats() {
      lsMgt.setValue('hideCompletedMats', this);
    }
  },
  mounted() {
    lsMgt.getValue(this, 'progress');
    lsMgt.getValue(this, 'splitMats');
    lsMgt.getValue(this, 'hideCompletedMats');
  }
};
</script>