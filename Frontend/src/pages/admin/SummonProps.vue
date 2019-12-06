<template>
  <div class="flex flex-row flex-wrap items-center">
    <!-- Percent -->
    <input class="input" style="width: 7ch" type="number" v-model.number="object.percent">%

    <!-- Element -->
    Element
    <dropdown v-model="object.element" class="w-16">
      <option value="fire">Fire</option>
      <option value="wind">Wind</option>
      <option value="earth">Earth</option>
      <option value="water">Water</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="any">Any</option>
    </dropdown>

    <!-- Aura type -->
    Aura
    <dropdown v-model="object.aura_type" class="w-24">
      <option value="elemental">elemental</option>
      <option value="normal">normal</option>
      <option value="optimus">optimus</option>
      <option value="omega">omega</option>
      <option value="seraphic">seraphic</option>
      <option value="mysterious">mysterious</option>
    </dropdown>

    <!-- Stat -->
    Stat
    <dropdown v-model="object.stat" class="w-16">
      <option value="atk">atk</option>
      <option value="atk_cap">atk_cap</option>
      <option value="hp">hp</option>
      <option value="da">da</option>
      <option value="ta">ta</option>
      <option value="crit">crit</option>
      <option value="ca_dmg">ca_dmg</option>
      <option value="ca_cap">ca_cap</option>
      <option value="chainburst_dmg">chainburst_dmg</option>
      <option value="chainburst_cap">chainburst_cap</option>
      <option value="stamina">stamina</option>
      <option value="enmity">enmity</option>
    </dropdown>

    <!-- Slot -->
    Slot
    <dropdown v-model="object.slot" class="w-16">
      <option :value="undefined">[All]</option>
      <option value="sub">sub</option>
      <option value="main">main</option>
      <option value="friend">friend</option>
    </dropdown>

  </div>
</template>

<script>
import Dropdown from '@/components/common/Dropdown.vue'

export default {
  components: {
    Dropdown,
  },
  props: {
    object: {
      type: Object,
      required: true
    },
  },
}
</script>
