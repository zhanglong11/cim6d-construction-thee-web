<template>
  <div class="container no-padding" :class="{ inDialog, isFooter: !inDialog }">
    <component :is="inDialog ? 'div' : 'el-card'" class="box-card">
      <el-row :gutter="15">
        <el-col :span="inDialog ? 22 : 10">
          <el-form ref="form" :model="form" :rules="rules" label-width="160px" class="form-con">
            <el-form-item label="工程名称" prop="engineeringName">
              <el-input v-model="form.engineeringName" type="textarea" :rows="4" />
            </el-form-item>
            <el-form-item label="编号" prop="qualityProblemCode">
              <el-input v-model="form.qualityProblemCode" class="form-input" type="text" />
            </el-form-item>
            <el-form-item label="联系单位" prop="noticeContactCompany">
              <el-input v-model="form.noticeContactCompany" class="form-input" type="textarea" :rows="4" />
            </el-form-item>
            <el-form-item label="事由" prop="reason">
              <el-input v-model="form.reason" type="textarea" :rows="4" />
            </el-form-item>
            <el-form-item label="具体内容" prop="concreteContent">
              <el-input v-model="form.concreteContent" type="textarea" :rows="4" />
            </el-form-item>
            <el-form-item label="附件">
              <FileEdit v-model="form.fileIds" />
            </el-form-item>

            <el-form-item label="施工单位" prop="constructionCompany">
              <el-input v-model="form.constructionCompany" type="textarea" :rows="4" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </component>
    <div v-if="!inDialog" class="footer-btn">
      <el-button size="lg" @click="goBack()">取消</el-button>

      <el-button size="lg" :loading="btnSaveLoading" @click="goSubmit()">提交</el-button>
      <el-button size="lg" type="primary" :loading="btnSaveLoadingSave" @click="saveCaoGao(null)">保存</el-button>
    </div>
  </div>
</template>

<script>
import api from '../api'
export default {
  name: 'WorkAdd',
  components: {},
  data() {
    return {
      id: '',
      form: {
        engineeringName: '深圳市海洋新兴产业基地陆域形成工程2a标段施工',
        noticeContactCompany: '深圳市特区建发海洋产业发展有限公司',
        constructionCompany: '中交天津航道局有限公司'
      },
      inDialog: false,
      weatherInfo: {},
      rules: {
        engineeringName: [{ required: true, message: '必填' }],
        qualityProblemCode: [{ required: true, message: '必填' }],
        noticeContactCompany: [{ required: true, message: '必填' }],
        reason: [{ required: true, message: '必填' }],
        concreteContent: [{ required: true, message: '必填' }],
        constructionCompany: [{ required: true, message: '必填' }]
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
        name: 'WorkDetail',
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
      this.btnSaveLoadingSave = true
      let res = this.id && this.status !== 3 ? await api.getworksUpdate(form) : await api.getworksSave(form)
      if (res.code === 200) {
        this.btnSaveLoadingSave = false
        this.$message.success('操作成功')
        this.goBack()
      }
    },
    //提交
    async goSubmit() {
      await this.$refs.form.validate()
      const form = _.cloneDeep(this.form)
      this.btnSaveLoading = true
      let res = this.id && this.status !== 3 ? await api.getworksUpdateAndSub(form) : await api.getworkAndSubmit(form)

      if (res.code === 200) {
        this.btnSaveLoading = false
        this.$message.success('操作成功')
        this.goBack()
      }
    },
    //下载
    goDwon() {},
    //详情
    getDetail() {
      api.getworkDetail(this.id).then(res => {
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
