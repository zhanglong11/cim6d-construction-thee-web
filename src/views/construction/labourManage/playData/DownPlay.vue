<template>
  <div>
    <el-dialog
      class="beauty"
      el-dialog
      title="导入工资支付单"
      :visible="visible"
      width="600px"
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
        <el-form-item label="选择公司名称" prop="labourCompanyId">
          <el-select v-model="form.labourCompanyId" placeholder="请选择劳务公司">
            <el-option v-for="item in selectDates" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择工资月份" prop="date">
          <el-date-picker
            v-model="form.date"
            type="month"
            format="yyyy-MM"
            placeholder="选择年"
            value-format="yyyy-MM"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="工资支付单" prop="file">
          <Upload v-model="form.file" raw isOnlyButton class="upload-demo" name="file" :limit="1">
            <el-button size="small" type="primary">导入工资支付单</el-button>
          </Upload>
        </el-form-item>
      </el-form>
      <footer slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="btnSubmit">确定</el-button>
      </footer>
    </el-dialog>
    <ErrorDetail v-if="errorDialogVisible" :tableData="errorDate" :visible.sync="errorDialogVisible"></ErrorDetail>
  </div>
</template>
<script>
import file from '@/api/file'
import Api from '../api/labour-api'
import ErrorDetail from './ErrorDetail'
export default {
  name: 'PlayUpload',
  components: { ErrorDetail },
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
      errorDialogVisible: false,
      labourCompanyId: '',
      selectDates: [],
      rules: {
        labourCompanyId: [{ required: true, message: '必选公司名称' }],
        date: [{ required: true, message: '必选工资月份' }],
        file: [{ required: true, message: '必选工资支付单' }]
      },
      errorDate: []
    }
  },
  created() {
    this.selectDates = this.selectDate
  },
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
        formData.append('date', this.form.date)
        formData.append('file', this.form.file)
        formData.append('labourCompanyId', this.form.labourCompanyId)
        await Api.getImportLabor(formData).then(res => {
          this.btnLoading = false
          console.log(res)
          if (res.code === 200) {
            this.errorDate = res.data
            this.errorDialogVisible = this.errorDate.length !== 0
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
