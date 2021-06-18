<template>
  <el-dialog
    :title="id ? '修改' : '新建' + '安全资料'"
    :visible="visible"
    width="600px"
    :close-on-click-modal="false"
    @close="handleCancel"
  >
    <el-form ref="form" :model="form" :rules="formRules" label-width="140px">
      <el-form-item label="资料名称" prop="regimeName">
        <el-input v-model="form.regimeName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="资料内容" prop="regimeContent">
        <el-input v-model="form.regimeContent" type="textarea" :rows="2" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="上传附件" prop="files">
        <FileEdit v-model="form.files" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="btnSaveLoading" @click="handleSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../../api/index'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'AddSafeRegimeDialog',
  props: {
    visible: Boolean,
    id: String
  },
  // 这里存放数据
  data() {
    return {
      form: {
        regimeName: '',
        regimeContent: '',
        files: '',
        remark: ''
      },
      formRules: {
        regimeName: [{ required: true, message: '必填' }],
        regimeContent: [{ required: true, message: '必填' }]
      },
      btnSaveLoading: false
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    if (this.id) {
      this.getManageRegimeDetail()
    }
  },
  // 方法集合
  methods: {
    // 取消
    handleCancel() {
      this.$emit('update:visible', false)
    },
    // 确定
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnSaveLoading = true
          let projectId = localStorage.getItem('projectId')
          if (this.id) {
            Api.updateManageRegime({ ...this.form, projectId })
              .then(res => {
                this.$message.success('编辑成功')
                this.$emit('update:visible', false)
                this.$emit('refresh')
              })
              .finally(() => {
                this.btnSaveLoading = false
              })
          } else {
            Api.addManageRegime({ ...this.form, projectId })
              .then(res => {
                this.$message.success('添加成功')
                this.$emit('update:visible', false)
                this.$emit('refresh')
              })
              .finally(() => {
                this.btnSaveLoading = false
              })
          }
        }
      })
    },
    // 获取验收规范详情
    getManageRegimeDetail() {
      Api.getManageRegimeDetail(this.id).then(res => {
        this.form = res.data
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
