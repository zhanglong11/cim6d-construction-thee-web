<template>
  <el-dialog title="添加资料分类" :visible="visible" width="600px" @close="handleCancel">
    <el-form ref="form" :model="form" :rules="formRules" label-width="100px">
      <el-form-item label="分类名称" prop="argText">
        <el-input v-model="form.argText" placeholder="资料分类名称"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'DictDialog',
  components: {},
  props: {
    visible: Boolean
  },
  data() {
    // 这里存放数据
    return {
      form: {
        argText: ''
      },
      formRules: {
        argText: [{ required: true, message: '必填' }]
      }
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    // 取消
    handleCancel() {
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    },
    // 确定
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            module: 'construction',
            argGroup: 'informationType',
            argText: this.form.argText
          }
          this.axios.system.post(`/cim6d/arg/general/add`, params).then(res => {
            if (res.code === 200) {
              this.$emit('dictCallback', {
                argGroup: 'informationType',
                argText: this.form.argText
              })
              this.handleCancel()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
