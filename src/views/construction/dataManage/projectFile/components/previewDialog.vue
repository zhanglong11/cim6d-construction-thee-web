<template>
  <el-dialog title="预览" :visible="visible" @close="close">
    <img v-if="fileType === 'img' && previewUrl" class="preview-image" :src="previewUrl" alt="" />
    <video
      v-else-if="fileType === 'video' && previewUrl"
      autoplay
      class="preview-video"
      width="100%"
      controls
      :src="previewUrl"
      alt=""
    />
    <iframe v-else ref="iframe" width="100%" style="height: 60vh" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { filePreviewUrl } from '@/utils/axios'
const imgReg = /(.*)\.(jpg|png|jepg|gif|webp|jpeg|dwg)$/
const videoReg = /(.*)\.(mp4|mkv|ogg|webm)$/
export default {
  name: 'PreviewDialog',
  // import引入的组件
  components: {},
  props: {
    visible: {},
    fileId: {
      type: [Number, String],
      required: true
    },
    fileName: {},
    previewUrl: {}
  },
  data() {
    // 这里存放数据
    return {}
  },
  computed: {
    fileType() {
      if (imgReg.test(this.fileName.toLowerCase())) {
        return 'img'
      } else if (videoReg.test(this.fileName.toLowerCase())) {
        return 'video'
      } else {
        return 'other'
      }
    }
  },
  // 生命周期 - 挂载完成
  created() {
    setTimeout(() => {
      this.$refs.iframe.src = `${filePreviewUrl}/noToken/common/document/onlinePreview/${this.fileId}`
    })
  },
  // 方法集合
  methods: {
    //刷新
    refresh() {},
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
.preview-image,
.preview-video {
  width: 100%;
  height: 100%;
}
</style>
