<template>
  <el-dialog title="上传报告" :visible="visible" width="500px" @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="巡更结果" prop="patrolResult">
        <el-radio-group v-model="form.patrolResult">
          <el-radio :label="true">正常</el-radio>
          <el-radio :label="false">异常</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.patrolResult === false" label="发现的问题" prop="reportContent">
        <el-input v-model="form.reportContent" type="textarea" :rows="3" resize="none" />
      </el-form-item>
      <el-form-item v-if="form.patrolResult === false" label="附件">
        <Upload v-model="form.attachment" isOnlyButton />
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="handleEnter">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Api from '../api'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    patrolId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        patrolResult: undefined,
        reportContent: '',
        attachment: ''
      },
      rules: {
        patrolResult: [{ required: true, message: '必选' }],
        reportContent: [{ required: true, message: '必填' }]
      },
      btnLoading: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.form?.resetFields()
        })
      }
    }
  },
  methods: {
    // 取消
    handleCancel() {
      this.$emit('update:visible', false)
    },
    // 确定
    handleEnter() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = { ...this.form, patrolId: this.patrolId }
          // console.log(params)
          this.btnLoading = true
          Api.uploadPatrolReport(params).then(
            res => {
              this.$message.success('操作成功')
              this.handleCancel()
              this.$emit('refresh')
              this.btnLoading = false
            },
            err => {
              this.btnLoading = false
            }
          )
        }
      })
    }
  }
}
</script>
