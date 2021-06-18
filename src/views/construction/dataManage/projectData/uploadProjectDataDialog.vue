<template>
  <el-dialog title="上传资料" :visible="visible" width="600px" @close="handleCancel">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="文件">
        <el-upload
          class="upload-project-data"
          :headers="{ 'x-access-token': token }"
          :action="axios.file.defaults.baseURL + '/file/commonFile/upload'"
          :file-list="fileList"
          :before-remove="beforeRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-exceed="handleExceed"
          :limit="limit"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" placeholder="请输入备注" :rows="2" type="textarea" />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'UploadProjectDataDialog',
  components: {},
  props: {
    visible: Boolean,
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    // 这里存放数据
    return {
      token: getToken(),
      form: {
        remark: '',
        fileId: '',
        fileName: ''
      },
      fileList: []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    // 取消
    handleCancel() {
      this.fileList = []
      this.form = {
        remark: '',
        fileId: '',
        fileName: ''
      }
      this.$emit('update:visible', false)
    },
    // 确定
    handleSubmit() {
      // console.log(this.form)
      // console.log(this.fileList)
      if (this.fileList.length === 0) {
        this.$message.error('请上传文件')
      } else {
        this.form.fileId = this.fileList[0].response.data
        this.form.fileName = this.fileList[0].name
        this.$emit('uploadProjectDataCallback', this.form)
      }
    },
    // 移除文件
    beforeRemove(file, fileList) {
      if (file.status === 'success') {
        return this.$confirm(`确定移除 ${file.name}？`)
          .then(() => {
            this.fileList = []
          })
          .catch(() => {})
      }
    },
    // 提示限制的文件个数
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    // 上传成功
    handleSuccess(response, file, fileList) {
      this.fileList = fileList
    },
    // 上传失败
    handleError(err, file, fileList) {
      console.log(err)
    }
  }
}
</script>

<style lang="less" scoped>
.upload-project-data {
  /deep/ .el-upload {
    text-align: left;
  }
}
</style>
