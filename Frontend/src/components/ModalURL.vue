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
      <form @submit.prevent="doImport()">
        <header class="modal-card-head">
          <div class="modal-card-title">
            Please copy your gbf.wiki collection URL below
          </div>
        </header>
        <section class="modal-card-body">
          <div>
            <label for="url">URL</label>
            <input
              class="input"
              id="url"
              ref="url"
              type="text"
              v-model="url"
              required
              autofocus
            >
          </div>          
        </section>
        <footer class="modal-card-foot">
          <input
            class="button is-link"
            type="submit"
            value="Import"
          >
        </footer>
      </form>
    </div>
    <button
      aria-label="close"
      class="modal-close is-large"      
      @click="closeModal"
    ></button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      url: "",
    }
  },
  props: {
    onImport: {
      type: Function,
      required: true,
    },
  },
  methods: {
    showModal() {
      this.show = true;
      document.querySelector("HTML").classList.add("is-clipped");

      let self = this;
      Vue.nextTick().then(() => {
        self.url = "";
        self.$refs.url.focus();
      });
    },
    closeModal() {
      this.show = false;
      document.querySelector("HTML").classList.remove("is-clipped");
    },
    doImport() {
      this.closeModal();
      this.onImport(this.url);
    },
  },
}
</script>
