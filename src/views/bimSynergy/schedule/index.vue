<template>
  <div class="content">
    <div class="schedule">
      <div class="model">
        <div class="model-left">
          <BlockCard :title="'模型列表'">
            <template #content>
              <div class="tree-con">
                <!--                <BimTree class="screen" />-->
                <BimTree
                  class="synergy"
                  :modelReady="isReady"
                  :is-model="false"
                  :model-id="localStorage.getItem('bimModelId')"
                />
              </div>
            </template>
          </BlockCard>
        </div>
        <div class="model-right">
          <div class="progress-wrap" :class="isStart ? 'hidden' : ''">
            <div class="finished">
              <span class="icon"></span>
              <span class="label">已完成进度</span>
              <span class="num">{{ progressCompletedTotal }}%</span>
            </div>
            <div class="unfinished">
              <span class="icon"></span>
              <span class="label">未完成进度</span>
              <span class="num">{{ progressTotal }}%</span>
            </div>
          </div>
          <!-- <BlockCard :title="'模型展示'">
            <template #icon><img src="../images/blockCard/icon/mxzs.png" /></template>
            <template #content>
              <div class="bm-con">
                <BimView
                  ref="bim"
                  :model-id="localStorage.getItem('bimModelId')"
                  :bimBgColor="bimConfig.bimBgColor"
                  @ready="isReady = true"
                />
              </div>
            </template>
          </BlockCard> -->
        </div>
      </div>
      <div class="simulation">
        <BlockCard :title="'进度模拟'">
          <template #content>
            <div :class="['container', showProgress ? 'show' : '']">
              <div class="tooltips">
                <el-form inline>
                  <el-form-item label="选择工期">
                    <SelectList v-model="filterForm.type" :self-list="workType" :has-all-option="false" />
                  </el-form-item>
                  <el-form-item label="计划时间">
                    <DateRange :startTime.sync="filterForm.startDate" :endTime.sync="filterForm.endDate" />
                  </el-form-item>
                  <el-form-item label="时间跨度">
                    <SelectList
                      v-model="filterForm.scaleUnit"
                      :self-list="dateType"
                      style="width: 100px"
                      :has-all-option="false"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button class="search-btn" type="warning" icon="el-icon-search" @click="onSubmit"
                      >查询</el-button
                    >
                    <el-button class="start-btn" type="warning" @click="start">开始模拟</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="tick">
                <DateTickBar
                  ref="DateTickBar"
                  :scaleUnit="filterForm.scaleUnit"
                  :start="filterForm.startDate"
                  :end="filterForm.endDate"
                  @tickChange="dateTickChangeHandle"
                />
              </div>
              <div class="table-wrap">
                <el-table class="table" :height="showProgress ? 110 : 150" :data="tableData">
                  <el-table-column prop="taskName" label="任务名称" />
                  <el-table-column
                    prop="planStartDate"
                    label="计划开始时间"
                    :formatter="(row, column, cellValue) => (cellValue ? moment(cellValue).format('YYYY-MM-DD') : '')"
                    align="center"
                  />
                  <el-table-column
                    prop="planEndDate"
                    label="计划结束时间"
                    :formatter="(row, column, cellValue) => (cellValue ? moment(cellValue).format('YYYY-MM-DD') : '')"
                    align="center"
                  />
                  <el-table-column prop="planDuration" label="计划工期(天)" align="center" />
                  <el-table-column
                    prop="actualStartDate"
                    label="实际开始时间"
                    :formatter="(row, column, cellValue) => (cellValue ? moment(cellValue).format('YYYY-MM-DD') : '')"
                    align="center"
                  />
                  <el-table-column
                    prop="actualEndDate"
                    label="实际结束时间"
                    :formatter="(row, column, cellValue) => (cellValue ? moment(cellValue).format('YYYY-MM-DD') : '')"
                    align="center"
                  />
                  <el-table-column prop="actualDuration" label="实际工期" align="center" />
                </el-table>
              </div>
            </div>
          </template>
        </BlockCard>
      </div>
    </div>
  </div>
</template>

<script>
import Api from './api'
import DateTickBar from './components/TickProgressBar/DateTickBar'
import BlockCard from '../componments/BlockCard'
import bimConfig from '../bimConfig' // bim模型配置
export default {
  components: {
    DateTickBar,
    BlockCard
  },
  data() {
    return {
      timeData: {},
      workType: [
        {
          label: '计划工期',
          value: 0
        },
        {
          label: '实际工期',
          value: 1
        }
      ],
      dateType: [
        {
          label: '月',
          value: 'month'
        },
        {
          label: '周',
          value: 'week'
        },
        {
          label: '日',
          value: 'day'
        }
      ],
      filterForm: {
        startDate: '',
        endDate: '',
        scaleUnit: 'week',
        type: 0
      },
      tableData: [],
      showGuids: [],
      showProgress: false,
      isReady: false,
      bimConfig,
      progressCompletedTotal: 0,
      progressTotal: 0,
      isStart: false
    }
  },
  computed: {
    bimReady() {
      return this.$parent.bimReady
    }
  },
  watch: {
    filterForm: {
      handler: function (v) {
        if (v.startDate && v.endDate) {
          this.showProgress = true
        }
      },
      deep: true
    }
  },
  mounted() {
    this.formatBim()
    this.init()
    this.bimShouProgress()
  },
  beforeDestroy() {
    this.formatBim()
    this.$parent.$refs?.bim?.setModelVisible(true)
  },
  methods: {
    // 处理bim是否显示
    formatBim() {
      let defaultHeight = 300
      this.$parent.bimConHeight = bimConfig.bimConHeight + defaultHeight
      this.$parent.disableRight = !this.$parent.disableRight
    },
    init() {
      // this.onresize()
      this.getTableData()
      // this.refresh()
    },
    // 监听窗口改变
    onresize() {
      this.$nextTick(() => {
        if (this.$parent.onresize) {
          this.$parent.onresize()
        }
      })
    },
    async getTableData() {
      let res = await Api.list({})
      this.tableData = res.data?.baseList || []
    },
    async bimShouProgress() {
      let params = {
        cycleType: 3,
        modelId: localStorage.getItem('bimModelId')
      }
      let result = await Api.getModelProgress(params)
      let datas = result.data
      let total = 0
      let completedTotal = 0
      if (!datas || datas.length === 0) {
        this.progressTotal = 0
        this.progressCompletedTotal = 0
        return
      }
      datas.map(e => {
        let componentIdList = e.componentIdList || []
        total += componentIdList.length
        if (e.groupNum === 0) {
          this.progressCompleted = componentIdList
          completedTotal = e.actualFinishedPercent || 0
        }
      })
      // this.unProgressCompleted = bimElementData.map(b => b.id).filter(e => !this.progressCompleted.includes(e))
      this.progressTotal = (100 - completedTotal).toFixed(2)
      this.progressCompletedTotal = completedTotal
      if (this.progressCompletedTotal === 100) {
        this.scheduleStatus = '已完成'
      }
      this.scheduleStatusWidth = (this.progressCompletedTotal / 100) * 186
    },
    // 获取时间轴数据
    async onSubmit() {
      if (!this.filterForm.startDate || !this.filterForm.endDate) {
        return this.$message.error('时间必填')
      }
      let param = _.pick(this.filterForm, ['startDate', 'endDate', 'type'])
      let timeType = this.filterForm.scaleUnit
      param.timeSpan = timeType === 'day' ? 4 : timeType === 'week' ? 5 : 6
      let res = await Api.bimList(param)
      this.$refs.DateTickBar.initBar()
      this.$refs.DateTickBar.handleBackToStart()
      this.$parent.$refs.bim.setModelVisible(true)
      this.timeData = res.data
      this.isStart = false
      // this.timeData = {
      //   '2020-12-06': [
      //     {
      //       status: 0,
      //       componentIds: ['xra7PlYm+0/724430', 'xra7PlYm+0/933840']
      //     }
      //   ],
      //   '2020-12-07': [
      //     {
      //       status: 4,
      //       componentIds: ['xra7PlYm+0/909735', 'xra7PlYm+1/220450']
      //     }
      //   ],
      //   '2020-12-08': [
      //     {
      //       status: 3,
      //       componentIds: ['xra7PlYm+1/212797', 'xra7PlYm+1/212763']
      //     }
      //   ],
      //   '2020-12-10': [
      //     {
      //       status: 3,
      //       componentIds: ['xra7PlYm+1/270048', 'xra7PlYm+1/308462']
      //     }
      //   ],
      //   '2020-12-12': [
      //     {
      //       status: 5,
      //       componentIds: ['xra7PlYm+1/212324', 'xra7PlYm+1/204424']
      //     }
      //   ]
      // }
    },
    async start() {
      if (!this.filterForm.startDate || !this.filterForm.endDate) {
        return this.$message.error('时间必填')
      }
      await this.onSubmit()

      this.$refs.DateTickBar.handleBackToStart()
      this.$refs.DateTickBar.handleForwardPlay()
      //bim数据重置

      let bimApp = this.$parent.$refs.bim
      this.showGuids = []
      bimApp.clearElementsColor()
      bimApp.setModelVisible(false)
      this.isStart = true
      this.bimShouProgress()
    },

    dateTickChangeHandle(e, date) {
      let targetMoment = null
      // 月
      if (this.filterForm.scaleUnit === 'month') {
        targetMoment = moment(date).endOf('month').format('YYYY-MM-DD')
        if (new Date(targetMoment).valueOf() > new Date(this.filterForm.endDate).valueOf()) {
          date = moment(this.form.endDate).format('YYYY-MM-DD')
        } else {
          date = targetMoment
        }
      }
      let bimApp = this.$parent.$refs.bim
      let target = this.timeData[date]
      if (!target || target.length < 1) {
        return
      }
      for (let item of target) {
        let guids = item.componentIds
        this.showGuids = [...this.showGuids, ...guids]
        bimApp.setModelVisible(false)
        bimApp.setElementsVisible(this.showGuids, true)
        // bimApp.showGuid(this.showGuids)
        let colorAry = [
          [114, 115, 117],
          [114, 115, 117],
          [114, 115, 117],
          [19, 255, 255],
          [7, 253, 2],
          [254, 0, 2]
        ]
        bimApp.setElementsColor(guids, colorAry[item.status])
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./schedule');
</style>
