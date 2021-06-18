<template>
  <div>
    <div class="tooltips">
      <div>
        <el-form ref="queryForm" :model="queryForm" inline>
          <el-form-item label="考勤检索">
            <el-date-picker
              v-model="queryForm.salaryMonth"
              type="month"
              format="yyyy年MM月"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择年月"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="check-content">
      <div class="check-hdc">
        <h3>{{ monthsDay }}</h3>
        <div class="check-day">
          <span>打卡天数</span>
          <span class="sp-day">{{ cardDays }}天</span>
        </div>
      </div>
      <div class="check-body">
        <div class="body-left">
          <div class="left-hdc">
            <el-row :gutter="4">
              <el-col :span="24" style="text-align: center">
                <div class="avatar-wrap">
                  <el-avatar :key="queryForm.headImage" :size="85" :src="queryForm.headImage" />
                  <!-- <i id="pick-avatar" class="el-icon-edit-outline" /> -->
                </div>
              </el-col>
              <el-col :span="12">
                <span class="desc-label">姓名:</span>
                <span>{{ queryForm.name }}</span>
              </el-col>
              <el-col :span="12">
                <span class="desc-label">卡号:</span>
                <span>{{ queryForm.cardNumber }}</span>
              </el-col>
              <el-col :span="12">
                <span class="desc-label">身份证号:</span>
                <span>{{ queryForm.idCardNum }}</span>
              </el-col>
              <el-col :span="12">
                <span class="desc-label">手机号码:</span>
                <span>{{ queryForm.mobile }}</span>
              </el-col>
              <el-col :span="12">
                <span class="desc-label">在职状态:</span>
                <span>{{ ['在职', '离职'][queryForm.jobStatus - 1] }}</span>
              </el-col>
              <el-col :span="12">
                <span class="desc-label">工种:</span>
                <span>{{ $getLabelFromArg('workType', queryForm.workType) }}</span>
              </el-col>
              <el-col :span="12">
                <span class="desc-label">所属劳务公司及班组:</span>
                <span>{{ queryForm.labourCompanyName + '-' + queryForm.groupName }}</span>
              </el-col>
              <el-col :span="12">
                <span class="desc-label">用工性质:</span>
                <span>{{ $getLabelFromArg('workerProperty', queryForm.staffKind) }}</span>
              </el-col>
            </el-row>
          </div>
          <div class="left-detail">
            <h3 style="font-weight: 600">考勤详情</h3>
            <div class="calendar-tap">
              <span>打卡</span>
              <span class="sp-red">未打卡</span>
            </div>
            <el-calendar id="calendar" v-model="valueDate">
              <template slot="dateCell" slot-scope="{ data }">
                <div style="position: relative">
                  <div
                    v-if="data.type === 'current-month' && moment(data.day).isBefore(moment())"
                    :class="dates.includes(data.day) ? 'li-00' : 'li-01'"
                  >
                    {{ data.day.split('-').slice(2)[0] }}
                  </div>
                  <div v-else>{{ data.day.split('-').slice(2)[0] }}</div>
                </div>
              </template>
            </el-calendar>
          </div>
        </div>
        <div class="body-right">
          <el-table
            v-loading="loading"
            :data="tableData"
            border
            :header-cell-style="{ textAlign: 'center', background: '#fff' }"
            :cell-style="{ 'text-align': 'center' }"
            style="width: 100%"
          >
            <el-table-column prop="seq" label="序号" width="180" type="index"></el-table-column>
            <el-table-column prop="punchCardDate" label="打卡日期"></el-table-column>
            <el-table-column prop="week" label="星期"></el-table-column>
            <el-table-column prop="punchCardFirstTime" label="首次打卡时间"></el-table-column>
            <el-table-column prop="punchCardEndTime" label="末次打卡时间"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="foot" style="border: 1px solid #ccc; padding: 10px; margin-top: 10px; overflow: hidden">
      <div>
        <el-button @click="$router.back()">取消</el-button>
        <el-button v-if="$hasPower('LabourPeopleListCheck')" type="primary" @click="getDown()"
          >下载考勤统计表</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import AvatarCropper from 'vue-avatar-cropper'
import Api from '../../api/labour-api'
import { data } from 'vue-echarts'
export default {
  name: 'MyCheck',
  data() {
    return {
      id: '',
      loading: false,
      tableData: [], //考勤
      punchCardDates: [],
      detailList: [], //工资明细月份
      monthsDay: '', //当月工资月份
      cardDays: '',
      queryForm: {
        projectId: localStorage.getItem('projectId'),
        id: this.$route.query.id,
        salaryMonth: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      },
      total: 0,
      caleDates: [], //打卡日期
      dates: [],
      valueDate: '',
      fileName: '考勤详情统计表.xls'
    }
  },
  watch: {
    'queryForm.salaryMonth'() {
      this.monthsDay = moment(this.queryForm.salaryMonth).format('YYYY年MM月份')
    }
  },
  mounted() {},
  created() {
    this.id = this.$route.query.id
    this.monthsDay = moment(new Date()).format('YYYY年MM月份')
    this.getRefresh()
  },
  methods: {
    //查询列表数据
    async getRefresh() {
      if (this.id) {
        this.valueDate = this.queryForm.salaryMonth
        this.loading = true
        Api.getLabourAttence({
          ...this.queryForm,
          date: this.queryForm.salaryMonth
        })
          .then(res => {
            this.queryForm = { ...res.data, ...this.queryForm }
            this.tableData = res.data.attendanceList || []
            this.cardDays = this.tableData.length || 0
            this.dates = this.tableData.map(item => {
              return moment(item.date).format('YYYY-MM-DD')
            })
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    //搜索按钮
    search() {
      this.getRefresh()
    },
    //下载
    async getDown() {
      if (this.id === '') return
      let res = await Api.getLabourExport({
        projectId: localStorage.getItem('projectId'),
        id: this.$route.query.id,
        date: this.queryForm.salaryMonth
      })
      saveAs(res.data, this.fileName ? '' + this.monthsDay + '' + this.fileName : 'download.xls')
    },
    //t表格显示
    reset() {
      this.queryForm.salaryMonth = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      this.getRefresh()
    }
  }
}
</script>
<style scoped lang="less">
/deep/.el-table {
  height: 730px;
  overflow: auto;
}
/deep/.el-calendar__header {
  display: none !important;
}
/deep/.li-00 {
  background: green !important;
  color: #000;
  width: 100%;
  position: absolute;
  top: -8px;
  left: 0;
  background-color: green !important;
  padding: 8px 5px;
}
/deep/.li-01 {
  background: red !important;
  color: #000;
  width: 100%;
  position: absolute;
  top: -8px;
  left: 0;
  background-color: red !important;
  padding: 8px 5px;
}
/deep/.el-calendar-table .el-calendar-day {
  padding: 0;
}
/deep/.el-calendar-table .el-calendar-day {
  height: 41px;
  padding-top: 8px;
  text-align: center;
}
.tooltips {
  border-bottom: 3px solid #ccc;
}
.check-content {
  overflow: hidden;
  padding-top: 18px;
  .check-hdc {
    border-bottom: 1px solid #999;
    padding-bottom: 15px;
    h3 {
      display: inline-block;
      font-size: 18px;
      font-weight: bold;
    }
    .s-p {
      margin-left: 15px;
      color: red;
    }
    .check-day {
      display: inline-block;
      margin-left: 30px;
      text-align: center;
      span {
        display: inline-block;
        width: 100px;
        border: 1px solid #000;
        padding: 2px 5px;
      }
      .sp-day {
        border-left: 0;
      }
    }
  }
}
.check-body {
  overflow: hidden;
  padding-top: 10px;
  .body-left {
    float: left;
    width: 30%;
    margin-right: 20px;
    .left-hdc {
      padding: 10px 20px;
      border: 1px solid #ccc;
      .el-col {
        margin-bottom: 25px;
        font-size: 16px;
      }
    }
    .left-detail {
      margin-top: 20px;
      .calendar-tap {
        margin-top: 20px;
        padding-left: 60px;
        span {
          display: inline-block;
          vertical-align: middle;
          position: relative;
          margin-right: 60px;
        }
        span::before {
          content: '';
          position: absolute;
          left: -30px;
          top: 50%;
          height: 15px;
          width: 25px;
          background-color: green;
          margin-top: -10px;
          margin-right: 20px;
        }
        .sp-red::before {
          content: '';
          position: absolute;
          left: -30px;
          top: 50%;
          height: 15px;
          width: 25px;
          background-color: red;
          margin-top: -10px;
          margin-right: 20px;
        }
      }
    }
  }
  .body-right {
    overflow: hidden;
  }
}
/deep/.el-input__suffix-inner .el-input__icon {
  display: none;
}
</style>
