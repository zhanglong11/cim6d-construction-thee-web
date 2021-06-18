<template>
  <div class="home-bim">
    <el-card class="tree">
      <div class="tree-roll" style="height: 560px">
        <BimTree :model-ready="isReady" :is-model="false" :model-id="modelId" />
      </div>
    </el-card>
    <div class="task-bim">
      <BimView ref="bim" :model-id="modelId"></BimView>
    </div>
    <div class="bim-legend">
      <div class="legend-item">
        <div class="legend-con">
          <div class="status-con">
            <p class="status">
              <!--              <em class="active"></em>-->
              已完成进度（{{ progressCompletedTotal }}%）
            </p>
            <p class="status">
              <!--              <em></em>-->
              未完成进度（{{ progressTotal }}%）
            </p>
          </div>
          <el-progress
            type="circle"
            :width="60"
            :stroke-width="4"
            color="#5572ea"
            :percentage="progressCompletedTotal"
          ></el-progress>
        </div>
        <p>
          <el-button type="primary" size="mini" @click="bimMore">BIM查看-详细进度统计</el-button>
        </p>
      </div>
      <div class="legend-item">
        <el-button type="primary" @click="addQuestion">上报质量问题</el-button>
        <br />
        <el-button type="primary" @click="addSafe">上报安全问题</el-button>
        <br />
        <el-button type="primary" @click="addTask">新建任务</el-button>
        <br />
        <el-button type="primary" @click="addMeeting">新建会议</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { homeApi } from '../api'
import Api from '@/views/bimSynergy/quality/api'
// import BimTree from '@/components/bimTree'
// import BimTree from '@/components/Bim/bimTree2'
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      allEleAry: [],
      progressTotal: 0,
      progressCompletedTotal: 0,
      progressCompleted: [], // 已完成进度
      unProgressCompleted: [],
      treeData: [],
      modelId: localStorage.getItem('bimModelId'),
      isReady: false
    }
  },
  //方法集合
  created() {
    this.scheduleTotal()
  },
  methods: {
    //进度上色
    async scheduleTotal() {
      let params = {
        cycleType: 3,
        modelId: localStorage.getItem('bimModelId')
      }
      let result = await homeApi.scheduleTotal(params)
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
      // this.unProgressCompleted = eleAry.map(b => b.id).filter(e => !this.progressCompleted.includes(e))
      this.progressTotal = (100 - completedTotal).toFixed(2)
      this.progressCompletedTotal = completedTotal

      return
      let bimApp = this.$refs.bim
      bimApp.clearElementsColor()
      // bimApp.setElementsColor(this.progressCompleted, [255, 187, 41])
      bimApp.setElementsColor(this.unProgressCompleted, [153, 153, 153])
    },

    //质量，安全问题
    async showIssue() {
      let bimApp = this.$refs.BIMRef
      let qualityRes = await Api.getQualityModelId([])

      let elementId = qualityRes.data.filter(d => d.componentIdList && d.componentIdList.length)
      let initEleAry = [...new Set(elementId.map(e => e.componentIdList).flat())]
      let initAry = initEleAry.map(i => {
        let o = {}
        o.id = i
        o.type = 'quality'
        o.data = qualityRes.data.filter(a => a.componentIdList && a.componentIdList.includes(i)).map(d => d.dataId)
        return o
      })

      let safeRes = await Api.getSafeModelId([])

      let safeElementId = safeRes.data.filter(d => d.componentIdList && d.componentIdList.length)
      let safeInitEleAry = [...new Set(safeElementId.map(e => e.componentIdList).flat())]
      let safeInitAry = safeInitEleAry.map(i => {
        let o = {}
        o.id = i
        o.type = 'safe'
        o.data = safeRes.data.filter(a => a.componentIdList && a.componentIdList.includes(i)).map(d => d.dataId)
        return o
      })

      bimApp.setMark(initAry, require('../images/quality-icon.png'), 24)
      bimApp.setMark(safeInitAry, require('../images/safe-icon.png'), 24)
    },

    //标注点击
    iconClick(e) {
      console.log(e)
    },

    // 上报质量问题
    addQuestion() {
      this.$router.push({ name: 'QualityIssueList' })
    },
    // 上报安全问题
    addSafe() {
      this.$router.push({ name: 'SafetyIssueList' })
    },
    // bim查看
    bimMore() {
      this.$router.push({ name: 'BimModelWatch' })
    },
    addTask() {
      this.$router.push({ name: 'TaskManage', query: { activeName: 'executor' } })
    },
    addMeeting() {
      this.$router.push({ name: 'MeetingManage' })
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/common');
.home-bim {
  margin-bottom: 15px;
  display: flex;
  .tree {
    width: 300px;
  }
  .task-bim {
    width: calc(100% - 600px);
    height: 600px;
    width: calc(100vw - 858px);
    overflow: hidden;
  }
  .bim-legend {
    width: 300px;
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 15px;
    .legend-item {
      flex: 1;
      background: #fff;
      margin-top: 15px;
      padding: 15px 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 12px;
      border: 1px #f8f9fd solid;
      border-left: 2px #9baefe solid;
      border-radius: 6px;
      box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
      .legend-con {
        display: flex;
        align-items: center;
        .status-con {
          flex: 1;
        }
      }
      /deep/.el-button {
        margin-top: 10px;
      }
      .status {
        display: flex;
        align-items: center;
        margin: 10px 0;
        em {
          margin-right: 10px;
          width: 15px;
          height: 15px;
          background: #999;
          // border-radius: 50%;
          &.active {
            background: #ffbb29;
          }
        }
      }
      &.quality {
        .status {
          em {
            background: #ff0000;
            border-radius: 50%;
            &.active {
              background: #149e2e;
            }
          }
        }
      }
      &.safe {
        .status {
          em {
            background: #ff9900;
            transform: rotate(-45deg) scale(0.8);
            &.active {
              background: #d0e17d;
            }
          }
        }
      }
      &:first-child {
        margin-top: 0;
      }
    }
    .quality-progress {
      position: relative;
      .total {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8.66666px;
      }
    }
  }
  .box-card {
    height: 100%;

    /deep/ .el-card__body {
      height: calc(100%);
      padding: 0;

      > div {
        .el-card {
          height: calc(100% - 60px);

          .el-card__body {
            height: calc(100% - 60px);
          }
        }
      }
    }
  }
}
.tree-roll {
  overflow-y: auto;
  .scrollbar;
}
</style>
