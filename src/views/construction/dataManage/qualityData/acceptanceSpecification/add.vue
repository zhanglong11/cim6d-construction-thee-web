<template>
  <div class="no-padding">
    <el-card class="box-card">
      <el-form ref="form" :model="form" :rules="formRules" label-width="140px">
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="规范编号" prop="code">
              <el-input v-model="form.code" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="规范名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="类别" prop="type">
              <el-select v-model="form.type" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in norm" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
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
import norm from './lib/norm'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'AcceptanceSpecificationAdd',
  components: {},
  data() {
    // 这里存放数据
    return {
      norm,
      form: {
        code: '',
        name: '',
        type: undefined,
        fileIds: '',
        remark: ''
      },
      formRules: {
        code: [{ required: true, message: '必填' }],
        name: [{ required: true, message: '必填' }],
        type: [{ required: true, message: '必选' }]
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
      this.$router.push({ name: 'QualityDataList' })
    },
    // 保存
    handleSave() {}
  }
}
</script>

<style lang="less" scoped></style>
