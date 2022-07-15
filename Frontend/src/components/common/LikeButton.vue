<template>
  <checkbox
    v-show="team_owner && ! isMyParty"
    :value="liked"
    @input="clickLike"
    :disabled="team_owner && ! isUserLogged"
    :title="isUserLogged ? '' : 'Log in to like this team'"
    :off="['far', 'circle']"
    :on="['far', 'face-grin-wide']"
    iconSize="text-3xl"
  >
    {{ liked ? 'Liked' : 'Like this team' }}
  </checkbox>
</template>

<script>
import { mapState } from 'vuex'

import Checkbox from '@/components/common/Checkbox.vue'

export default {
  components: {
    Checkbox,
  },
  props: {
    teamId: {
      type: Number
    }
  },
  methods: {
    clickLike(e) {
      if (e) {
        this.axios.get('/party/like/' + this.teamId)
          .then(_ => {
            this.$store.dispatch('addMessage', {message: 'You liked this party'});
            this.liked = e;
          })
          .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
      }
      else {
        this.axios.get('/party/unlike/' + this.teamId)
          .then(_ => {
            this.$store.dispatch('addMessage', {message: 'You stopped liking this party'});
            this.liked = e;
          })
          .catch(error => this.$store.dispatch('addAxiosErrorMessage', error));
      }
    },
  },
  computed: {
    ...mapState({
      team_owner: state => state.party_builder.team_owner,
    }),
    liked: {
      get() { return this.$store.state.party_builder.liked },
      set(value) { this.$store.commit('setLiked', value) }
    },
    isUserLogged() {
      return this.$store.getters.getUserId !== null;
    },
    isMyParty() {
      return this.team_owner === this.$store.getters.getUserId;
    },
  },
}
</script>