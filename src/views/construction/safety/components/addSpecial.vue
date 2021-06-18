<template>
  <el-dialog
    :title="id ? '修改' : '新建'"
    width="800px"
    top="10vh"
    :visible="visible"
    :close-on-click-modal="false"
    @close="$emit('update:visible', false)"
  >
    <div class="body-container">
      <el-form ref="form" label-width="150px" :model="form" :rules="formRules">
        <el-form-item label="工种" prop="workType">
          <el-select v-model="form.workType" class="from-item">
            <el-option
              v-for="(item, index) of workTypeList"
              :key="'ss' + index"
              :value="item.value"
              :label="item.label"
            ></el-option
          ></el-select>
        </el-form-item>
        <el-form-item label="施工部位" prop="constructionArea">
          <el-input v-model.trim="form.constructionArea" placeholder="请输入施工部位" class="from-item"> </el-input>
        </el-form-item>
        <el-form-item label="作业内容/类型" prop="taskContentType">
          <el-input v-model.trim="form.taskContentType" placeholder="请输入作业内容/类型" class="from-item"> </el-input>
        </el-form-item>
        <el-form-item label="施工负责人" prop="constructionManger">
          <SelectUser
            v-model="form.constructionManger"
            valueFormat="id"
            :multiple="false"
            :name.sync="form.constructionMangerName"
            append-to-body
            class="from-item"
          ></SelectUser>
        </el-form-item>
        <el-form-item label="计划起止时间" prop="planDate">
          <el-date-picker
            v-model="form.planDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 400px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="安全防护措施" prop="safetyPrecautions">
          <el-input
            v-model.trim="form.safetyPrecautions"
            placeholder="请输入安全防护措施"
            class="from-item"
            type="textarea"
            :rows="2"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="附件" prop="fileId">
          <Upload v-model="form.fileId" isOnlyButton multiple class="from-item"></Upload>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button v-promise-btn type="primary" @click="handleSubmit(false)">保 存</el-button>
      <el-button v-promise-btn type="primary" @click="handleSubmit(true)">保存并提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api'
export default {
  name: 'AddSpecial',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {},
      formRules: {
        workType: [{ required: true, message: '工种必选', trigger: 'change' }],
        constructionArea: [{ required: true, message: '施工部位必填', trigger: 'blur' }],
        taskContentType: [{ required: true, message: '作业内容必填', trigger: 'blur' }],
        constructionManger: [{ required: true, message: '负责人必选', trigger: 'change' }],
        planDate: [{ required: true, message: '计划起始日期不能为空', trigger: 'change' }],
        safetyPrecautions: [{ required: true, message: '安全防护措施必填', trigger: 'blur' }]
        // fileId: [{ required: true, message: '附件不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    //工种类型
    workTypeList() {
      return this.$getArgList('workType') || [{ value: 1, label: '架子工' }]
    }
  },
  watch: {
    'form.planDate': {
      immediate: true,
      handler(n, o) {
        if (n.length > 0) {
          this.form.planStartDate = this.moment(n[0]).format('YYYY-MM-DD 00:00:00')
          this.form.planEndDate = this.moment(n[1]).format('YYYY-MM-DD 23:59:59:00:00')
        }
      }
    }
  },
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    //获取详情
    async getDetail() {
      let res = await Api.getSpecialDetail(this.id)
      this.form = { ...res.data, planDate: [res.data.planStartDate, res.data.planEndDate] }
    },
    //点击确定
    async handleSubmit(isSubmit = false) {
      await this.$refs['form'].validate()
      this.$emit('submit', isSubmit, this.form)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
</style>
