<template>
  <ins
    class="adsbygoogle responsive_ad"
    style="display:block"
    :style="$isDebug ? 'border: 1px solid grey;' : ''"
    data-ad-client="ca-pub-2769716391947040"
    :data-ad-slot="adSlot"
    :data-ad-region="ad_region"
    :key="ad_region"
     data-ad-format="fluid"
     data-full-width-responsive="true"
  ></ins>
</template>

<script>
export default {
  props: {
    adSlot: {
      required: true
    },
  },
  data() {
    return {
      ad_region: null,
    }
  },
  methods: {
    getNewAds() {
      if (VUE_ENV === 'server') {
        return;
      }

      this.ad_region = 'page-' + Math.random();

      this.$nextTick(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch (error) {
          //console.error(error)
        }
      });
    },
  },
  mounted() {
    this.getNewAds();
  },
  watch: {
    '$route.path'(to, from) {
      if (to !== from) {
        this.getNewAds();
      }
    },
  }
}
</script>

<style scoped>

.responsive_ad {
  width: 320px;
  height: 100px;
}
@media(min-width: 500px) {
  .responsive_ad {
    width: 468px;
    height: 60px;
  }
}
@media(min-width: 800px) {
 .responsive_ad {
    width: 728px;
    height: 90px;
  }
}

</style>