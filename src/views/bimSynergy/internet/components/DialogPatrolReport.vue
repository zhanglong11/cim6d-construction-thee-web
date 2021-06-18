<template>
  <el-dialog class="custom-dialog" :visible="visible" title="查看报告" append-to-body width="80%" @close="close">
    <div class="report">
      <div class="report-left">
        <h4 class="mode-title">巡更时间：</h4>
        <p class="desc">
          {{ dataValue.patrolStartTime }} ~
          {{ dataValue.patrolEndTime }}
        </p>
        <h4 class="mode-title">巡更路线：</h4>
        <p class="desc">
          {{ dataValue.routeName }}
        </p>
        <h4 class="mode-title">巡更人员：</h4>
        <p class="desc">
          {{ dataValue.groupMemberName }}
        </p>
        <h4 class="mode-title">巡更结果：</h4>
        <p class="desc">
          <span v-if="dataValue.patrolResult">正常</span>
          <span v-else class="red">异常</span>
        </p>
        <template v-if="!dataValue.patrolResult">
          <h4 class="mode-title">发现的问题：</h4>
          <p class="desc">
            {{ dataValue.reportContent }}
          </p>
          <h4 class="mode-title">附件：</h4>
          <p class="desc">
            <FileList :ids="dataValue.attachment" />
          </p>
        </template>
      </div>
      <div class="report-right">
        <div class="report-path">
          <ShowPath canvasId="DialogPatrolReport" pathId="PatrolReportPathCon" :treeData="treeData" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import Api from '../../api'
import ShowPath from '@/views/patrol/components/ShowPath'
export default {
  name: 'DialogPatrolReport',
  components: {
    ShowPath
  },
  props: {
    visible: {},
    dataValue: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    // 这里存放数据
    return {
      treeData: []
    }
  },
  watch: {
    visible(val) {
      if (val) {
        console.log(111, this.dataValue)
        this.getPatrolRouter(this.dataValue.patrolRouteId)
      }
    }
  },
  // 方法集合
  methods: {
    // 巡更路线详情
    async getPatrolRouter(patrolRouteId) {
      if (!patrolRouteId) {
        return
      }
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
      console.log(222, datas)
    },
    // 关闭弹窗
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
@green: #38f820;
@red: #f82020;
@gold: #71edff;
@import url('./dialogElevator');
@import url('../../table');
.report {
  display: flex;
  height: 700px;
  .report-left {
    margin-right: 15px;
    padding-left: 15px;
    width: 340px;
    height: 100%;
    overflow: auto;
    .desc {
      padding: 5px 20px 30px;
      .red {
        color: @red;
      }
    }
  }
  .report-right {
    flex: 1;
    .report-path {
      height: 100%;
      overflow: auto;
      position: relative;
    }
  }

  /deep/.el-tree {
    border-radius: 6px;
    overflow: hidden;
  }
}
.custom-dialog {
  .bimTree();
  /deep/.path-con {
    .right {
      justify-content: flex-end;
      .img-con {
        margin: 0;
        border-color: #71d2ff;
      }
    }
  }
}
</style>
