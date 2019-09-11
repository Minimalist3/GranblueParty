<template>
  <div class="field is-grouped is-grouped-multiline">
    <div class="control">
      1 <input class="input is-small has-background-dark has-text-light" style="width: 6ch" v-model.number="object.percent['1']">
    </div>
    <div class="control">
      10 <input class="input is-small has-background-dark has-text-light" style="width: 6ch" v-model.number="object.percent['10']">
    </div>
    <div class="control">
      15 <input class="input is-small has-background-dark has-text-light" style="width: 6ch" v-model.number="object.percent['15']">
    </div>
    <div class="control">
      20 <input class="input is-small has-background-dark has-text-light" style="width: 6ch" v-model.number="object.percent['20']">
    </div>


    <!-- Aura type -->
    <div class="control">
      Aura
      <div class="select is-small">
        <select v-model="object.aura_type">
          <option value="ex">ex</option>
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
          <option value="supplemental_dmg">supplemental_dmg</option>
        </select>
      </div>
    </div>
    
    <!-- Restrictions -->
    <div class="control">
      Restrictions
      <div class="select is-small is-multiple">
        <select v-model="restriction_elem" multiple size="6">
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="earth">Earth</option>
          <option value="wind">Wind</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div class="select is-small is-multiple">          
        <select v-model="restriction_weapon" multiple size="6">
          <option value="axe">Axe</option>
          <option value="bow">Bow</option>
          <option value="dagger">Dagger</option>
          <option value="gun">Gun</option>
          <option value="harp">Harp</option>
          <option value="katana">Katana</option>
          <option value="melee">Melee</option>
          <option value="sabre">Sabre</option>
          <option value="spear">Spear</option>
          <option value="staff">Staff</option>
        </select>
      </div>
      <div class="select is-small is-multiple">
        <select v-model="restriction_race" multiple size="6">
          <option value="human">Human</option>
          <option value="draph">Draph</option>
          <option value="erune">Erune</option>
          <option value="harvin">Harvin</option>
          <option value="primal">Primal</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

    </div>

    <div class="control">
      <textarea
        class="textarea is-small has-background-dark has-text-grey-light"
        rows="7"
        spellcheck="false"
        style="width: 50ch; font-family: monospace;"
        v-model.lazy="getObjectJSON"
      ></textarea>
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
  data() {
    return {
      restriction_elem: [],
      restriction_weapon: [],
      restriction_race: [],
    }
  },
  methods: {
    addRestriction(category, element) {
      if (element.length === 0) {
        Vue.delete(this.object.restriction, category);

        if (Object.keys(this.object.restriction).length === 0) {
          Vue.delete(this.object, 'restriction');
        }
      }
      else {
        if ( ! this.object.hasOwnProperty('restriction')) {
          Vue.set(this.object, 'restriction', {});
        }
        Vue.set(this.object.restriction, category, element);
      }
    },
    linkRestrictions() {
      if (this.object.hasOwnProperty('restriction')) {
        if (this.object.restriction.hasOwnProperty('element')) {
          this.restriction_elem = this.object.restriction.element;
        }
        if (this.object.restriction.hasOwnProperty('weapon')) {
          this.restriction_weapon = this.object.restriction.weapon;
        }
        if (this.object.restriction.hasOwnProperty('race')) {
          this.restriction_race = this.object.restriction.race;
        }
      }
    },
  },
  computed: {
    getObjectJSON: {
      get() {
        return JSON.stringify(this.object);
      },
      set(value) {
        for (let [key, val] of Object.entries(JSON.parse(value))) {
          Vue.set(this.object, key, val);
        }
        this.linkRestrictions();
      },
    }
  },
  watch: {
    'object.percent.1'() {
      if ( ! this.object.percent['1']) {
        Vue.delete(this.object.percent, '1');
      }
    },
    'object.percent.10'() {
      if ( ! this.object.percent['10']) {
        Vue.delete(this.object.percent, '10');
      }
    },
    'object.percent.15'() {
      if ( ! this.object.percent['15']) {
        Vue.delete(this.object.percent, '15');
      }
    },
    'object.percent.20'() {
      if ( ! this.object.percent['20']) {
        Vue.delete(this.object.percent, '20');
      }
    },
    restriction_elem() {
      this.addRestriction('element', this.restriction_elem);
    },
    restriction_weapon() {
      this.addRestriction('weapon', this.restriction_weapon);
    },
    restriction_race() {
      this.addRestriction('race', this.restriction_race);
    },
  },
  mounted() {
    this.linkRestrictions();    
  },
}
</script>
