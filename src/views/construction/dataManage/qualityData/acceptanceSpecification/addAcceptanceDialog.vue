<template>
  <el-dialog
    :title="id ? '修改' : '新建' + '验收规范'"
    :visible="visible"
    width="600px"
    :close-on-click-modal="false"
    @close="handleCancel"
  >
    <el-form ref="form" :model="form" :rules="formRules" label-width="140px">
      <el-form-item label="规范编号" prop="specificationNumber">
        <el-input v-model="form.specificationNumber" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="规范名称" prop="specificationName">
        <el-input v-model="form.specificationName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-select v-model="form.category" placeholder="请选择" style="width: 100%">
          <el-option v-for="item in norm" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
      </el-form-item>
      <el-form-item label="附件" prop="contentFileIds">
        <FileEdit v-model="form.contentFileIds" />
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
import norm from './lib/norm'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'AddAcceptanceDialog',
  props: {
    visible: Boolean,
    id: String
  },
  // 这里存放数据
  data() {
    return {
      norm,
      form: {
        specificationNumber: '',
        specificationName: '',
        category: undefined,
        contentFileIds: '',
        remark: ''
      },
      formRules: {
        specificationNumber: [{ required: true, message: '必填' }],
        specificationName: [{ required: true, message: '必填' }],
        category: [{ required: true, message: '必选' }]
      },
      btnSaveLoading: false
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    if (this.id) {
      this.getCheckSpecificDetail()
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
            Api.updateCheckSpecific({ ...this.form, projectId })
              .then(res => {
                this.$message.success('编辑成功')
                this.$emit('update:visible', false)
                this.$emit('refresh')
              })
              .finally(() => {
                this.btnSaveLoading = false
              })
          } else {
            Api.addCheckSpecific({ ...this.form, projectId })
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
    getCheckSpecificDetail() {
      Api.getCheckSpecificDetail(this.id).then(res => {
        this.form = res.data
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
