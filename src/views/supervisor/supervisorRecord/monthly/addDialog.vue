<template>
  <el-dialog :title="id ? '修改' : '新建' + '监理月报基本信息'" :visible="visible" width="820px" @close="handleCancel">
    <el-form ref="form" :model="form" :rules="formRules" label-width="150px">
      <el-row>
        <el-col :md="12">
          <el-form-item label="监理月报名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="年度" prop="year">
            <el-date-picker
              v-model="form.year"
              type="year"
              value-format="yyyy"
              placeholder="请选择"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="12">
          <el-form-item label="月度" prop="month">
            <SelectList v-model="form.month" :self-list="monthList" :has-all-option="false" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="编制人" prop="writer">
            <SelectUser
              :id.sync="form.writer"
              :multiple="false"
              :value="form.writer ? { id: form.writer, label: form.writerName } : null"
              :name.sync="form.writerName"
              @input="validateAuthor('writer')"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="12">
          <el-form-item label="编制日期" prop="writeDate">
            <el-date-picker
              v-model="form.writeDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="请选择"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="监理月报备注">
            <el-input v-model="form.remark" type="textarea" :row="2" placeolder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="14">
          <el-form-item label="监理月报附件">
            <FileEdit v-model="form.fileIds" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="btnSaveLoading" @click="handleSave">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api'
import monthList from '../lib/monthList'
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
        projectId: this.$store.state.project.projectId,
        creatorName: this.$store.state.user.name,
        creator: this.$store.state.user.id,
        name: '',
        month: ''
      },
      monthList,
      formRules: {
        name: [{ required: true, message: '必填' }],
        writeDate: [{ required: true, message: '必填' }],
        month: [{ required: true, message: '必选' }],
        year: [{ required: true, message: '必选' }],
        writer: [{ required: true, message: '必选' }]
      },
      btnSaveLoading: false
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  // 方法集合
  methods: {
    // 编制人校验
    validateAuthor(writer) {
      this.$nextTick(() => {
        this.$refs.form.validateField(writer)
      })
    },
    // 取消
    handleCancel() {
      this.$emit('update:visible', false)
    },
    // 保存
    async handleSave() {
      try {
        await this.$refs.form.validate()
        this.btnSaveLoading = true
        await Api.getMonthlyAdd(this.form).then(res => {
          if (res.code === 200) {
            this.btnSaveLoading = false
            this.$message.success('保存成功')
            this.handleCancel()
            this.$parent.refresh()
          } else {
            this.$message.success('保存失败')
          }
        })
      } catch (e) {
        this.btnSaveLoading = false
      }
    },
    //获取月份
    getMonth(e) {
      this.form.month = e.split('-')[1]
    },
    // 获取详情
    getDetail() {
      Api.getMonthlyInfo(this.id).then(res => {
        this.form = res.data || {}
        this.form.year = res.data.year.toString()
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
