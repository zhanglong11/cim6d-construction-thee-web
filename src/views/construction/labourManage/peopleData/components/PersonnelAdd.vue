<template>
  <div>
    <el-dialog
      class="beauty"
      el-dialog
      title="人员信息导入"
      :visible="visible"
      width="550px"
      :close-on-click-modal="false"
      @close="close"
    >
      <el-form
        ref="form"
        :model="form"
        style="width: 450px; margin-top: 10px; margin-left: 10px"
        label-width="150px"
        :rules="rules"
      >
        <el-form-item label="人员导入：" prop="file">
          <Upload v-model="form.file" raw isOnlyButton class="upload-demo" name="file" :limit="1"> </Upload>
        </el-form-item>
      </el-form>
      <footer slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="btnSubmit">确定</el-button>
      </footer>
    </el-dialog>
    <ErrorsDetail v-if="errorDialogVisible" :tableData="errorDate" :visible.sync="errorDialogVisible"></ErrorsDetail>
  </div>
</template>
<script>
import file from '@/api/file'
import Api from '../../api/labour-api'
import ErrorsDetail from './ErrorsDetail'
export default {
  name: 'PersonnelAdd',
  components: { ErrorsDetail },
  props: {
    // 弹窗是否显示
    visible: {
      default: false,
      type: Boolean
    },
    selectDate: {
      default() {
        return []
      },
      type: Array
    }
  },
  data() {
    return {
      form: {
        file: null
      },
      btnLoading: false,
      rules: {
        file: [{ required: true, message: '必选' }]
      },
      errorDate: [],
      errorDialogVisible: false
    }
  },
  created() {},
  methods: {
    handleExceed() {
      this.$message.warning(`当前限制选择 1 个文件`)
    },
    //确定上传
    async btnSubmit() {
      try {
        await this.$refs.form.validate()
        this.btnLoading = true
        const formData = new FormData()
        formData.append('file', this.form.file)
        await Api.getLabourimportExcel(formData).then(res => {
          this.btnLoading = false
          if (res.code === 200) {
            this.errorDate = res.data
            this.errorDialogVisible = this.errorDate.failNum !== 0
            if (!this.errorDialogVisible) {
              this.$message.success('导入成功')
              this.close()
            }
            this.$parent.refresh()
          } else {
            this.$message.error('导入失败')
          }
        })
      } catch (e) {
        this.btnLoading = false
      }
    },
    // 关闭弹窗
    close() {
      this.$emit('update:visible', false)
      this.form = {}
    }
  }
}
</script>
<style scoped lang="less">
/deep/.el-upload {
  text-align: left;
}
</style>
