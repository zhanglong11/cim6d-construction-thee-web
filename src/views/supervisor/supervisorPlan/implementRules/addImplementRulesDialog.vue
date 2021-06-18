<template>
  <el-dialog :title="id ? '修改' : '新建' + '监理实施细则'" :visible="visible" width="820px" @close="handleCancel">
    <el-form ref="form" :model="form" :rules="formRules" label-width="146px">
      <el-row>
        <el-col :md="12">
          <el-form-item label="监理实施细则名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="适用范围" prop="applyRange">
            <el-input v-model="form.applyRange" placeholder="请输入" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="12">
          <!--<el-form-item label="编制人" prop="authorId" class="select-author">
            <SelectUser
              :id.sync="form.authorId"
              :multiple="false"
              :value="form.authorId ? { id: form.authorId, label: form.authorName } : null"
              :name.sync="form.authorName"
              @input="validateAuthor('authorId')"
            />
          </el-form-item>-->
          <el-form-item label="编制人" prop="writer">
            <el-input v-model="form.writer" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="编制日期" prop="writerDateStr">
            <el-date-picker
              v-model="form.writerDateStr"
              type="date"
              placeholder="请选择"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="12">
          <el-form-item label="监理实施细则备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :md="12"> &nbsp; </el-col>
      </el-row>
      <el-row>
        <el-col :md="12">
          <el-form-item label="监理实施细则附件" prop="fileIds">
            <!--<FileEdit v-model="form.fileIds" @input="validateFileIds('fileIds')" />-->
            <FileEdit v-model="form.fileIds" />
          </el-form-item>
        </el-col>
        <el-col :md="12"> &nbsp; </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="btnSaveLoading" :disabled="btnSaveDisabled" @click="handleSave"
        >保存</el-button
      >
      <!--<el-button
        type="primary"
        :loading="btnSaveSubmitLoading"
        :disabled="btnSaveSubmitDisabled"
        @click="handleSaveSubmit"
        >保存并提交</el-button
      >-->
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api/index'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'AddImplementRulesDialog',
  props: {
    visible: Boolean,
    id: String
  },
  // 这里存放数据
  data() {
    return {
      form: {
        name: '',
        applyRange: '',
        // authorId: null,
        writer: '',
        remark: '',
        writerDateStr: undefined,
        fileIds: '',
        projectId: localStorage.getItem('projectId')
      },
      formRules: {
        name: [{ required: true, message: '必填' }],
        applyRange: [{ required: true, message: '必填' }],
        // authorId: [{ required: true, message: '必选' }],
        writer: [{ required: true, message: '必填' }],
        writerDateStr: [{ required: true, message: '必选' }]
        // fileIds: [{ required: true, message: '必选' }]
      },
      btnSaveLoading: false,
      btnSaveSubmitLoading: false,
      btnSaveDisabled: false,
      btnSaveSubmitDisabled: false
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    if (this.id) {
      this.getImplementRulesDetail()
    }
  },
  // 方法集合
  methods: {
    // 编制人校验
    validateAuthor(authorId) {
      this.$nextTick(() => {
        this.$refs.form.validateField(authorId)
      })
    },
    // 附件校验
    validateFileIds(fileIds) {
      this.$refs.form.validateField(fileIds)
    },
    // 取消
    handleCancel() {
      this.$emit('update:visible', false)
    },
    // 保存
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnSaveLoading = true
          this.btnSaveSubmitDisabled = true
          Api.saveImplementRules(this.form)
            .then(res => {
              this.$message.success('操作成功')
              this.$emit('update:visible', false)
              this.$emit('refresh')
            })
            .finally(() => {
              this.btnSaveLoading = false
              this.btnSaveSubmitDisabled = false
            })
        }
      })
    },
    // 保存并提交
    handleSaveSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnSaveSubmitLoading = true
          this.btnSaveDisabled = true
          Api.saveAndSubmitImplementRules(this.form)
            .then(res => {
              this.$message.success('操作成功')
              this.$emit('update:visible', false)
              this.$emit('refresh')
            })
            .finally(() => {
              this.btnSaveSubmitLoading = false
              this.btnSaveDisabled = false
            })
        }
      })
    },
    // 获取监理实施细则详情
    getImplementRulesDetail() {
      Api.getImplementRulesDetail(this.id).then(res => {
        this.form = res.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
.select-author.is-error {
  /deep/ .vue-treeselect__control {
    border-color: #f56c6c;
  }
  /deep/ .vue-treeselect__control:hover {
    border-color: #f56c6c;
  }
}
</style>
