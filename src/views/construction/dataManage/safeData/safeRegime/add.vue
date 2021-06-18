<template>
  <div class="no-padding">
    <el-card class="box-card">
      <el-form ref="form" :model="form" :rules="formRules" label-width="140px">
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="制度名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="制度内容" prop="content">
              <el-input v-model="form.content" type="textarea" :rows="2" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="附件" prop="fileIds">
              <FileEdit v-model="form.fileIds" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="handleCancel()">取消</el-button>
      <el-button size="lg" type="primary" :loading="btnSaveLoading" @click="handleSave()">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'SafeRegimeAdd',
  components: {},
  data() {
    // 这里存放数据
    return {
      form: {
        name: '',
        content: '',
        fileIds: '',
        remark: ''
      },
      formRules: {
        name: [{ required: true, message: '必填' }],
        content: [{ required: true, message: '必填' }]
      },
      btnSaveLoading: false
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    console.log(this.$route.params.id)
  },
  // 方法集合
  methods: {
    // 取消
    handleCancel() {
      this.$router.push({ name: 'SafeRegimeList' })
    },
    // 保存
    handleSave() {}
  }
}
</script>

<style lang="less" scoped></style>
