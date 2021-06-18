<template>
  <el-upload
    class="upload-demo"
    auto-upload
    action=""
    :show-file-list="false"
    :file-list="fileList"
    :http-request="handleUpload"
  >
    <el-button icon="el-icon-plus" size="small" type="primary">上传分包汇总工程量</el-button>
  </el-upload>
</template>

<script>
import Api from '@/views/construction/engineeringAmountManage/api'
export default {
  name: 'UploadFile',
  components: {},
  props: {},
  data() {
    return {
      fileList: []
    }
  },
  created() {},
  methods: {
    async handleUpload(params) {
      const file = params.file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('sss', 'ddd')
      let res = await Api.uploadSubPayAmount(formData)
      this.$emit('success', res)
    }
  }
}
</script>

<style lang="less" scoped></style>
