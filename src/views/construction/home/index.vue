<template>
  <div class="no-padding">
    <Bim />
    <!-- 进度计划 start -->
    <el-row :gutter="15">
      <el-col :md="10">
        <!-- 未完成进度计划 start -->
        <UnfinishedPlan ref="unfinishedPlanRef" @taskReceive="taskReceive" />
        <!-- 未完成进度计划 end -->
      </el-col>
      <el-col :md="14">
        <el-card>
          <div class="custom-card-header schedule-header">
            <div class="title" style="margin-bottom: 0">
              我的工作
              <div style="margin-top: -6px">
                <span style="font-size: 14px">分类检索：</span>
                <el-select v-model="workType" placeholder="请选择分类" @change="handleWorkTypeChange">
                  <el-option v-for="item in workTypeList" :key="item.value" :label="item.content" :value="item.value" />
                </el-select>
              </div>
            </div>
            <el-table :data="tableWorkList" max-height="360" :show-header="false">
              <el-table-column prop="type" label="类型" width="89">
                <template slot-scope="{ row }">
                  <span :class="{ 'is-delay': row.isDelay }">【{{ $getLabel(workTypeList, row.type) }}】</span>
                </template>
              </el-table-column>
              <el-table-column prop="title" label="流程定义名称" show-overflow-tooltip min-width="150">
                <template slot-scope="{ row }">
                  <span v-if="row.title" :class="{ 'is-delay': row.isDelay }">{{ row.title }}</span>
                  <span v-else :class="{ 'is-delay': row.isDelay }">-</span>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="时间" show-overflow-tooltip min-width="200">
                <template slot-scope="{ row }">
                  <p :class="{ 'is-delay': row.isDelay }">
                    <span v-if="row.type === 1">
                      计划时间：{{ row.startTime | formatData }} ~ {{ row.endTime | formatData }}
                    </span>
                    <span v-else-if="row.type === 2">会议时间：{{ row.startTime }} ~ {{ row.endTime }}</span>
                    <span v-else-if="row.type === 3">截止时间：{{ row.endTime }}</span>
                    <span v-else>发布时间：{{ row.startTime }}</span>
                    <span v-if="row.isDelay">（已延期）</span>
                  </p>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="300" align="right" fixed="right">
                <template slot-scope="{ row }">
                  <span v-if="row.type === 1">
                    <ScheduleModal :defaultItem="row" @change="getIndexWorkViewList()" />
                  </span>
                  <span v-else-if="row.type === 3">
                    <el-button :size="'mini'" type="danger" @click="toDetails(row)">提交任务成果</el-button>
                  </span>
                  <span v-else-if="row.type === 2 || row.type === 5">
                    <el-button :size="'mini'" type="success" @click="toDetails(row)">查看</el-button>
                  </span>
                  <span v-else-if="row.type === 4">
                    <el-button :size="'mini'" type="warning" @click="toDetails(row)">审核</el-button>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <div class="line-space"></div>
        <el-card>
          <div class="custom-card-header schedule-header">
            <div class="title">
              进度管理
              <div style="margin-top: -6px">
                <el-select v-model="taskPanelSelect" placeholder="进度文件名称">
                  <el-option
                    v-for="item in taskPanelSelectList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="schedule-roll">
            <template
              v-if="
                taskPanelSelect !== '' &&
                taskPanelList[taskPanelSelect] &&
                taskPanelList[taskPanelSelect].list.length > 0
              "
            >
              <div
                v-for="(item, i) in taskPanelList[taskPanelSelect].list"
                :key="i"
                class="schedule-con"
                :class="{ finished: item.isFinished }"
              >
                <div class="task-info">
                  <span class="task-name" v-text="item.taskName"></span>
                  <span v-if="item.isFinished" class="status">（已完成）</span>
                  <span class="schedule-time">{{ item.start | formatData }} ~ {{ item.end | formatData }}</span>
                </div>
                <el-progress
                  :text-inside="false"
                  :stroke-width="5"
                  :percentage="item.actualFinishedPercent"
                  :show-text="true"
                ></el-progress>
              </div>
            </template>
            <p v-else class="no-data">暂无数据</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Bim from './components/bimView' // 首页bim展示
import UnfinishedPlan from './components/unfinishedPlan' // 未完成进度计划
import ScheduleModal from './components/scheduleList' // 我领取的进度计划
import workTypeList from './lib/workType'
import Api from './api/index2'
import moment from 'moment'
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { Bim, UnfinishedPlan, ScheduleModal },
  data() {
    return {
      workTypeList,
      workType: 0,
      tableWorkList: [], // 我的工作
      taskPanelSelect: '',
      taskPanelSelectList: [],
      taskPanelList: [] // 项目进度面板
    }
  },
  //监听属性 类似于data概念
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getIndexWorkViewList()
    this.getScheduleTaskPanel()
    this.getModelDetail()
  },
  //方法集合
  methods: {
    // 领取任务成功
    taskReceive() {
      this.getIndexWorkViewList()
    },
    async getModelDetail() {
      let res = await Api.getProjectDetail(localStorage.getItem('projectId'))
      let fileUrl = _.get(_.find(res.data.imageList, { imageType: 2 }), 'fileUrl')
      if (!fileUrl) return
      localStorage.setItem('projectImgUrl', fileUrl)
    },
    // 获取我的工作列表
    getIndexWorkViewList() {
      Api.getIndexWorkViewList({ type: this.workType, projectId: this.projectId }).then(res => {
        let datas = res.data
        this.tableWorkList = datas.detailDTOList
        let workCount = datas.workCount
        this.workTypeList.map(item => {
          item.content = item.label + '(' + workCount[item.value] + ')'
        })
      })
      this.getScheduleTaskPanel()
    },
    // 分类检索
    handleWorkTypeChange() {
      this.getIndexWorkViewList()
    },
    // 进度管理
    async getScheduleTaskPanel() {
      let result = await Api.getScheduleTaskPanel()
      let datas = result.data || []
      let taskPanelSelectList = []
      datas.map((item, i) => {
        taskPanelSelectList.push({
          label: item.scheduleFileName,
          value: i
        })
        let planFinishedPercent = parseFloat(item.planFinishedPercent.toFixed(2))
        let actualFinishedPercent = parseFloat(item.actualFinishedPercent.toFixed(2))
        item.planFinishedPercent = planFinishedPercent
        item.actualFinishedPercent = actualFinishedPercent
      })
      this.taskPanelSelectList = taskPanelSelectList
      if (!this.taskPanelSelect && datas.length) {
        this.taskPanelSelect = 0
      }
      let defaultWidth = 10
      /*
        获取数组中的最大值或最小值
        type = max 最大值
        type = min 最小值
      */
      const getArrayMax = (array, type = 'max') => {
        return Math[type].apply(Math, array)
      }
      datas.map(item => {
        let list = item.list || []
        let minCount = getArrayMax(_.map(list, 'taskCount'), 'min')
        let maxCount = getArrayMax(_.map(list, 'taskCount'), 'max')
        defaultWidth = minCount <= 2 ? 50 : 10
        list.map(e => {
          e.lineStyle = `width: ${e.taskCount * defaultWidth}px`
        })
        item.list = list
        item.lineStyle =
          maxCount > 0
            ? `width: ${item.taskCount * defaultWidth}px;margin-left: ${
                item.list.length > 0 ? item.list[0].taskCount * defaultWidth : 0
              }px`
            : ''
        item.progressStyle =
          maxCount > 0
            ? `width: ${
                item.taskCount * defaultWidth + (item.list.length > 0 ? item.list[0].taskCount * defaultWidth : 0)
              }px;`
            : ''
      })
      this.taskPanelList = datas
    },
    // 跳转消息详情
    toDetails(item) {
      if (item.pcUrl) {
        this.$router.push({
          name: item.pcUrl,
          query: {
            id: item.targetId,
            isCheck: item.type === 4
          }
        })
      } else {
        this.$message.error('推送跳转地址未配置')
      }
    }
  }
}
</script>

<style lang="less" scoped>
//@import url(); 引入公共css类
@import url('~@/styles/common');
.is-delay {
  color: #eb3a3a;
}
.line-space {
  margin-bottom: 15px;
}

.custom-card-header,
/deep/.custom-card-header {
  display: flex;
  flex-direction: column;
  .title {
    margin-bottom: 15px;
    padding-bottom: 15px;
    font-size: 18px;
    width: auto;
    border-bottom: 1px solid #ebeef5;
  }
  .card-form {
    margin-bottom: 15px;
  }
  &.schedule-header {
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}

.schedule-roll {
  padding-top: 15px;
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 375px;
  overflow-y: auto;
  background: #f2f5f9;
  border-radius: 10px;
  .scrollbar;
  .no-data {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #999;
  }
}
.schedule-con {
  width: 100%;
  margin-bottom: 15px;
  padding: 0 10px 0 15px;
  .task-info {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 14px;
  }
  .schedule-time {
    margin-left: 15px;
  }
  &:last-child {
    padding-bottom: 0;
    border: 0;
  }
  .schedule-name {
    border: 1px #ddd dashed;
    width: 200px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    margin-right: 15px;
    font-size: 14px;
    border-radius: 6px;
  }
  /deep/.el-progress {
    display: flex;
    align-items: center;
    .el-progress__text {
      font-size: 14px !important;
    }
    .el-progress-bar__outer {
      background: #dee3e9;
    }
    .el-progress-bar__inner {
      background: #6d93e8;
    }
  }

  &.finished {
    color: #999;
  }
  .schedule-body {
    flex: 1;
    overflow: hidden;
    .schedule-roll {
      padding-left: 70px;
      width: 100%;
      overflow-x: auto;
      .scrollbar;
      position: relative;
      .schedule-line {
        position: absolute;
        z-index: 3;
        display: flex;
        align-items: center;
        font-size: 12px;
        span {
          border-left: 1px #ccc solid;
          height: 120px;
          display: flex;
          align-items: center;
          white-space: nowrap;
          padding-left: 10px;
        }
      }
    }
  }
}

/deep/ .el-table__body-wrapper {
  .scrollbar;
}
</style>
