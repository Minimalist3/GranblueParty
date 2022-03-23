<template>
  <div>
    <div v-for="(w, i) in getWeaponKeys" :key="'w'+i" class="mb-3">
      <b>{{ w.name }}</b>
      <ul class="list-disc ml-4">
        <li v-for="(k, j) in w.keys" :key="'k'+j">{{ k }}</li>
      </ul>
    </div>
    <br>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { LANGUAGES } from '@/js/lang'
import Utils from '@/js/utils.js'

export default {
  computed: {
    ...mapState({
      weapons: state => state.party_builder.weapons,
    }),
    englishNames() {
      return this.$store.getters.getLang === LANGUAGES.EN;
    },
    getWeaponKeys() {
      let keys = [];

      for (const w of this.weapons) {
        if ( ! Utils.isEmpty(w)) {
          let weapon = {
            name: this.englishNames ? w.nameen : w.namejp,
            keys: []
          };

          for (const k of w.keys) {
            if ( ! Utils.isEmpty(k)) {
              weapon.keys.push(k.desc);
            }
          }

          if (weapon.keys.length > 0) {
            keys.push(weapon);
          }
        }
      }

      return keys;
    }
  }
}
</script>