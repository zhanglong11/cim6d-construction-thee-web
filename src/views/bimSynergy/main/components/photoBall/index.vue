<template>
  <div id="viewer" ref="viewer" class="wrap"></div>
</template>

<script>
export default {
  name: 'PhotoBall',
  // import引入的组件
  components: {},
  props: {
    imgUrl: {
      default: ''
    }
  },
  data() {
    // 这里存放数据
    return {
      viewer: ''
    }
  },
  watch: {
    imgUrl() {
      this.refresh()
    }
  },
  // 生命周期 - 挂载完成
  created() {},
  mounted() {
    this.refresh()
  },
  // 方法集合
  methods: {
    //刷新
    refresh() {
      if (!this.imgUrl) return
      this.viewer = new window.PhotoSphereViewer.Viewer({
        // container: document.querySelector('#viewer'),
        container: this.$refs.viewer,
        panorama: this.imgUrl,
        panoData: image => ({
          fullWidth: image.width,
          fullHeight: image.height,
          croppedWidth: image.width,
          croppedHeight: image.height
          /*croppedX: 0,
          croppedY: image.width / 2 - image.height*/
        }),
        size: {
          width: '100%',
          height: '100%'
        }
      })
      /*this.$nextTick(() => {
        this.viewer.on('fullscreen-updated', async (e, flag) => {
          console.log(e, flag)
          if (flag) {
            await this.viewer.setPanorama('/11.jpg', {
              showLoader: false,
              panoData: image => ({
                fullWidth: image.width,
                fullHeight: image.width / 2,
                croppedWidth: image.width,
                croppedHeight: image.height
              })
            })
            // this.viewer.enterFullscreen()
          } else {
            await this.viewer.setPanorama('/11.jpg', {
              showLoader: false,
              panoData: image => ({
                fullWidth: image.width,
                fullHeight: image.width / 2,
                croppedWidth: image.width,
                croppedHeight: image.height
              })
            })
            // this.viewer.exitFullscreen()
          }
        })
      })*/
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
  width: 100%;
  height: 100%;
}
</style>
