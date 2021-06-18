<template>
  <div :id="id"></div>
</template>

<script>
export default {
  name: 'Video',
  props: {
    url: {
      required: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    fluid: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      id: 'video-' + _.uniqueId(),
      player: null
    }
  },
  watch: {
    url() {
      if (this.player) {
        this.player.destroy()
      }
      this.player = new WasmPlayer(null, this.id, null, {
        cbUserPtr: this,
        Height: true,
        HideKbs: true
      })
      this.player.play(this.url, 1)
    }
  },
  beforeMount() {
    if (this.player) {
      this.player.destroy()
    }
  },
  mounted() {
    // 实例化播放器
    this.player = new WasmPlayer(null, this.id, null, {
      cbUserPtr: this,
      Height: true,
      HideKbs: true
    })
    // 调用播放
    this.player.play(this.url, 1)
  },
  methods: {
    remove() {
      this.$emit('remove')
    },
    pause() {
      this.player.pause()
    },
    destroy() {
      this.player.destroy()
    }
  }
}
</script>

<style scoped lang="less"></style>
