import { LANGUAGES } from '@/js/lang'

export const objectIsEmpty = {
  computed: {
    objectIsEmpty() {
      return this.object.nameen === undefined;
    }
  }
}

export const getName = {
  computed: {
    getName() {
      if (this.$store.getters.getLang === LANGUAGES.EN) {
        return this.object.nameen;
      }
      return this.object.namejp;
    },
  }
}