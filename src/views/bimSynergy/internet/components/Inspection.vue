<template>
  <div class="patrol">
    <div class="patrol-left">
      <ShowPath :treeData="treeData" />
    </div>
    <div class="patrol-right">
      <BlockCard title="巡更结果统计">
        <template #content>
          <div class="patrol-total">
            <div class="tabs">
              <span class="tab" :class="{ active: totalIndex === 1 }" @click="queryPatrolStatistical(1)">今日</span>
              <span class="tab" :class="{ active: totalIndex === 2 }" @click="queryPatrolStatistical(2)">本周</span>
              <span class="tab" :class="{ active: totalIndex === 3 }" @click="queryPatrolStatistical(3)">本月</span>
            </div>
            <div class="desc">
              <div class="num">
                <img src="../../newImages/internet/patrol/people-num.png" />
                <p>
                  <span>巡更人数</span>
                  <b>{{ patrolNum }}</b
                  >人
                </p>
              </div>
              <div class="num">
                <img src="../../newImages/internet/patrol/num.png" />
                <p>
                  <span>累计巡更次数</span>
                  <b>{{ patrolTotalNum }}</b
                  >次
                </p>
              </div>
            </div>
            <div class="total-list">
              <ul>
                <li v-for="(item, i) in patrolList" :key="i">
                  <p>
                    {{ item.routeName }}
                    <b>{{ item.patrolNum }}次</b>
                  </p>
                  <p>
                    异常次数
                    <b :class="{ error: item.anomalyNum }">{{ item.anomalyNum }}次</b>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </BlockCard>
      <BlockCard title="今日巡更">
        <template #content>
          <div class="report-list">
            <ul>
              <li v-for="(item, i) in reportList" :key="i">
                <div class="box">
                  <div class="title">{{ item.routeName }}</div>
                  <div class="time">
                    <span>{{ item.actualPatrolTime }}</span>
                    <p class="status">
                      <span v-if="item.patrolResult" class="gold">正常</span>
                      <span v-if="item.patrolResult === false" class="red">异常</span>
                    </p>
                  </div>
                  <div class="desc">
                    <el-button
                      v-if="item.patrolResult === true || item.patrolResult === false"
                      type="text"
                      size="mini"
                      class="btn-text"
                      @click="toDetail(item)"
                      >查看报告</el-button
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- <el-table ref="table" class="table" :data="reportList" stripe height="99%">
            <el-table-column prop="actualPatrolTime" label="巡更时间" align="center" width="100"></el-table-column>
            <el-table-column prop="routeName" label="巡更路线" show-overflow-tooltip min-width="120" align="center">
              <template #default="{ row }">
                <el-button type="text" class="gold">{{ row.routeName }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="result" label="巡更结果" align="center">
              <template #default="{ row }">
                <span v-if="row.patrolResult" class="gold">正常</span>
                <span v-if="row.patrolResult === false" class="red">异常</span>
              </template>
            </el-table-column>
            <el-table-column label="巡更报告" align="center">
              <template #default="{ row }">
                <el-button
                  v-if="row.patrolResult === true || row.patrolResult === false"
                  type="text"
                  size="mini"
                  class="btn-text"
                  @click="toDetail(row)"
                  >查看报告</el-button
                >
              </template>
            </el-table-column>
          </el-table> -->
        </template>
      </BlockCard>
    </div>
    <DialogPatrolReport :visible.sync="dialogVisible" :dataValue="dialogData" />
  </div>
</template>

<script>
import DialogPatrolReport from './DialogPatrolReport' // 巡更报告 模态框
import BlockCard from '../../componments/BlockCard'
import roadLineNum from '../lib/roadLineNum'
import patrolStatus from '../lib/patrolStatus'
import ShowPath from '@/views/patrol/components/ShowPath'
import Api from '../../api'
export default {
  name: 'Inspection',
  components: {
    BlockCard,
    ShowPath,
    DialogPatrolReport
  },
  data() {
    return {
      filterForm: {
        status: null,
        lines: null
      },
      roadLineNum,
      patrolStatus,
      total: 0,
      tabIndex: 0,
      routerList: [],
      totalIndex: 1,
      patrolNum: 0,
      patrolTotalNum: 0,
      treeData: [],
      dialogVisible: false,
      dialogData: {},
      reportList: [],
      patrolList: [],
      patrolTree: [] // 树结构
    }
  },
  mounted() {
    this.getPatrolTree()
    this.queryList()
    this.queryPatrol()
    this.queryPatrolStatistical()
  },
  methods: {
    // 巡更树结构
    async getPatrolTree() {
      let result = await Api.getPatrolTree()
      let datas = result.data || []
      datas.map(e => {
        e.id = e.patrolId
        e.label = e.routeName
        e.children = e.routeDrawingsList || []
        e.children.forEach(f => {
          f.id = f.drawingsId
          f.label = f.drawingsName
          f.imgUrl = f.modelUrl ? JSON.parse(f.modelUrl)[0] : ''
          let pointList = f.pointList || []
          let actualIndex = Math.floor(Math.random() * pointList.length)
          let actualIndexTwo = -1
          if (pointList.length > 2) {
            actualIndexTwo = Math.floor(Math.random() * pointList.length)
          }
          pointList.forEach((g, i) => {
            // 随机处理两个实际巡更点位
            if (i === actualIndex || i === actualIndexTwo) {
              g.actual = true
            }
          })
        })
      })
      this.treeData = datas
    },
    // 分页查询巡更路线列表
    async queryList() {
      let params = {
        page: 1,
        rows: 200
      }
      let result = await Api.queryPatrolRouter(params)
      let datas = result.data
      let list = datas.records || []
      if (list.length > 0) {
        // this.getPatrolRouter(list[0].patrolRouteId)
      }
      this.routerList = list
    },
    // 分页查询巡更计划列表
    async queryPatrol() {
      let params = {
        page: 1,
        rows: 200,
        statisticalCycle: 1
      }
      let result = await Api.queryPatrol(params)
      let datas = result.data
      let list = datas.records || []
      this.reportList = list
    },
    // 巡更统计
    async queryPatrolStatistical(statisticalCycle = 1) {
      let params = {
        page: 1,
        rows: 200,
        statisticalCycle
      }
      let result = await Api.queryPatrolStatistical(params)
      let datas = result.data
      let list = datas.detailPaginationInfo.records || []
      this.totalIndex = statisticalCycle
      this.patrolNum = datas.patrolNum || 0
      this.patrolTotalNum = datas.patrolTotalNum || 0
      this.patrolList = list
    },
    // 巡更路线详情
    async getPatrolRouter(patrolRouteId) {
      let result = await Api.getPatrolRouter(patrolRouteId)
      let datas = result.data
      let treeData = [
        {
          id: '0',
          label: '路线图纸',
          children: []
        }
      ]
      let patrolRouteDrawingsList = datas.patrolRouteDrawingsList
      patrolRouteDrawingsList.map(item => {
        item.routeName = datas.routeName
        item.drawingsName = item.drawingsName
        item.id = item.drawingsId
        item.label = item.drawingsName
        item.imgUrl = JSON.parse(item.modelUrl)[0]
        item.children = []
        item.pointList.map((e, i) => {
          e.actual = i < 2
        })
      })
      treeData[0].children = patrolRouteDrawingsList
      this.treeData = treeData // 初始左侧图纸树
    },
    // 切换路线
    changeLine(item, index) {
      this.tabIndex = index
      this.getPatrolRouter(item.patrolRouteId)
    },
    // 查看报告
    toDetail(row) {
      this.dialogVisible = true
      this.dialogData = row
    },
    //查询日期
    onSubmit() {},
    //每页显示数量改变
    handleSizeChange(pageSize) {
      this.filterForm.rows = pageSize
      this.getAcceptanceList()
    },
    //当前页改变
    handleCurrentChange(page) {
      this.filterForm.page = page
      this.getAcceptanceList()
    }
  }
}
</script>

<style scoped lang="less">
@import url('../../table');
@import url('../../common.less');
@import url('../../componments/BlockCard.less');
@green: #38f820;
@red: #da6756;
@gold: #77eed7;
.patrol {
  padding: 0 20px;
  display: flex;
  height: 100%;
  .patrol-left {
    margin-right: @space;
    display: flex;
    flex: 1;
    overflow: auto;
    /deep/ .block-card {
      .block-card;
    }
    /deep/.path-con {
      .right {
        padding-top: 45px;
        justify-content: flex-end;
        .img-con {
          border-color: #71d2ff;
        }
      }
    }
    .bimTree();
  }
  .patrol-right {
    display: flex;
    flex-direction: column;
    width: 400px;
    /deep/.block-card {
      &:first-child {
        margin-bottom: @space;
      }
    }
  }
}
.patrol-line {
  display: flex;
  overflow: hidden;
}
.patrol-total {
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  .tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    .tab {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 96px;
      height: 38px;
      font-size: 14px;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s;
      background: url('../../newImages/internet/patrol/tab.png') no-repeat;
      background-size: cover;
      &.active {
        background-image: url('../../newImages/internet/patrol/tab-hover.png');
      }
    }
  }
  .desc {
    padding: 10px 10px;
    display: flex;
    align-items: center;
    .num {
      flex: 1;
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 14px;
      img {
        margin-right: 10px;
        width: 64px;
        height: 66px;
      }
      span {
        margin-bottom: 10px;
        display: block;
      }
      b {
        margin-right: 5px;
        display: inline-block;
        font-size: 20px;
        color: @gold;
        font-weight: normal;
      }
    }
  }
  .total-list {
    flex: 1;
    overflow: hidden;
    ul {
      height: 100%;
      overflow-y: auto;
      li {
        // background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0));
        background: url('../../newImages/internet/patrol/total-line.png') no-repeat;
        background-size: 100% 100%;
        color: #fff;
        font-size: 14px;
        height: 38px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        padding: 8px 14px 0;
        b {
          color: @gold;
          margin-left: 15px;
          font-weight: normal;
          &.error {
            color: @red;
          }
        }
      }
    }
  }
}
/deep/.el-table {
  .red {
    color: @red;
  }
  .gold {
    color: @gold;
  }
  .btn-text {
    color: #a3ccd2;
    text-decoration: underline;
    &:hover {
      color: #fff;
    }
  }
}
.el-button--default,
.el-button--primary,
.el-radio-button__inner {
  background: rgba(42, 33, 25, 0.8) !important;
  box-shadow: rgba(208, 154, 110, 0.4) 0px 0px 18px inset !important;
  border-color: rgba(42, 33, 25, 0.1) !important;
  color: #fff;
  &:hover,
  &:focus {
    background: rgba(42, 33, 25, 0.6);
    box-shadow: rgba(208, 154, 110, 0.6) 0px 0px 28px inset;
    border-color: rgba(42, 33, 25, 0.1);
    color: #fff;
  }
}
.el-radio-button:first-child .el-radio-button__inner {
  box-shadow: rgba(208, 154, 110, 0.6) 0px 0px 28px inset !important;
  border-color: rgba(42, 33, 25, 0.1) !important;
}
.el-button--primary,
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background: #504033;
  box-shadow: rgba(236, 195, 128, 0.8) 0px 0px 18px inset !important;
  border-color: rgba(236, 195, 128, 0.1) !important;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    z-index: 1;
    width: 50%;
    height: 3px;
    bottom: 0;
    left: 25%;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: rgba(255, 255, 255, 0.8) 0px 0px 5px;
    border-radius: 6px;
  }
  &:hover,
  &:focus {
    background: #504033;
    box-shadow: rgba(236, 195, 128, 0.5) 0px 0px 8px inset;
    border-color: rgba(236, 195, 128, 0.1);
  }
  &.is-plain {
    background: rgba(22, 10, 1, 0.35);
    box-shadow: rgba(241, 188, 91, 0.8) 0px 0px 8px inset;
    border-color: rgba(22, 10, 1, 0.35);
    color: #fff;
    &:hover,
    &:focus {
      background: #504033;
      box-shadow: rgba(241, 188, 91, 0.5) 0px 0px 15px inset;
      border-color: rgba(22, 10, 1, 0.35);
      color: #fff;
    }
  }
}
/deep/ .el-range-editor {
  .el-range-input {
    background: none;
  }
}
.el-select-dropdown {
  background-color: #000 !important;
}
.report-list {
  ul {
    li {
      padding-bottom: 12px;
      .box {
        background: rgba(35, 37, 38, 0.6);
        border-radius: 5px;
        color: rgba(255, 255, 255, 0.5);
        padding: 15px;
        font-size: 12px;
        .title {
          font-size: 16px;
          color: #fff;
          margin-bottom: 10px;
        }
        .time {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px rgba(255, 255, 255, 0.2) dashed;
          margin-bottom: 10px;
          padding-bottom: 10px;
        }
        .status {
          .gold,
          .red {
            color: @gold;
            display: inline-flex;
            align-items: center;
            &:before {
              content: '';
              width: 8px;
              height: 8px;
              background: @gold;
              border-radius: 50%;
              margin-right: 5px;
            }
          }
          .red {
            color: @red;
            &:before {
              background: @red;
            }
          }
        }
      }
    }
  }
}
</style>
