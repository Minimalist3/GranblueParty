<template>
  <!-- <dropdown :value="value" :index="index" @change="changeValue" ref="select"> -->
  <dropdown :value="value" @change="changeValue" class="w-52" :disabled="disabled">
    <option v-if="all" :value="-1">--- All Content ---</option>
    <optgroup
      v-for="(step, index) in content"
      :key="index"
      :label="step.name"
    >
      <option v-for="raid in filterContent(step.content)" :key="raid.id" :value="raid.id">
        {{ raid.name }}
      </option>
    </optgroup>
  </dropdown>
</template>

<script>
import Content from '@/js/content'

import Dropdown from '@/components/common/Dropdown.vue'

export default {
  components: {
    Dropdown,
  },
  props: {
    value: {
      //required: true, Cannot uncomment, since it can be null
      type: Number
    },
    all: {
      required: false,
      type: Boolean,
      default: false
    },
    showPrivateCategories: {
      required: false,
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    filterContent(content) {
      if ( ! this.showPrivateCategories) {
        return content.filter(raid => raid.private !== true);
      }
      return content;
    },
    changeValue(e) {
      this.$emit('change', e);
      if (e.target.value === '') {
        this.$emit('input', null);
      }
      else {
        this.$emit('input', e.target.value);
      }
    }
  },
  computed: {
    content() {
      return Content;
    }
  }
}
</script>