<template>
  <div class="flex flex-col">
    <div class="flex flex-row flex-wrap items-center mb-4">
      <a class="mr-4" href="/admin">Up</a>
      <button class="btn btn-white mr-4" @click="saveData()">Save</button>
      <button class="btn btn-white" @click="hideNonEmptySkills()">Hide</button>
    </div>

    <nav class="mb-4" role="navigation" aria-label="pagination">
      <ul class="flex flex-row flex-wrap">
        <li v-for="i in Math.ceil(message.length / 10)" :key="i">
          <a 
            class="text-primary mr-2 py-1 px-2 rounded cursor-pointer"
            :class="index === i-1 ? 'bg-tertiary' : 'bg-secondary'"
            @click="index = i-1"
          >{{i}}</a>
        </li>
      </ul>
    </nav>

    <table class="table mb-4">
      <tbody>
        <summon-line
          v-for="(item, i) in getSummons"
          :key="item.summonid"
          :item="item"
          :index="i"
          :page="index"
        >
        </summon-line> 
      </tbody>
    </table>

    <nav role="navigation" aria-label="pagination">
      <ul class="flex flex-row flex-wrap">
        <li v-for="i in Math.ceil(message.length / 10)" :key="i">
          <a
            class="text-primary mr-2 py-1 px-2 rounded cursor-pointer"
            :class="index === i-1 ? 'bg-tertiary' : 'bg-secondary'"
            @click="index = i-1"
          >{{i}}</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import SummonLine from './SummonLine.vue'

/**
 * .data object
 {
   "0": // Number of stars
    [ // List of auras
      {
        percent: 0  // Can be int or object
        | {         // Object depends on formula
            1: 10,
            2: 30,
            3: 60,
            +: 100
          }
        element: '' // Can be fire, wind, water, earth, light, dark, any
        aura_type: '' // Can be elemental, normal, optimus, omega, mysterious, seraphic, ranko
        stat: '' // Can be atk, atk_cap, hp, da, ta, crit, ca_dmg, ca_cap, chainburst_dmg, chainburst_cap, stamina, enmity

        formula: '' // Can be TBD. Default: undefined
        slot: '' // The slot this aura takes effect. Can be main, sub, friend. Default: undefined (all)
      },
      ...
    ],
   "3": ...
 }
 */
export default {
  components: {
    SummonLine,
  },
  data() {
    return {
      message: [],
      index: 0,
      slice_size: 10,
    }
  },
  methods: {
    saveData() {
      let postdata = {
        ignore: [],
        data: [],
      }

      this.message.forEach(s => {
        postdata.ignore.push([s.summonid, s.ignore]);
        if (s.data) {
          postdata.data.push([s.summonid, s.data]);
        }
        else {
          postdata.data.push([s.summonid, null]);
        }
      })

      this.axios.post('/admin/summons', postdata)
        .then(response => this.$store.dispatch('addMessage', {message: 'Saved'}))
        .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
    },
    hideNonEmptySkills() {
      this.message.forEach(s => {
        if (s.data !== null) {
          this.$set(s, 'hide', true);
        }
      })
    }
  },
  computed: {
    getSummons() {
      return this.message
        .flatMap(s => s.hide ? [] : [s])
        .slice(this.index * this.slice_size, this.index * this.slice_size + this.slice_size);
    },
  },
  mounted() {
    this.axios.get('/admin/summons')
      .then(response => this.message = response.data)
      .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
  }
}
</script>