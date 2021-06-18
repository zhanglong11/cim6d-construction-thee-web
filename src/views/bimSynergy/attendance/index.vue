<template>
  <div class="wrap">
    <div class="left">
      <div class="group-total">
        <BlockCard title="管理部门出勤统计">
          <template #content>
            <div class="group-chart">
              <BarChart id="group-chart" :chart-data="chartData" />
              <div class="total">
                <p>
                  <span class="num">{{ chartTotal }}</span
                  ><span> 人</span>
                </p>
                <p>应到人数</p>
              </div>
            </div>
          </template>
        </BlockCard>
      </div>
      <div class="err-total">
        <BlockCard title="打卡异常信息统计">
          <template #content>
            <div class="header">
              <span :class="{ active: errType === 1 }" @click="changeErrType(1)">日</span>
              <span :class="{ active: errType === 2 }" @click="changeErrType(2)">月</span>
            </div>
            <div class="select">
              <el-select
                v-model="errStatus"
                class="err"
                popper-class="err"
                :popper-append-to-body="false"
                placeholder="请选择分类"
                style="width: 98%"
                @change="changeErrStatus"
              >
                <el-option v-for="item in errStatusList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
            <ul v-if="errList && errList.length" class="err-list">
              <li v-for="(item, i) in errList" :key="i">
                <span class="top-back"></span>
                <div>
                  <div class="detail">
                    <div class="icon"></div>
                    <div class="person-info">
                      <p>
                        <span class="label">姓名</span>
                        <span class="value">{{ item.name }}</span>
                      </p>
                      <p>
                        <span class="label">部门</span>
                        <span class="value">{{ item.deptName }}</span>
                      </p>
                    </div>
                  </div>
                  <div class="person-status">
                    <span class="status" :class="`color${item.allStatus}`" />
                    <span>{{ item.count }}</span>
                  </div>
                </div>
                <span class="bottom-back"></span>
              </li>
            </ul>
            <div v-else class="err-list"><NoData /></div>
          </template>
        </BlockCard>
      </div>
    </div>
    <div class="center">
      <div class="info-table">
        <BlockCard title="打卡信息统计">
          <template #content>
            <div class="table-wrap">
              <el-table ref="table" class="table" height="99%" stripe :data="tableData">
                <el-table-column prop="name" label="姓名" align="center" />
                <el-table-column prop="departmentNames" label="部门" align="center" show-overflow-tooltip />
                <el-table-column prop="firstCheckTime" label="首次打卡时间" align="center" show-overflow-tooltip />
                <el-table-column prop="lastCheckTime" label="最后打卡时间" align="center" show-overflow-tooltip />
                <el-table-column prop="status" label="考勤状态" align="center" show-overflow-tooltip>
                  <template slot-scope="{ row }">
                    <span class="table-status" :class="{ normal: row.status === 1 }">{{
                      row.status === 1 ? '正常' : '异常'
                    }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </BlockCard>
      </div>
      <div class="group-bar">
        <BlockCard title="管理部门出勤率统计">
          <template #content>
            <div class="tab">
              <span :class="{ active: zhuType === 1 }" @click="changeZhuType(1)">日</span>
              <span :class="{ active: zhuType === 2 }" @click="changeZhuType(2)">月</span>
            </div>
            <div class="bar-container">
              <ZhuChart :chart-data="zhuChart" />
            </div>
          </template>
        </BlockCard>
      </div>
    </div>
    <div class="right">
      <div class="group-total">
        <BlockCard title="劳务人员出勤统计">
          <template #content>
            <div class="group-chart">
              <BarChart id="group-list" :chart-data="laborChartData" />
              <div class="total">
                <p>
                  <span class="num">{{ laborTotal }}</span
                  ><span> 人</span>
                </p>
                <p>应到人数</p>
              </div>
            </div>
          </template>
        </BlockCard>
      </div>
      <div class="bottom">
        <BlockCard title="管理部门出勤信息统计">
          <template #content>
            <ul v-if="groupList && groupList.length" class="bottom-list">
              <li v-for="(item, i) in groupList" :key="i">
                <h4>{{item.departmentName}}</h4>
                <section>
                  <div>
                    <div class="back total" />
                    <div>
                      <span>应到</span>
                      <p class="content">
                        <span class="num">{{ item.total }}</span>
                        <span class="unit">人</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <div class="back actual">
                      <svg xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="linear">
                            <stop offset="0%" style="stop-color: #FDD06C" />
                            <stop offset="100%" style="stop-color: #F2A462"/>
                          </lineargradient>
                        </defs>
                        <circle cx="30" cy="30" r="23" stroke="#1E3544" stroke-width="7" fill="none" />
                        <circle
                          cx="30"
                          cy="30"
                          r="23"
                          :stroke="'url(#linear)'"
                          stroke-width="5"
                          fill="none"
                          stroke-dasharray="8,2"
                        />
                        <circle
                          cx="30"
                          cy="30"
                          r="23"
                          stroke="#1E3544"
                          stroke-width="7"
                          transform="rotate(-86 30 30)"
                          :stroke-dasharray="progressStroke(item.progress)"
                          fill="none"
                        />
                      </svg>
                    </div>
                    <div>
                      <span>实到</span>
                      <p class="content">
                        <span class="num">{{ item.actualNumber }}</span>
                        <span class="unit">人</span>
                      </p>
                    </div>
                  </div>
                </section>
              </li>
            </ul>
            <div class="bottom-list">
              <NoData />
            </div>
          </template>
        </BlockCard>
      </div>
    </div>
  </div>
</template>

<script>
import Api from './api'
import BlockCard from '../componments/BlockCard'
import BarChart from './components/barChart'
import ZhuChart from './components/zhuChart'
import NoData from './components/noData'
export default {
  name: 'AttendanceClock',
  // import引入的组件
  components: { BlockCard, BarChart, ZhuChart, NoData },
  props: {},
  data() {
    // 这里存放数据
    return {
      chartTotal: 0,
      chartData: {
        xData: [],
        data: []
      },
      laborTotal: 0,
      laborChartData: {
        xData: [],
        data: []
      },
      zhuChart: {
        xData: [],
        data: []
      },
      tableData: [],
      progress: '100,1000',
      groupList: [],
      errList: [],
      zhuType: 1,
      errType: 1,
      errStatus: 2,
      errStatusList: [
        { label: '下班缺卡', value: 2 },
        { label: '下班早退 ', value: 3 },
        { label: '上班迟到', value: 4 },
        { label: '迟到早退', value: 5 },
        { label: '迟到缺卡', value: 6 },
        { label: '全天缺卡', value: 7 }
      ]
    }
  },
  // 生命周期 - 挂载完成
  created() {
    this.refresh()
  },
  mounted() {
    this.formatBim()
  },
  beforeDestroy() {
    this.formatBim()
  },
  // 方法集合
  methods: {
    // 处理bim是否显示
    formatBim() {
      this.$parent.disableBim = !this.$parent.disableBim
    },
    //刷新
    refresh() {
      this.getGroupBar()
      this.getAttendanceList()
      this.getLaborBar()
      this.getGroupList()
      this.getZhuChart()
      this.getErrList()
    },
    async getGroupBar() {
      let res = await Api.getGroupBar()
      let xData = ['全天缺卡', '下班缺卡', '迟到缺卡', '迟到早退', '上班迟到', '下班早退']
      let data = [
        {
          name: '全天缺卡',
          value: res.data.allDayCardMissingNumber || 0
        },
        {
          name: '下班缺卡',
          value: res.data.cardMissingAfterWorkNumber || 0
        },
        {
          name: '迟到缺卡',
          value: res.data.lateCardMissingNumber || 0
        },
        {
          name: '迟到早退',
          value: res.data.lateLeaveEarlyNumber || 0
        },
        {
          name: '上班迟到',
          value: res.data.lateNumber || 0
        },
        {
          name: '下班早退',
          value: res.data.leaveEarlyAfterWorkNumber || 0
        }
      ]
      this.chartData = {
        xData,
        data
      }
      this.chartTotal = res.data.total || 0
    },
    async getAttendanceList() {
      let res = await Api.getAttendanceList({
        page: 1,
        rows: 100
      })
      this.tableData = res.data || []
    },
    async getLaborBar() {
      let res = await Api.laborBar()
      let xData = ['全天缺卡', '下班缺卡', '迟到缺卡', '迟到早退', '上班迟到', '下班早退']
      let data = [
        {
          name: '全天缺卡',
          value: res.data.allDayCardMissingNumber || 0
        },
        {
          name: '下班缺卡',
          value: res.data.cardMissingAfterWorkNumber || 0
        },
        {
          name: '迟到缺卡',
          value: res.data.lateCardMissingNumber || 0
        },
        {
          name: '迟到早退',
          value: res.data.lateLeaveEarlyNumber || 0
        },
        {
          name: '上班迟到',
          value: res.data.lateNumber || 0
        },
        {
          name: '下班早退',
          value: res.data.leaveEarlyAfterWorkNumber || 0
        }
      ]
      this.laborChartData = {
        xData,
        data
      }
      this.laborTotal = res.data.total || 0
    },
    async getGroupList() {
      let res = await Api.groupList({})
      let cloneData = _.cloneDeep(res.data)
      cloneData.map(c => {
        c.progress = (c.actualNumber / c.total) * 100 || 0
      })
      this.groupList = cloneData
    },
    async getZhuChart() {
      let res = await Api.zhuChart({ timeSpan: this.zhuType })
      let cloneData = _.cloneDeep(res.data)
      let xData = cloneData.map(r => r.departmentName)
      let data = cloneData.map(c => c.attendanceRate)
      this.zhuChart = {
        xData,
        data
      }
    },
    async getErrList() {
      let res = await Api.errList({ timeSpan: this.errType, allStatus: this.errStatus })
      this.errList = res.data || []
      // this.errList=[{name:'111',count:1,allStatus:2},{name:'222',count:1,allStatus:3},{name:'111',count:1,allStatus:4},{name:'111',count:1,allStatus:5}]
    },
    changeErrType(type) {
      this.errType = type
      this.errStatus = 2
      this.getErrList()
    },
    changeErrStatus(type) {
      this.errStatus = type
      this.getErrList()
    },
    changeZhuType(type) {
      this.zhuType = type
      this.getZhuChart()
    },
    progressStroke(value) {
      let percent = ((100 - value) * 143) / 100
      return `${percent},1000`
    }
  }
}
</script>

<style scoped lang="less">
@import url('./attendance');
</style>
