<template>
  <div class="container no-padding" :class="{ inDialog, isFooter: !inDialog }">
    <component :is="inDialog ? 'div' : 'el-card'" class="box-card">
      <el-row :gutter="15">
        <el-col :span="inDialog ? 22 : 10">
          <el-form ref="form" :model="form" :rules="rules" label-width="160px" class="form-con">
            <el-form-item label="通知日期" prop="noticeDate">
              <el-date-picker v-model="form.noticeDate" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
            </el-form-item>
            <el-form-item label="工程名称" prop="engineeringName">
              <el-input v-model="form.engineeringName" />
            </el-form-item>
            <el-form-item label="编号" prop="qualityProblemCode">
              <el-input v-model="form.qualityProblemCode" class="form-input" type="text" />
            </el-form-item>
            <el-form-item label="协作单位" prop="collaborationCompany">
              <el-input v-model="form.collaborationCompany" class="form-input" type="text" />
            </el-form-item>
            <el-form-item label="施工内容" prop="constructionContent">
              <el-input v-model="form.constructionContent" type="text" />
            </el-form-item>
            <el-form-item label="通知单位" prop="noticeContactCompany">
              <el-input v-model="form.noticeContactCompany" type="textarea" :rows="4" />
            </el-form-item>
            <el-form-item label="现场问题" prop="siteProblem">
              <el-input v-model="form.siteProblem" type="textarea" :rows="4" />
            </el-form-item>
            <el-form-item label="整改要求" prop="rectificationRequirements">
              <el-input v-model="form.rectificationRequirements" type="textarea" :rows="4" />
            </el-form-item>
            <el-form-item label="施工单位" prop="constructionCompany">
              <el-input v-model="form.constructionCompany" type="textarea" :rows="4" />
            </el-form-item>
            <el-form-item label="发起时间" prop="startDate">
              <!-- <el-input v-model="form.startDate" type="textarea" :rows="4" maxlength="200" show-word-limit /> -->
              <el-date-picker v-model="form.startDate" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </component>
    <div v-if="!inDialog" class="footer-btn">
      <el-button size="lg" @click="goBack()">取消</el-button>

      <el-button size="lg" :loading="btnSaveLoadingSave" @click="goSubmit()">提交</el-button>
      <el-button size="lg" type="primary" :loading="btnSaveLoading" @click="saveCaoGao()">保存</el-button>
    </div>
  </div>
</template>

<script>
import api from '../api'
export default {
  name: 'QualityEdit',
  components: {},
  data() {
    return {
      id: '',
      form: {
        engineeringName: '深圳市海洋新兴产业基地陆域形成工程2a标段施工',
        constructionCompany: '中交天津航道局有限公司深圳市海洋新兴产业基地陆域形成工程2a标段施工项目经理部',
        noticeDate: moment(new Date()).format('YYYY-MM-DD'),
        startDate: moment(new Date()).format('YYYY-MM-DD')
      },
      inDialog: false,
      weatherInfo: {},
      rules: {
        noticeDate: [{ required: true, message: '必选' }],
        engineeringName: [{ required: true, message: '必填' }],
        qualityProblemCode: [{ required: true, message: '必填' }],
        collaborationCompany: [{ required: true, message: '必填' }],
        constructionContent: [{ required: true, message: '必填' }],
        noticeContactCompany: [{ required: true, message: '必填' }],
        siteProblem: [{ required: true, message: '必填' }],
        rectificationRequirements: [{ required: true, message: '必填' }],
        constructionCompany: [{ required: true, message: '必填' }],
        startDate: [{ required: true, message: '必选' }]
      },
      btnSaveLoading: false,
      btnSaveLoadingSave: false,
      status: ''
    }
  },
  computed: {},
  beforeCreate() {
    let query = this.$route.query
    if (!+this.$route.query.showAdd && !!+this.$route.query.isDetail) {
      this.$router.replace({
        name: 'QualityDetail',
        query: { id: query.targetId, isCheck: query.isCheck }
      })
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.id = this.$route.query.id
    this.status = this.$route.query.status
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    //草稿状态
    async saveCaoGao() {
      await this.$refs.form.validate()
      const form = _.cloneDeep(this.form)
      form.noticeDate = moment(form.noticeDate).format('YYYY-MM-DD HH:00:00')
      form.startDate = moment(form.startDate).format('YYYY-MM-DD HH:00:00')
      this.btnSaveLoading = true
      this.id && this.status !== 3 ? api.getEngineerUpdate(form) : await api.getEngineerSave(form)
      this.btnSaveLoading = false
      this.$message.success('操作成功')
      this.goBack()
    },
    //提交
    async goSubmit() {
      await this.$refs.form.validate()
      const form = _.cloneDeep(this.form)
      form.noticeDate = moment(form.noticeDate).format('YYYY-MM-DD HH:00:00')
      form.startDate = moment(form.startDate).format('YYYY-MM-DD HH:00:00')
      this.btnSaveLoadingSave = true
      this.id && this.status !== 3 ? api.getEngineerUpdateAndSub(form) : await api.getEngineersaveAndSubmit(form)
      this.btnSaveLoadingSave = false
      this.$message.success('操作成功')
      this.goBack()
    },
    //下载
    goDwon() {},
    //详情
    getDetail() {
      api.getEngineeringDetail(this.id).then(res => {
        this.form = { ...res.data }
      })
    },
    // 返回
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.inDialog {
  max-height: calc(100vh - 230px);
  overflow-y: auto;
  overflow-x: hidden;
}
.el-input.temperature {
  display: flex;
  border-radius: 4px;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  .el-input__inner {
    border: none;
    width: 66px;
    text-align: center;
    padding: 0 3px;
  }
}
</style>
