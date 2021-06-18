<template>
  <div class="container no-padding" :class="{ inDialog, isFooter: !inDialog }">
    <component :is="inDialog ? 'div' : 'el-card'" class="box-card">
      <el-row :gutter="15">
        <el-col :span="inDialog ? 40 : 18">
          <el-form ref="form" :model="form" :rules="rules" label-width="160px" class="form-con">
            <el-row>
              <el-col :span="inDialog ? 22 : 10">
                <el-form-item label="检查日期" prop="checkDate">
                  <el-date-picker v-model="form.checkDate" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
                </el-form-item>
                <el-form-item label="检查组长" prop="checkGroupLeader">
                  <el-input v-model="form.checkGroupLeader" />
                </el-form-item>
                <el-form-item label="检查组员" prop="checkGroupMembers">
                  <el-input v-model="form.checkGroupMembers" />
                </el-form-item>
                <el-form-item label="建设单位" prop="buildCompany">
                  <el-input v-model="form.buildCompany" type="textarea" :rows="4" />
                </el-form-item>
                <el-form-item label="施工单位" prop="constructionCompany">
                  <el-input v-model="form.constructionCompany" type="textarea" :rows="4" />
                </el-form-item>
                <el-form-item label="监理单位" prop="supervisionCompany">
                  <el-input v-model="form.supervisionCompany" type="textarea" :rows="4" />
                </el-form-item>
              </el-col>
            </el-row>
            <div style="text-align: right">
              <el-form-item>
                <el-button type="primary" icon="el-icon-plus" @click="handleAddItem">新增隐患</el-button>
              </el-form-item>
            </div>
            <div v-for="(item, index) in form.details" :key="index" class="item-main">
              <div class="item-hdc">
                <h3>隐患{{ index + 1 }}</h3>
                <el-button class="b-t" @click="handelDelete(index)">删除</el-button>
              </div>
              <div class="item-body">
                <div class="item-one">
                  <h4>隐患排查</h4>
                  <div class="form-label">
                    <el-form-item
                      :prop="'details.' + index + '.safetyHiddenDangerType'"
                      label="隐患类型"
                      :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                    >
                      <el-input v-model="item.safetyHiddenDangerType" />
                    </el-form-item>
                    <el-form-item
                      label="位置/活动"
                      :prop="'details.' + index + '.locationActivity'"
                      :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                    >
                      <el-input v-model="item.locationActivity" />
                    </el-form-item>
                    <el-form-item
                      label="存在隐患或问题描述"
                      :prop="'details.' + index + '.hiddenDangerProblemDescribe'"
                      :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                    >
                      <el-input v-model="item.hiddenDangerProblemDescribe" type="textarea" :rows="2" />
                    </el-form-item>
                    <el-form-item
                      style="width: 100%"
                      label="隐患照片"
                      :prop="'details.' + index + '.hiddenDangerFileIds'"
                      :rules="[{ required: true, message: '必选', trigger: 'blur' }]"
                    >
                      <Upload v-model="item.hiddenDangerFileIds" btnText="上传照片" accept="jpg,png" isOnlyButton />
                    </el-form-item>
                    <el-form-item
                      label="依据或建议"
                      :prop="'details.' + index + '.basisSuggestion'"
                      :rules="[{ required: true, message: '必选', trigger: 'blur' }]"
                    >
                      <el-input v-model="item.basisSuggestion" type="textarea" :rows="2" />
                    </el-form-item>
                  </div>
                </div>
                <div class="item-one">
                  <h4>隐患整改</h4>
                  <div class="form-label">
                    <el-form-item label="整改人" prop="rectificationPerson">
                      <el-input v-model="item.rectificationPerson" />
                    </el-form-item>
                    <el-form-item label="整改措施" prop="rectificationMeasures">
                      <el-input v-model="item.rectificationMeasures" />
                    </el-form-item>
                    <el-form-item style="width: 100%" label="整改后照片" prop="afterRectificationFileIds">
                      <Upload
                        v-model="item.afterRectificationFileIds"
                        btnText="上传照片"
                        accept="jpg,png"
                        isOnlyButton
                      />
                    </el-form-item>
                  </div>
                </div>
                <div class="item-one">
                  <h4>整改验收</h4>
                  <div class="form-label">
                    <el-form-item label="是否合格" prop="qualifiedStatus">
                      <el-radio v-model="item.qualifiedStatus" :label="1">合格</el-radio>
                      <el-radio v-model="item.qualifiedStatus" :label="0">不合格</el-radio>
                    </el-form-item>
                    <el-form-item label="验收时间" prop="acceptanceTime">
                      <el-date-picker
                        v-model="item.acceptanceTime"
                        type="date"
                        value-format="yyyy-MM-dd 00:00:00"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
          </el-form>
        </el-col>
      </el-row>
    </component>
    <div v-if="!inDialog" class="footer-btn">
      <el-button size="lg" @click="goBack()">取消</el-button>
      <el-button size="lg" type="primary" :loading="btnSaveLoading" @click="submit(null)">保存</el-button>
    </div>
  </div>
</template>

<script>
import Api from '../api'
export default {
  name: 'PerilEdit',
  components: {
    // SelectLabourWorker
  },
  data() {
    return {
      id: null,
      form: {
        checkDate: moment(new Date()).format('YYYY-MM-DD'),
        buildCompany: '深圳特区建设发展集团有限公司',
        constructionCompany: '中交天津航道局有限公司',
        supervisionCompany: '广州华申监理有限公司',
        details: [
          {
            locationActivity: '',
            hiddenDangerProblemDescribe: '',
            hiddenDangerFileIds: '',
            basisSuggestion: '',
            rectificationPerson: '',
            rectificationMeasures: '',
            afterRectificationFileIds: '',
            qualifiedStatus: '',
            acceptanceTime: ''
          }
        ] //安全隐患
      },
      formInfo: {},
      inDialog: false,

      rules: {
        checkDate: [{ required: true, message: '必选' }],
        checkGroupLeader: [{ required: true, message: '必填' }],
        checkGroupMembers: [{ required: true, message: '必填' }],
        buildCompany: [{ required: true, message: '必填' }],
        constructionCompany: [{ required: true, message: '必填' }],
        supervisionCompany: [{ required: true, message: '必填' }]
      },
      rulesInfo: {
        safetyHiddenDangerType: [{ required: true, message: '必填' }],
        locationActivity: [{ required: true, message: '必填' }],
        hiddenDangerProblemDescribe: [{ required: true, message: '必填' }],
        hiddenDangerFileIds: [{ required: true, message: '必选' }],
        basisSuggestion: [{ required: true, message: '必填' }]
      },
      btnSaveLoading: false
    }
  },
  computed: {},
  created() {},
  beforeCreate() {
    let query = this.$route.query
    if (!+this.$route.query.showAdd && !!+this.$route.query.isDetail) {
      this.$router.replace({
        name: 'PerilDetail',
        query: { id: query.targetId, isCheck: query.isCheck }
      })
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.id = this.$route.query.id
    console.log(this.id)
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    // 保存
    async submit() {
      await this.$refs.form.validate()
      if (this.form.details.length <= 0) {
        return this.$message.info('至少添加一个隐患问题')
      }
      const form = _.cloneDeep(this.form)
      form.checkDate = moment(form.checkDate).format('YYYY-MM-DD HH:ss:mm')
      this.btnSaveLoading = true
      this.id ? await Api.getsafetyHiddenUpdate(form) : await Api.getsafetyHiddenSave(form)
      this.btnSaveLoading = false
      this.$message.success('操作成功')
      this.goBack()
    },
    handleAddItem() {
      this.form.details.push({
        locationActivity: '',
        hiddenDangerProblemDescribe: '',
        hiddenDangerFileIds: '',
        basisSuggestion: '',
        rectificationPerson: '',
        rectificationMeasures: '',
        afterRectificationFileIds: '',
        qualifiedStatus: '',
        acceptanceTime: ''
      })
    },
    //详情
    getDetail() {
      Api.getsafetyHiddenDetail(this.id).then(res => {
        this.form = { ...res.data }
      })
    },
    // 移除
    handelDelete(index) {
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
  .item-body {
    display: flex;
    justify-content: space-between;
    // align-items: center;
    // display: inline-block;
    width: 100%;
    background-color: rgba(242, 242, 242, 1);
    .item-one {
      background: #fff;
      width: 33%;
      h4 {
        text-align: center;
        padding: 10px 0;
        border-bottom: 1px solid #ccc;
      }
      .form-label {
        margin-left: 2px;
        padding: 10px;
        /deep/.el-form-item__label {
          text-align: left;
          width: 100px !important;
        }
        /deep/.el-form-item__content {
          margin-left: 100px !important;
        }
      }
    }
    .item-two {
    }
  }
}
</style>
