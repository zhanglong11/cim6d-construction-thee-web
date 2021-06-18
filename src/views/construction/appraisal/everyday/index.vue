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
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-form-item>
            <el-button v-if="$hasPower('GetByMoExport')" type="primary" @click="getByExport">导出报表</el-button>
          </el-form-item>
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
        <vxe-table-column field="clockInTime" title="日期" width="200" />
        <vxe-table-column field="workClockInTime" title="上班打卡时间" width="200" />
        <vxe-table-column field="workClockInStatus" title="上班打卡结果" width="200">
          <template #default="{ row }">
            <span :class="{ colordesc: row.workClockInStatus === 2 }">
              {{ row.workClockInStatus ? (row.workClockInStatus === 1 ? '正常' : '迟到') : '' }}
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="offDutyClockInTime" title="下班打卡时间" width="200" />
        <vxe-table-column field="offDutyClockInStatus" title="下班打卡结果" width="200">
          <template #default="{ row }">
            <span :class="`color-type-${row.offDutyClockInStatus}`">
              {{ $getLabel(status, row.offDutyClockInStatus) }}
            </span>
          </template>
        </vxe-table-column>
      </Grid>
    </div>
    <div v-if="activeName === '2'">
      <Grid v-if="activeName === '2'" key="2" ref="table" :request="request" :filter-form.sync="filterForm">
        <vxe-table-column type="seq" title="序号" width="60" />
        <vxe-table-column field="userName" title="姓名" minWidth="200" />
        <vxe-table-column field="workType" title="工种" width="200" />
        <vxe-table-column field="groupName" title="班组" width="200" />
        <vxe-table-column field="labourCompanyName" title="劳务公司" width="200" />
        <vxe-table-column field="clockInTime" title="日期" width="200" />

        <vxe-table-column field="workClockInTime" title="上班打卡时间" width="200" />
        <vxe-table-column field="workClockInStatus" title="上班打卡结果" width="200">
          <template #default="{ row }">
            <span :class="{ colordesc: row.workClockInStatus === 2 }">
              {{ row.workClockInStatus ? (row.workClockInStatus === 1 ? '正常' : '迟到') : '' }}
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="offDutyClockInTime" title="下班打卡时间" width="200" />
        <vxe-table-column field="offDutyClockInStatus" title="下班打卡结果" width="200">
          <template #default="{ row }">
            <span :class="`color-type-${row.offDutyClockInStatus}`">
              {{ $getLabel(status, row.offDutyClockInStatus) }}
            </span>
          </template>
        </vxe-table-column>
      </Grid>
    </div>
  </div>
</template>

<script>
import Api from '../api'
import status from '../lib/status.js'
export default {
  name: 'EveryManage',
  components: {},
  data() {
    return {
      status,
      filterForm: {
        userName: '',
        attendanceGroupType: 1,
        queryTime: moment(new Date()).format('YYYY-MM-DD')
      },

      request(body) {
        return Api.getAttendanceClockInbyDay(body)
      },
      activeId: null,
      fileName: '每日统计表.xls',
      queryTime: moment(new Date()).format('YYYY-MM-DD'),
      activeName: '1'
    }
  },
  watch: {
    activeName(e) {
      this.reset()
      this.filterForm.attendanceGroupType = e
      this.request = body => Api.getAttendanceClockInbyDay(body)
      this.$nextTick(() => {
        this.refresh()
      })
    },
    'filterForm.queryTime'(e) {
      return e === null ? (this.filterForm.queryTime = moment(new Date()).format('YYYY-MM-DD')) : e
    }
  },
  mounted() {},
  methods: {
    async getByExport() {
      let res = await Api.getbybyDayExport({
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
      //默认时间
    },
    //重置搜索
    reset() {
      this.$refs.table.reset()
    },

    // 跳转消息详情
    toDetails(item) {}
  }
}
</script>
<style lang="less" scoped>
.colordesc {
  color: red;
}
.color-type-1 {
}
.color-type-2 {
  color: red;
}
.color-type-3 {
  color: #fb7f62;
}
/deep/.el-input__icon {
  display: none !important;
}
</style>
