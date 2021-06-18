<template>
  <div class="container no-padding" :class="{ inDialog, isFooter: !inDialog }">
    <component :is="inDialog ? 'div' : 'el-card'" class="box-card">
      <el-row :gutter="15">
        <el-col :span="inDialog ? 40 : 18">
          <el-form ref="form" :model="form" :rules="rules" label-width="160px" class="form-con">
            <el-row>
              <el-col :span="inDialog ? 22 : 10">
                <el-form-item label="工程名称" prop="engineeringName">
                  <el-input v-model="form.engineeringName" type="textarea" :rows="3" />
                </el-form-item>
                <el-form-item label="检查区域" prop="checkArea">
                  <el-input v-model="form.checkArea" />
                </el-form-item>
                <el-form-item label="整改单位" prop="rectificationReplyCompany">
                  <el-input v-model="form.rectificationReplyCompany" type="textarea" :rows="2" />
                </el-form-item>
                <el-form-item label="整改期限" prop="rectificationTerm">
                  <el-input v-model="form.rectificationTerm" />
                </el-form-item>
                <el-form-item label="整改通知书编号" prop="rectificationNoticeNo">
                  <el-input v-model="form.rectificationNoticeNo" />
                </el-form-item>
                <el-form-item label="需整改内容" prop="rectificationContent">
                  <el-input v-model="form.rectificationContent" type="textarea" :rows="3" />
                </el-form-item>
                <el-form-item label="覆盖周期" prop="cycleStartDate">
                  <!-- <DateRange :startTime.sync="form.cycleStartDate" :endTime.sync="form.cycleEndDate"></DateRange> -->
                  <el-date-picker
                    v-model="reportDate"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="请选择"
                    end-placeholder="请选择"
                    style="width: 390px"
                    @input="getReportDate"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <p class="p-title">周期内的安全隐患记录</p>
              </el-col>
              <el-col>
                <el-table :data="hiddenDangerDetails" style="width: 100%" border="">
                  <el-table-column type="index" label="序号" align="center"></el-table-column>
                  <el-table-column label="隐患排查" align="center">
                    <el-table-column prop="checkDate" label="隐患发现时间"> </el-table-column>
                    <el-table-column prop="locationActivity" label="位置/活动"> </el-table-column>
                    <el-table-column prop="hiddenDangerProblemDescribe" label="存在隐患或问题" width="300">
                    </el-table-column>
                    <el-table-column prop="hiddenDangerFileIds" label="隐患照片" width="200px">
                      <template #default="{ row }">
                        <ImgList :ids="row.hiddenDangerFileIds" />
                      </template>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="隐患整改" align="center">
                    <el-table-column prop="rectificationPerson" label="整改人"> </el-table-column>
                    <el-table-column prop="rectificationMeasures" label="整改措施"> </el-table-column>
                    <el-table-column prop="afterRectificationFileIds" label="整改后照片" width="200">
                      <template #default="{ row }">
                        <ImgList :ids="row.afterRectificationFileIds ? row.afterRectificationFileIds : ''" />
                      </template>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="整改验收" align="center">
                    <el-table-column prop="qualifiedStatus" label="是否合格">
                      <template #default="{ row }">
                        {{ $getLabel(quaStatus, row.qualifiedStatus) }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="acceptanceTime" label="验收时间">
                      <template #default="{ row }">
                        {{ row.acceptanceTime ? moment(row.acceptanceTime).format('YYYY-MM-DD') : '' }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="r" label="验收人（笔签）"> </el-table-column>
                  </el-table-column>
                  <el-table-column label="操作" width="60" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="mini" class="details-btn" @click.stop="showDelete(scope)"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </component>
    <div v-if="!inDialog" class="footer-btn">
      <el-button size="lg" @click="goBack()">取消</el-button>
      <el-button size="lg" type="primary" :loading="btnSaveLoadingSave" @click="saveCaoGao()">保存</el-button>
      <el-button size="lg" type="primary" :loading="btnSaveLoading" @click="goSubmit()">提交</el-button>
    </div>
  </div>
</template>

<script>
import api from '../api'
import { quaStatus } from '../lib/safetyStauas'
import { getDateWeek } from '@/utils'
// import ImagePreview from '@/components/ImagePreview'
import ImgList from '../components/imgList' //附件
export default {
  name: 'ReplyEdit',
  components: {
    // ImagePreview
    ImgList
  },
  data() {
    return {
      id: null,
      quaStatus,
      form: {
        engineeringName: '深圳市海洋新兴产业基地陆域形成工程2a标段施工',
        checkArea: '施工现场',
        rectificationReplyCompany: '中交天津航道局有限公司',
        cycleEndDate: '',
        cycleStartDate: '',
        hiddenDangerCheckRecordDetailIds: '' //隐患集合
      },
      inDialog: false,
      rules: {
        engineeringName: [{ required: true, message: '必填' }],
        checkArea: [{ required: true, message: '必填' }],
        rectificationReplyCompany: [{ required: true, message: '必填' }],
        rectificationTerm: [{ required: true, message: '必填' }],
        rectificationNoticeNo: [{ required: true, message: '必填' }],
        rectificationContent: [{ required: true, message: '必填' }],
        cycleStartDate: [{ required: true, message: '必填' }],
        hiddenDangerDetails: [{ required: true }]
      },
      btnSaveLoading: false,
      btnSaveLoadingSave: false,
      reportDate: [
        getDateWeek(moment(new Date()).format('YYYY-MM-DD')).first,
        getDateWeek(moment(new Date()).format('YYYY-MM-DD')).last
      ],
      status: '',
      hiddenDangerDetails: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  beforeCreate() {
    let query = this.$route.query
    if (!+this.$route.query.showAdd && !!+this.$route.query.isDetail) {
      this.$router.replace({
        name: 'ReplyDetail',
        query: { id: query.targetId, isCheck: query.isCheck }
      })
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.form.cycleStartDate = this.reportDate[0]
    this.form.cycleEndDate = this.reportDate[1]
    this.id = this.$route.query.id
    this.status = this.$route.query.status
    this.id ? '' : this.getsafetyHiddenTimeAnds()
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    //草稿状态
    async saveCaoGao() {
      await this.$refs.form.validate()
      const form = _.cloneDeep(this.form)
      form.hiddenDangerCheckRecordDetailIds = this.hiddenDangerDetails.map(item => item.id).join(',')
      form.cycleEndDate = moment(form.cycleEndDate).format('YYYY-MM-DD HH:ss:mm')
      form.cycleStartDate = moment(form.cycleStartDate).format('YYYY-MM-DD HH:ss:mm')
      this.btnSaveLoadingSave = true
      this.id && this.status !== 3 ? await api.getReplyUpdate(form) : await api.getReplySave(form)
      this.btnSaveLoadingSave = false
      this.$message.success('操作成功')
      this.goBack()
    },
    //提交
    async goSubmit() {
      await this.$refs.form.validate()
      const form = _.cloneDeep(this.form)
      form.hiddenDangerCheckRecordDetailIds = this.hiddenDangerDetails.map(item => item.id).join(',')
      form.cycleEndDate = moment(form.cycleEndDate).format('YYYY-MM-DD HH:ss:mm')
      form.cycleStartDate = moment(form.cycleStartDate).format('YYYY-MM-DD HH:ss:mm')
      this.btnSaveLoading = true
      this.id && this.status !== 3 ? await api.getReplyUpdateAndSubmit(form) : await api.getReplySubmit(form)
      this.btnSaveLoading = false
      this.$message.success('操作成功')
      this.goBack()
    },
    //安全隐患记录
    getsafetyHiddenTimeAnds() {
      let data = {
        cycleStartDate: moment(this.form.cycleStartDate).format('YYYY-MM-DD HH:ss:mm') || '',
        cycleEndDate: moment(this.form.cycleEndDate).format('YYYY-MM-DD HH:ss:mm') || ''
      }
      api.getsafetyHiddenTimeAnd(data).then(res => {
        this.hiddenDangerDetails = res.data || []
      })
    },
    //获取时间
    getReportDate(e) {
      this.form.cycleStartDate = e[0]
      this.form.cycleEndDate = e[1]
      if (this.form.cycleStartDate && this.form.cycleEndDate) {
        this.getsafetyHiddenTimeAnds()
      }
    },
    getWeekDay(date) {
      let dt = new Date(date.split('-')[0], date.split('-')[1] - 1, (date = date.split('-')[2]))
      let weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      return weekDay[dt.getDay()]
    },
    // 隐患删除
    showDelete(scope) {
      //  this.form.currentList.splice(scope.$index, 1)
      this.hiddenDangerDetails.splice(scope.$index, 1)
    },
    //详情
    getDetail() {
      api.getReplyDetail(this.id).then(res => {
        this.form = { ...res.data }
        let { cycleEndDate, cycleStartDate } = this.form
        this.reportDate = [cycleStartDate, cycleEndDate]
        this.hiddenDangerDetails = this.form.hiddenDangerDetails
      })
    },
    // 返回
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-table .cell {
  max-height: 200px;
  overflow: auto;
}
.p-title {
  margin-bottom: 20px;
  padding-left: 10px;
}
.p-title:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
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
}
</style>
