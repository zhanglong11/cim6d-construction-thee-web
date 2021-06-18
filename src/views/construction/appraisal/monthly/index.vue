<template>
  <div class="container">
    <!-- 工具栏开始 -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="filterForm.userName"
            style="width: 300px"
            placeholder="人员名称"
            suffix-icon="el-icon-search"
            @keyup.enter.native="refresh"
          />
        </el-form-item>
        <el-form-item label="考勤时间">
          <el-date-picker
            v-model="filterForm.queryTime"
            type="month"
            :picker-options="pickerOptionsYearMonth"
            value-format="yyyy-MM"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button v-if="$hasPower('GetByExport')" type="primary" @click="getByExport()">导出报表</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
          <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="管理人员" name="1" />
      <el-tab-pane label="劳务人员" name="2" />
    </el-tabs>
    <div v-if="activeName === '1'">
      <Grid v-if="activeName === '1'" key="1" ref="table" :request="request" :filter-form.sync="filterForm">
        <vxe-table-column type="seq" title="序号" width="60" />
        <vxe-table-column field="userName" title="姓名" minWidth="200"> </vxe-table-column>
        <vxe-table-column field="department" title="部门" width="200" />
        <vxe-table-column field="role" title="角色" width="200" />
        <vxe-table-column field="attendanceDays" title="出勤天数" width="200" />
        <vxe-table-column field="normalDays" title="正常天数" width="200" />
        <vxe-table-column field="allDayCardMissingDays" title="全天缺卡天数" width="200" />
        <vxe-table-column field="lateCardMissingDays" title="迟到缺卡天数" width="200" />
        <vxe-table-column field="lateDays" title="上班迟到天数" width="200" />
        <vxe-table-column field="lateLeaveEarlyDays" title="迟到早退天数" width="200" />
        <vxe-table-column field="leaveEarlyAfterWorkDays" title="下班早退天数" width="200" />
        <vxe-table-column field="cardMissingAfterWorkDays" title="下班缺卡天数" width="200" />
        <vxe-table-column title="考勤详情" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="text" @click="toDetails(row)">查看详情</el-button>
          </template>
        </vxe-table-column>
      </Grid>
    </div>
    <div v-if="activeName === '2'">
      <Grid v-if="activeName === '2'" key="2" ref="table" :request="request" :filter-form.sync="filterForm">
        <vxe-table-column type="seq" title="序号" width="60" />
        <vxe-table-column field="userName" title="姓名" minWidth="200"> </vxe-table-column>
        <vxe-table-column field="workType" title="工种" width="200" />
        <vxe-table-column field="groupName" title="班组" width="200" />
        <vxe-table-column field="labourCompanyName" title="劳务公司" width="200" />
        <vxe-table-column field="attendanceDays" title="出勤天数" width="200" />
        <vxe-table-column field="normalDays" title="正常天数" width="200" />

        <vxe-table-column field="allDayCardMissingDays" title="全天缺卡天数" width="200" />
        <vxe-table-column field="lateCardMissingDays" title="迟到缺卡天数" width="200" />
        <vxe-table-column field="lateDays" title="上班迟到天数" width="200" />
        <vxe-table-column field="lateLeaveEarlyDays" title="迟到早退天数" width="200" />
        <vxe-table-column field="leaveEarlyAfterWorkDays" title="下班早退天数" width="200" />
        <vxe-table-column field="cardMissingAfterWorkDays" title="下班缺卡天数" width="200" />
        <vxe-table-column title="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="text" @click="toDetails(row)">查看详情</el-button>
          </template>
        </vxe-table-column>
      </Grid>
    </div>
    <!-- 查看模态框 -->
    <MyDetail
      :type="type"
      :dateListNames="dateListNames"
      :queryTimes="queryTimes"
      :mobileUid="mobileUid"
      :visible.sync="viewDialogVisible"
    ></MyDetail>
  </div>
</template>

<script>
import Api from '../api'
import MyDetail from './Detail'
export default {
  name: 'MonthlyManage',
  components: { MyDetail },
  data() {
    return {
      filterForm: {
        userName: '',
        attendanceGroupType: '1',
        queryTime: moment(new Date()).format('YYYY-MM')
      },
      activeName: '1',
      request(body) {
        return Api.getAttendanceClockInbyMonth(body)
      },
      dateList: [],
      viewDialogVisible: false,
      queryTime: moment(new Date()).format('YYYY-MM'),
      fileName: '月度汇总表.xls',
      pickerOptionsYearMonth: this.banTime(),
      type: '',
      dateListNames: '',
      queryTimes: '',
      mobileUid: ''
    }
  },
  watch: {
    activeName(e) {
      this.reset()
      this.filterForm.attendanceGroupType = e
      this.request = body => Api.getAttendanceClockInbyMonth(body)
      this.$nextTick(() => {
        this.refresh()
      })
    },
    'filterForm.queryTime'(e) {
      return e === null ? (this.filterForm.queryTime = moment(new Date()).format('YYYY-MM')) : e
    }
  },
  mounted() {},
  methods: {
    banTime() {
      return {
        disabledDate(time) {
          const date = new Date()
          const year = date.getFullYear()
          let month = date.getMonth() + 1
          if (month >= 1 && month <= 9) {
            month = '0' + month
          }
          const currentdate = year.toString() + month.toString()
          const timeyear = time.getFullYear()
          let timemonth = time.getMonth() + 1
          if (timemonth >= 1 && timemonth <= 9) {
            timemonth = '0' + timemonth
          }
          const timedate = timeyear.toString() + timemonth.toString()
          return currentdate < timedate
        }
      }
    },
    async getByExport() {
      let res = await Api.getbyMonthExport({
        attendanceGroupType: this.filterForm.attendanceGroupType || '',
        queryTime: this.filterForm.queryTime === undefined ? this.queryTime : this.filterForm.queryTime,
        userName: this.filterForm.userName || ''
      })
      saveAs(res.data, this.fileName ? this.fileName : 'download.xls')
    },
    //刷新数据
    refresh() {
      if (!this.filterForm.queryTime) return this.$message.info('考勤时间不能为空')
      this.$refs.table.refresh()
    },
    //重置搜索
    reset() {
      this.$refs.table.reset()
    },
    // 跳转消息详情
    toDetails(row) {
      console.log(row)
      this.type = this.filterForm.attendanceGroupType
      this.mobileUid = row.mobile
      this.dateListNames = row.userName
      this.queryTimes = this.filterForm.queryTime
      this.viewDialogVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-input__icon {
  display: none !important;
}
</style>
