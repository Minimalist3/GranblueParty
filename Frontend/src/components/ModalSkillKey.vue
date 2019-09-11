<template>
  <div
    class="modal"
    :class="{'is-active': show}"
    v-if="show"
  >
    <div
      class="modal-background"
      @click="closeModal"
    ></div>
    <div class="modal-card has-text-dark">
      <header class="modal-card-head">

      </header>
      <section class="modal-card-body">
        <table class="table is-hoverable is-narrow is-fullwidth">
          <thead>
            <tr>
              <th>Name</th>
              <th>Key</th>
            </tr>
          </thead>
          <tbody class="is-unselectable">
            <tr @click="selectItem(null)">
              <td>-</td>
              <td>Remove current key</td>
            </tr>
            <tr
              v-for="(item, index) in getData"
              :key="index"
              @click="selectItem(item)"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.desc }}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <footer class="modal-card-foot">

      </footer>
    </div>
    <button
      aria-label="close"
      class="modal-close is-large"      
      @click="closeModal"
    ></button>
  </div>
</template>

<script>
import KeyData from '@/js/keyData.js'

export default {
  props: {
    selected: {
      type: Function,
      required: true
    },
  },
  data() {
    return {
      show: false,
      index: 0,
      keyid: 0,
    }
  },
  methods: {
    showModal(index, keyid) {
      this.index = index;
      this.keyid = keyid;
      this.show = true;
      document.querySelector("HTML").classList.add("is-clipped");
    },
    closeModal() {
      this.show = false;
      document.querySelector("HTML").classList.remove("is-clipped");
    },
    selectItem(e) {
      this.closeModal();
      if (e) {
        e['level'] = 1;
        e['keyid'] = this.keyid;
      }
      this.selected(this.index, e);
    }
  },
  computed: {
    getData() {      
      return KeyData.data[this.keyid];
    },
  },  
}
</script>
