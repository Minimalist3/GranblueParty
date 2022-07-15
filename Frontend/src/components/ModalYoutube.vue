<template>
  <modal :show="show" @close="$emit('close', false)">
    <template v-slot:header>
      <h2>Add a YouTube video</h2>
    </template>

    <form @submit.prevent="fetchVideo()" class="flex flex-row m-1 gap-x-4">
      <label class="flex flex-row whitespace-nowrap items-center gap-x-2 grow">URL
        <input class="input w-full" ref="url" type="text" placeholder="YouTube URL" v-model="input_url" required autofocus>
      </label>

      <input class="btn btn-blue pt-2" type="submit" value="Fetch">
    </form>

    <div class="flex justify-center" style="height: 360px">
      {{ error_message }}
      <div id="player"></div>
    </div>

    <input class="btn btn-blue pt-2" type="button" value="Add" @click="addVideo()">
    <input v-if="url" class="btn btn-red pt-2" type="button" value="Remove" @click="removeVideo()">
  </modal>
</template>

<script>
import Modal from './common/Modal.vue'

// 2. This code loads the IFrame Player API code asynchronously.
if (VUE_ENV !== 'server') {
  let tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  let firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

export default {
  model: {
    prop: 'show',
    event: 'close'
  },
  components: {
    Modal
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    url: {
      type: String
    }
  },
  data() {
    return {
      input_url: "",
      video_id: null,
      player: null,
      error_message: "",
    }
  },
  methods: {
    fetchVideo() {
      if (this.input_url.length > 0) {
        this.video_id = this.getYouTubeId(this.input_url);
        if (this.video_id == null) {
          this.error_message = "Invalid URL";
          this.closePlayer();
          return;
        }
        this.error_message = "";

        if (this.player === null) {
          this.player = new YT.Player('player', {
            height: '360',
            width: '640',
            videoId: this.video_id,
            rel: 0,
          });
        }
        else {
          this.player.cueVideoById(this.video_id);
        }
      }
    },
    getYouTubeId(url) {
      const reg = /^(https?:)?(\/\/)?((www\.|m\.)?youtube(-nocookie)?\.com\/((watch)?\?(feature=\w*&)?vi?=|embed\/|vi?\/|e\/)|youtu.be\/)([\w\-]{10,20})/i
      const match = url.match(reg);
      if (match) {
          return match[9];
      }
      return null;
    },
    addVideo() {
      this.closePlayer();
      this.video_id = this.getYouTubeId(this.input_url);
      this.$emit('add', this.video_id);
      this.$emit('close', false);
    },
    removeVideo() {
      this.video_id = null;
      this.addVideo();
    },
    closePlayer() {
      if (this.player) {
        this.player.destroy();
        this.player = null;
      }
    }
  },
  watch: {
    show() {
      if (this.show === true) {
        if (this.url) {
          this.video_id = this.url;
          this.input_url = "https://www.youtube.com/watch?v=" + this.url;
        }
        else {
          this.video_id = null;
          this.input_url = null;
        }

        let self = this;
        this.$nextTick().then(() => {
          self.$refs.url.focus();
        });
      }
    },
  }
}
</script>