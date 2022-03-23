<template>
  <div class="flex flex-col items-center">
    <h1 class="self-center mb-8">Eternal Materials Calculator</h1>

    <span class="mb-8">
      This calculator uses the "40 boxes" method.<br>
      You can also spend a Gold Bar instead of reducing 10 Revenant Weapons, even if it's not recommanded in the long run.<br>
      For more information on the whole process, please check the Wiki:<br>
      <ul class="list-disc ml-4">
          <li><a target="_blank" href="https://gbf.wiki/Revenant_Weapons">To recruit an Eternal
            <fa-icon :icon="['fas', 'external-link-alt']" class="text-sm"></fa-icon></a>
          </li>
          <li><a target="_blank" href="https://gbf.wiki/Uncapping_Eternals">To uncap an Eternal to 5*
            <fa-icon :icon="['fas', 'external-link-alt']" class="text-sm"></fa-icon></a>
          </li>
          <li><a target="_blank" href="https://gbf.wiki/Eternals_Transcendence">For the Eternal Transcendance
            <fa-icon :icon="['fas', 'external-link-alt']" class="text-sm"></fa-icon></a>
          </li>
      </ul>
    </span>

    <calculator
      :unitsProgress="progress"
      :unitsData="getEternalData"
      unitsLabel="an Eternal"
      :unitsSplitMats.sync="splitMats"
      :unitsHideCompletedMats.sync="hideCompletedMats"
      :unitsDisplayList.sync="displayList"
    ></calculator>
  </div>
</template>

<script>
import utils from '@/js/utils'
import supplies from '@/js/supplies-eternals'

import Calculator from '@/components/Calculator.vue'

const lsMgt = new utils.LocalStorageMgt('CalcEternal');

export default {
  components: {
    Calculator,
  },
  head: {
    title: 'Granblue.Party - Eternal Calculator',
    desc: 'Get the complete list of materials needed to unlock a specific Eternal',
    image: 'https://www.granblue.party/img/card_calceternal.jpg',
    keywords: 'Guild wars, Eternal, Gold bar, Transcendance, Revenant weapon, 40 boxes'
  },
  data() {
    return {
      // { 2040236: new UnitProgress([{chaotichaze: 0, ...}, ...]), ... }
      progress: {},
      splitMats: true,
      hideCompletedMats: false,
      displayList: 0,
    };
  },
  computed: {
    getEternalData() {
      return supplies.ETERNALS_DATA;
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
    },
    displayList() {
      lsMgt.setValue('displayList', this);
    }
  },
  mounted() {
    lsMgt.getValue(this, 'progress');
    lsMgt.getValue(this, 'splitMats');
    lsMgt.getValue(this, 'hideCompletedMats');
    lsMgt.getValue(this, 'displayList');
  }
};
</script>