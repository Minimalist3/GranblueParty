<template>
  <div>
    <div>
      <a href="/admin">Up</a>
      <button
        class="button is-light is-outlined"
        @click="saveData()"
      >
        Save
      </button>
      <button
        class="button is-info is-outlined"
        @click="hideNonEmptySkills()"
      >
        Hide
      </button>
    </div>

    <nav class="pagination" role="navigation" aria-label="pagination">
      <ul class="pagination-list">
        <li
          v-for="i in Math.ceil(message.length / 10)"
          :key="i"
        >
          <a
            class="pagination-link has-text-light"
            :class="index === i-1 ? 'is-current' : ''"
            @click="index = i-1"
          >
            {{i}}
          </a>
        </li>
      </ul>
    </nav>

    <table class="table is-narrow is-fullwidth has-background-dark">
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

    <nav class="pagination" role="navigation" aria-label="pagination">
      <ul class="pagination-list">
        <li
          v-for="i in Math.ceil(message.length / 10)"
          :key="i"
        >
          <a
            class="pagination-link has-text-light"
            :class="index === i-1 ? 'is-current' : ''"
            @click="index = i-1"
          >
            {{i}}
          </a>
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

      this.$http.post('/admin/summons', postdata)
        .then(response => console.log('Saved'))
        .catch(error => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data.error.message);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser
            console.log("Cannot contact login server");
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log(error.message);
          }
        });
    },
    hideNonEmptySkills() {
      this.message.forEach(s => {
        if (s.data !== null) {
          Vue.set(s, 'hide', true);
        }
      })
    }
  },
  computed: {
    getSummons() {
      return this.message
        .flatMap(s => {
          if (s.hide === true) {
            return [];
          }
          return [s];
        })
        .slice(this.index * this.slice_size, this.index * this.slice_size + this.slice_size);
    },
  },
  mounted() {
    this.$http.get('/admin/summons')
      .then(response => {
        for (let s of response.data) {
          if (s.data) {
            s.data = JSON.stringify(s.data);
            s.data = s.data.replace(/],/g, "],\n");
            s.data = s.data.slice(0, 1) + "\n" + s.data.slice(1, s.data.length-1) + "\n" + s.data.slice(s.data.length-1);
          }
        }
        this.message = response.data;
      })
      .catch(error => console.log(error));
  }
}
</script>

<style scoped>

.table {
  color: hsl(0, 0%, 98%);
}

</style>
