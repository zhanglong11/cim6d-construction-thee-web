<template>
  <div class="container no-padding" :class="{ inDialog, isFooter: !inDialog }">
    <component :is="inDialog ? 'div' : 'el-card'" class="box-card">
      <el-row :gutter="15">
        <el-col :span="inDialog ? 22 : 10">
          <el-form ref="form" :model="form" :rules="rules" label-width="160px" class="form-con">
            <el-row>
              <el-col>
                <el-form-item label="工程名称" prop="engineeringName">
                  <el-input v-model="form.engineeringName" type="textarea" :rows="2" />
                </el-form-item>
                <el-form-item label="回复单位" prop="rectificationReplyCompany">
                  <el-input v-model="form.rectificationReplyCompany" type="textarea" :rows="4" />
                </el-form-item>
                <el-form-item label="具体内容" prop="concreteContent">
                  <el-input v-model="form.concreteContent" type="textarea" :rows="4" />
                </el-form-item>
                <el-form-item label="附件" prop="fileIds">
                  <FileEdit v-model="form.fileIds" />
                </el-form-item>
                <el-form-item label="回复文件" prop="replyFile">
                  <el-input v-model="form.replyFile" type="textarea" :rows="4" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="包含问题" prop="replyFile"> </el-form-item>
                <div v-for="(item, index) of form.details" :key="index" class="item-main">
                  <div class="item-hdc">
                    <h3>问题{{ index + 1 }}</h3>
                    <el-button class="b-t" @click="showDelete(index)">删除</el-button>
                  </div>
                  <div class="item-body">
                    <el-form-item
                      label="问题描述"
                      :prop="'details.' + index + '.problemDescribe'"
                      :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                    >
                      <el-input v-model="item.problemDescribe" type="textarea" :rows="4" />
                    </el-form-item>
                    <el-form-item
                      label="整改情况"
                      :prop="'details.' + index + '.rectificationSituation'"
                      :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                    >
                      <el-input v-model="item.rectificationSituation" type="textarea" :rows="4" />
                    </el-form-item>
                  </div>
                </div>
                <div style="text-align: right">
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" @click="handleAddItem">新增问题</el-button>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </component>
    <div v-if="!inDialog" class="footer-btn">
      <el-button size="lg" @click="goBack()">取消</el-button>
      <el-button size="lg" type="primary" :loading="btnSaveLoadingSave" @click="saveCaoGao(null)">保存</el-button>
      <el-button size="lg" type="primary" :loading="btnSaveLoading" @click="goSubmit(null)">提交</el-button>
    </div>
  </div>
</template>

<script>
import api from '../api'
export default {
  name: 'RectifyEdit',
  components: {
    // SelectLabourWorker
  },
  data() {
    return {
      id: null,
      form: {
        engineeringName: '深圳市海洋新兴产业基地陆域形成工程2a标段施工',
        rectificationReplyCompany: '深圳市市政工程质量安全监督总站',
        replyFile: '住建局《责令整改通知书》（深建市政改[2021]0566号）',
        details: [
          {
            problemDescribe: '',
            rectificationSituation: ''
          }
        ] //安全隐患
      },
      inDialog: false,
      weatherInfo: {},
      rules: {
        engineeringName: [{ required: true, message: '必填' }],
        rectificationReplyCompany: [{ required: true, message: '必填' }],
        concreteContent: [{ required: true, message: '必填' }],
        replyFile: [{ required: true, message: '必填' }],
        safetyProblem: [{ required: true, message: '必填' }],
        details: []
      },
      btnSaveLoading: false,
      btnSaveLoadingSave: false,
      status: ''
    }
  },
  computed: {},
  created() {},
  beforeCreate() {
    let query = this.$route.query
    if (!+this.$route.query.showAdd && !!+this.$route.query.isDetail) {
      this.$router.replace({
        name: 'RectifyDetail',
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
      if (this.form.details.length <= 0) {
        return this.$message.info('至少添加一个包含问题')
      }

      const form = _.cloneDeep(this.form)
      this.btnSaveLoadingSave = true
      this.id && this.status !== 3 ? await api.getrectifyUpdate(form) : await api.getrectifySave(form)
      this.btnSaveLoadingSave = false
      this.$message.success('操作成功')
      this.goBack()
    },
    //提交
    async goSubmit() {
      await this.$refs.form.validate()
      if (this.form.details.length <= 0) {
        return this.$message.info('至少添加一个包含问题')
      }
      const form = _.cloneDeep(this.form)
      this.btnSaveLoading = true
      this.id && this.status !== 3 ? await api.getrectifyUpdateAndSubmit(form) : await api.getrectifySubmit(form)
      this.btnSaveLoading = false
      this.$message.success('操作成功')
      this.goBack()
    },
    //详情
    getDetail() {
      api.getrectifyDetail(this.id).then(res => {
        this.form = { ...res.data }
      })
    },
    //新增
    handleAddItem() {
      this.form.details.push({
        problemDescribe: '',
        rectificationSituation: ''
      })
    },
    // 隐患删除
    showDelete(index) {
      //  this.form.currentList.splice(scope.$index, 1)
      this.form.details.splice(index, 1)
    },
    // 返回
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
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
.item-main {
  border: 1px solid #ccc;
  font-size: 14px;
  overflow: hidden;
  margin-bottom: 10px;
  .item-hdc {
    border-bottom: 1px solid #ccc;
    padding: 10px 30px;
    margin-bottom: 10px;
    h3 {
      display: inline-block;
      font-size: 14px;
    }
    .b-t {
      display: inline-block;
      margin-left: 40px;
      padding: 8px 30px;
      background: red;
      border: none;
      color: #fff;
      border-radius: 10%;
    }
  }
}
</style>
