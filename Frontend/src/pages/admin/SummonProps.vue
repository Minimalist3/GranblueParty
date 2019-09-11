<template>
  <div class="field is-grouped is-grouped-multiline">
    <!-- Percent -->
    <div class="control">
      <input class="input is-small" style="width: 9ch" type="number" v-model.number="object.percent">
      %
    </div>    

    <!-- Element -->
    <div class="control">
      Element
      <div class="select is-small">
        <select v-model="object.element">
          <option value="fire">Fire</option>
          <option value="wind">Wind</option>
          <option value="earth">Earth</option>
          <option value="water">Water</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="any">Any</option>
        </select>
      </div>
    </div>

    <!-- Aura type -->
    <div class="control">
      Aura
      <div class="select is-small">
        <select v-model="object.aura_type">
          <option value="elemental">elemental</option>
          <option value="normal">normal</option>
          <option value="optimus">optimus</option>
          <option value="omega">omega</option>
          <option value="seraphic">seraphic</option>
          <option value="mysterious">mysterious</option>
        </select>
      </div>
    </div>

    <!-- Stat -->
    <div class="control">
      Stat
      <div class="select is-small">
        <select v-model="object.stat">
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
        </select>
      </div>
    </div>

    <!-- Slot -->
    <div class="control">
      Slot
      <div class="select is-small">
        <select v-model="object.slot">
          <option :value="undefined">[All]</option>
          <option value="sub">sub</option>
          <option value="main">main</option>
          <option value="friend">friend</option>
        </select>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    object: {
      type: Object,
      required: true
    },
  },
}
</script>
