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

// When changing routes, beforeCreate() triggers before destroyed()
// This prevents multiple registrations of the same module
// Does not fix hot reload of store modules
export const provideModule = (path, module) => {
	let instanceCount = 0;
	return {
		beforeCreate() {
      if (VUE_ENV !== 'server') {
        instanceCount++
        // console.log(path + ' ' + instanceCount);
        if (instanceCount > 1) return;
      }

      const preserve_state = !! this.$store.state[path];
			this.$store.registerModule(path, module, { preserveState: preserve_state });
		},
		destroyed() {
      if (VUE_ENV !== 'server') {
        instanceCount--;
        // console.log(path + ' ' + instanceCount);
		  	if (instanceCount > 0) return;
      }

			this.$store.unregisterModule(path);
		},
	};
};