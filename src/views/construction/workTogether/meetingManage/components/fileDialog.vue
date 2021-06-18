<template>
  <el-dialog
    width="600px"
    top="10vh"
    title="查看会议记录"
    append-to-body
    :close-on-click-modal="false"
    :visible="visible"
    @close="close"
  >
    <img v-if="type === 'img'" class="preview-image" :src="fileUrl" alt="" />
    <video v-if="type === 'video'" autoplay class="preview-video" width="100%" controls :src="fileUrl" alt="" />
    <template v-if="showFrame">
      <iframe v-if="type === 'office' || type === 'pdfTxt'" ref="iframe" width="100%" style="height: 60vh" />
    </template>

    <span slot="footer" class="dialog-footer">
      <el-button @click="download">下载</el-button>
      <el-button type="primary" @click="close">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
const imgReg = /(.*)\.(jpg|png|jepg|gif|webp|jpeg)$/
const videoReg = /(.*)\.(mp4|mkv|ogg|webm)$/
const officeReg = /(.*)\.(doc|xls|xlsx|docx|ppt|pptx)$/
const pdfTxtReg = /(.*)\.(pdf|txt)$/
import Api from '@/api/file'
import { filePreviewUrl, getDownload } from '@/utils/axios'
import { saveAs } from 'file-saver'
export default {
  name: 'FileDialog',
  props: {
    visible: {
      type: Boolean
    },
    fileId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      fileUrl: '',
      fileName: '',
      showFrame: false
    }
  },
  computed: {
    type() {
      if (!this.fileName) return 'other'
      if (imgReg.test(this.fileName.toLowerCase())) {
        return 'img'
      } else if (videoReg.test(this.fileName.toLowerCase())) {
        return 'video'
      } else if (officeReg.test(this.fileName.toLowerCase())) {
        return 'office'
      } else if (pdfTxtReg.test(this.fileName.toLowerCase())) {
        return 'pdfTxt'
      } else {
        return 'other'
      }
    }
  },
  created() {
    Api.getFileList([this.fileId])
      .then(res => {
        this.fileUrl = res.data[0].fileUrl
        this.fileName = res.data[0].fileName
      })
      .then(() => {
        this.showPdf()
      })
  },
  methods: {
    async showPdf() {
      let res = await this.axios.file(`/noToken/file/commonFile/onlinePreview/${this.fileId}`, {
        type: 'noHold'
      })
      if ((this.type === 'pdfTxt' || this.type === 'office') && res.data.code === 500) {
        this.$message.error('文件内容有误，无法预览')
        return
      }
      this.showFrame = true
      setTimeout(() => {
        this.$refs.iframe.src = `${filePreviewUrl}/noToken/file/commonFile/onlinePreview/${this.fileId}`
      }, 100)
    },
    close() {
      this.$emit('update:visible', false)
    },
    async download() {
      const res = await getDownload(`/noToken/file/commonFile/download/${this.fileId}`, {})
      saveAs(res.data, this.fileName ? this.fileName : 'download')
    }
  }
}
</script>

<style scoped lang="less">
.preview-image {
  display: block;
  margin: 0 auto;
  max-width: 100%;
}
a {
  font-size: 14px;
}
.disabled {
  color: #333;
  cursor: not-allowed;
}
/deep/ .el-dialog__header {
  border-bottom: 1px #eeeeee solid;
}
</style>
