<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <el-form ref="form" :model="form" :rules="formRules" label-width="140px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="图纸名称" prop="drawingsName">
              <el-input v-model="form.drawingsName" placeholder="请输入图纸名称" style="width: 50%" />
            </el-form-item>
            <el-form-item label="图纸" required>
              <el-upload
                ref="upload"
                :action="action"
                :headers="headers"
                name="file"
                :file-list="fileList"
                :on-error="handleError"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :accept="suffix"
                :before-upload="beforeUpload"
              >
                <el-button slot="trigger" size="small" type="primary">上传图纸</el-button>
                <div slot="tip" class="el-upload__tip">只能上传dwg,jpg,png等格式的文件</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="附件">
              <Upload v-model="form.attachmentIds" isOnlyButton multiple class="from-item"></Upload>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" :rows="3" resize="none" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="footer-btn">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="btnSaveLoading" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<script>
import { updateDrawings, getDrawingsDetail } from '../api'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      action: '/bim-oda-handle/convert',
      headers: {
        'x-access-token': getToken()
      },
      id: this.$route.params.id || '',
      fileList: [],
      form: {
        drawingsName: '',
        modelUrls: [],
        sourceUrls: [],
        sourceNames: [],
        attachmentIds: '',
        remark: ''
      },
      formRules: {
        drawingsName: [{ required: true, message: '必填' }]
      },
      btnSaveLoading: false,
      suffix: '.dwg,.png,.jpg,.jpeg'
    }
  },
  mounted() {
    if (this.id) {
      this.getDrawingsDetail(this.id)
    }
  },
  methods: {
    // 获取图纸详情
    getDrawingsDetail(id) {
      getDrawingsDetail(id).then(res => {
        // console.log(res)
        let data = res.data
        let form = {}
        form.drawingsName = data.drawingsName
        form.attachmentIds = data.attachmentIds
        form.remark = data.remark
        let sourceNames = JSON.parse(data.sourceNames)
        let modelUrls = JSON.parse(data.modelUrls)
        let sourceUrls = JSON.parse(data.sourceUrls)
        form.sourceNames = sourceNames
        form.modelUrls = modelUrls
        form.sourceUrls = sourceUrls
        for (let i = 0; i < sourceNames.length; i++) {
          let file = {
            name: sourceNames[i],
            response: {
              data: {
                sourceFileUrl: sourceUrls[i],
                targetFileUrl: modelUrls[i]
              }
            }
          }
          this.fileList.push(file)
        }
        this.form = form
      })
    },
    // 取消
    handleCancel() {
      this.$router.back()
    },
    // 保存
    async handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.modelUrls[0]) {
            this.btnSaveLoading = true
            let params = {
              id: this.id,
              drawingsName: this.form.drawingsName,
              modelUrls: JSON.stringify(this.form.modelUrls),
              sourceUrls: JSON.stringify(this.form.sourceUrls),
              sourceNames: JSON.stringify(this.form.sourceNames),
              attachmentIds: this.form.attachmentIds,
              remark: this.form.remark
            }
            // console.log(params)
            updateDrawings(params).then(
              res => {
                this.$message.success('操作成功')
                this.$router.back()
                this.btnSaveLoading = false
              },
              err => {
                this.btnSaveLoading = false
              }
            )
          } else {
            this.$message.error('请上传图纸')
          }
        }
      })
    },
    // 图纸上传失败
    handleError(error) {
      this.$message.error(error.status + '：' + error.message)
    },
    // 图纸上传成功
    handleSuccess(res, file, fileList) {
      // console.log(res)
      // console.log(file)
      // console.log(fileList)
      if (res.code === 200) {
        // this.$message.success('上传成功')
        this.form.modelUrls.push(res.data.targetFileUrl)
        this.form.sourceUrls.push(res.data.sourceFileUrl)
        this.form.sourceNames.push(file.name)
      } else {
        this.$message.error('文件上传失败，请联系管理员')
      }
      // console.log(file)
    },
    // 图纸上传前
    beforeUpload(file) {
      // console.log(file)
      let suffixArr = this.suffix.split(',')
      let curSuffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length)
      if (suffixArr.includes(curSuffix.toLowerCase())) {
        return true
      } else {
        this.$message.error('仅支持' + this.suffix + '格式的文件')
        return false
      }
    },
    // 图纸移除
    handleRemove(file, fileList) {
      // console.log(file)
      // console.log(fileList)
      if (file.response) {
        /*file.response.data.targetFileUrl
        file.response.data.sourceFileUrl*/
        let index = null
        for (let i = 0; i < this.form.modelUrls.length; i++) {
          if (file.response.data.targetFileUrl === this.form.modelUrls[i]) {
            index = i
          }
        }
        if (index !== null) {
          this.form.modelUrls.splice(index, 1)
          this.form.sourceUrls.splice(index, 1)
          this.form.sourceNames.splice(index, 1)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-upload {
  width: unset;
}
</style>
