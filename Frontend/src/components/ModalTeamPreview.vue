<template>
  <modal :show="show" :large="true" @close="close()">
    <template v-slot:header>
      <div v-if=" ! loading" class="columns-2 md:columns-3 grow">
        <h3 class="w-1/2 truncate hidden md:block md:w-32 lg:w-64 xl:w-96" :title="party_name">{{ party_name }}</h3>

        <a :href="'/builder?p=' + teamId" class="text-center">Open in Party Builder</a>

        <like-button :teamId="teamId"></like-button>
      </div>
    </template>

    <div v-if="loading" class="text-center">
      Loading...
    </div>
    <div v-else class="flex flex-col justify-center items-center flex-wrap gap-2">
      <div class="flex flex-row justify-center items-start flex-wrap gap-2">
        <group-class></group-class>
        <group-characters :showLevel="false" :showRing="true"></group-characters>
        <group-summons :showLevel="false"></group-summons>
      </div>

      <div class="flex flex-row flex-wrap justify-center items-start gap-2">
        <group-weapons :showLevel="false" :showArcarum="true"></group-weapons>
        <span class="flex flex-col w-full self-stretch md:w-128">
          <h3 v-if="video">YouTube video:</h3>
          <a v-if="video" :href="videoURL" target="_blank">{{ videoURL }}</a>

          <h3 v-if="description">Description</h3>
          <textarea v-if="description" class="self-stretch h-full w-full md:w-128 appearance-none text-primary bg-primary" v-model="description" readonly></textarea>

          <h3 v-if="getActionsText">Actions</h3>
          <textarea v-if="getActionsText" class="self-stretch h-full w-full md:w-128 appearance-none text-primary bg-primary" v-model="getActionsText" readonly></textarea>
        </span>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Utils from '@/js/utils.js'

import LikeButton from '@/components/common/LikeButton.vue'
import Modal from './common/Modal.vue'
import GroupClass from "@/components/GroupClass.vue";
import GroupCharacters from "@/components/GroupCharacters.vue";
import GroupSummons from "@/components/GroupSummons.vue";
import GroupWeapons from "@/components/GroupWeapons.vue";

export default {
  model: {
    prop: 'show',
    event: 'close'
  },
  components: {
    LikeButton,
    Modal,
    GroupClass,
    GroupCharacters,
    GroupSummons,
    GroupWeapons
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    teamId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loading: true,
    }
  },
  methods: {
    close() {
      this.$emit('close', false);
    },
  },
  computed: {
    ...mapState({
      party_name: state => state.party_builder.party_name,
      description: state => state.party_builder.description,
      video: state => state.party_builder.video_id,
    }),
    ...mapGetters([
      'getActionsText'
    ]),
    videoURL() {
      if (this.video) {
        return 'https://www.youtube.com/watch?v=' + this.video;
      }
      return null;
    }
  },
  watch: {
    teamId() {
      if (this.teamId > 0) {
        this.loading = true;
        this.axios.get('/party/load/' + this.teamId)
          .then(response => {
            let res = Utils.getPartyResponse(response);
            res.party_mode = this.$MODE.ReadOnly;
            this.$store.dispatch('loadParty', res);
            this.loading = false;
          })
          .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
      }
    }
  }
}
</script>