<template>
  <el-dialog title="查看报告" :visible="visible" width="80%" @close="handleCancel">
    <div class="report-con">
      <div class="con-left">
        <div class="item">
          <div>巡更时间：</div>
          <div>{{ detailData.patrolStartTime }} ~ {{ detailData.patrolEndTime }}</div>
        </div>
        <div class="item">
          <div>巡更路线：</div>
          <div>{{ detailData.routeName }}</div>
        </div>
        <div class="item">
          <div>巡更人员：</div>
          <div>{{ detailData.groupMemberName }}</div>
        </div>
        <div class="item">
          <div>巡更结果：</div>
          <div>{{ detailData.patrolResult ? '正常' : '异常' }}</div>
        </div>
        <div class="item">
          <div>发现的问题：</div>
          <div>{{ detailData.reportContent }}</div>
        </div>
        <div class="item">
          <div>附件：</div>
          <div class="accessory">
            <FileList :ids="detailData.attachment" />
          </div>
        </div>
      </div>
      <div class="con-right">
        <ShowPath :treeData="treeData" />
        <!-- <div class="path-con">
          <div class="left">
            <div class="legend">
              <div class="plan"></div>
              <div>计划巡更点位</div>
            </div>
            <div class="legend">
              <div class="actual"></div>
              <div>实际巡更点位</div>
            </div>
            <div class="tree-con">
              <el-tree
                ref="elTree"
                :data="treeData"
                node-key="id"
                :expand-on-click-node="false"
                default-expand-all
                :highlight-current="true"
                @node-click="handleNodeClick"
              ></el-tree>
            </div>
          </div>
          <div class="right">
            <div class="img-con">
              <div v-if="drawingsInfo.imgUrl === ''" class="no-img">暂无图片</div>
              <img v-else :src="drawingsInfo.imgUrl" />
              <canvas id="canvas_path" width="800" height="600"></canvas>
            </div>
          </div>
        </div> -->
      </div>
    </div>
    <div slot="footer">
      <el-button @click="handleCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Api from '../api'
import ShowPath from '../components/ShowPath'
export default {
  components: {
    ShowPath
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    patrolId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      detailData: {}, // 计划详情
      treeData: [],
      pathDetailData: {}, // 路线详情
      currentDrawingsId: null,
      drawingsInfo: {
        imgUrl: '',
        coordinate: []
      },
      canvasContext: null
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getPatrolDetail(this.patrolId)
      this.getPatrolRouteDetail(this.detailData.patrolRouteId)
    })
  },
  methods: {
    // 取消
    handleCancel() {
      this.$emit('update:visible', false)
    },
    // 获取巡更计划详情
    async getPatrolDetail(patrolId) {
      let res = await Api.getPatrolDetail(patrolId)
      // console.log(res)
      if (res.data) {
        this.detailData = res.data
      }
    },
    // 获取巡更路线详情
    getPatrolRouteDetail(id) {
      Api.getPatrolRouteDetail(id).then(res => {
        // console.log(res)
        let datas = res.data
        if (datas) {
          this.pathDetailData = datas
          let treeData = [
            {
              id: '0',
              drawingsId: '0',
              label: '路线图纸',
              children: []
            }
          ]
          let patrolRouteDrawingsList = this.pathDetailData.patrolRouteDrawingsList
          patrolRouteDrawingsList.map(item => {
            item.routeName = datas.routeName
            item.id = item.drawingsId
            item.label = item.drawingsName
            item.imgUrl = JSON.parse(item.modelUrl)[0]
            item.children = []
          })
          treeData[0].children = patrolRouteDrawingsList
          console.log(111, treeData)
          this.treeData = treeData // 初始左侧图纸树
        }
      })
    },
    // 图纸信息切换
    drawingsSwitch() {
      let drawingsInfo = {}
      let patrolRouteDrawingsList = this.pathDetailData.patrolRouteDrawingsList
      for (let i = 0; i < patrolRouteDrawingsList.length; i++) {
        if (patrolRouteDrawingsList[i].drawingsId === this.currentDrawingsId) {
          let modelUrl = JSON.parse(patrolRouteDrawingsList[i].modelUrl)
          drawingsInfo.imgUrl = modelUrl[0] // 展示图片
          drawingsInfo.coordinate = [] // 存放路线点坐标
          let pointList = patrolRouteDrawingsList[i].pointList
          for (let j = 0; j < pointList.length; j++) {
            let coordinateArray = pointList[j].patrolPointLocation.split(',')
            drawingsInfo.coordinate.push([parseFloat(coordinateArray[0]), parseFloat(coordinateArray[1])]) // 字符串坐标需要转换成数字类型
          }
          break
        }
      }
      this.drawingsInfo = drawingsInfo

      this.$nextTick(() => {
        drawPatrolPath(this.drawingsInfo.coordinate, { canvasContext: this.canvasContext }) // 回显绘制路线
      })
    }
    // 图纸树节点点击
    // handleNodeClick(data) {
    //   if (data.drawingsId !== this.currentDrawingsId && data.drawingsId !== '0') {
    //     // console.log(data)
    //     this.currentDrawingsId = data.drawingsId
    //     this.drawingsSwitch() // 图纸信息切换
    //   } else {
    //     // 点击根节点时无交互效果，仍让上一个叶子节点保持高亮选中状态
    //     this.$nextTick(() => {
    //       this.$refs.elTree.setCurrentKey(this.currentDrawingsId)
    //     })
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-dialog__body {
  padding: 20px 20px 30px 20px;
}

.report-con {
  display: flex;
  height: 700px;
  overflow: hidden;
  .con-left {
    flex: 0 0 374px;
    border-right: solid 1px #e5e5e5;
    padding-right: 4px;
    .item {
      display: flex;
      margin-bottom: 24px;
      > div:nth-child(1) {
        flex: 0 0 100px;
      }
      .accessory {
        /deep/ ul li {
          padding-bottom: 10px;
          margin-left: 0px !important;
          span:first-child {
            margin-left: 0px !important;
          }
        }
      }
    }
  }
  .con-right {
    flex: 1;
    overflow: hidden;
    position: relative;
  }
}

/deep/.path-con {
  border: solid 1px #e5e5e5;
  .left {
    position: absolute;
    z-index: 1;
    top: 20px;
    left: 20px;
  }
  .img-con {
    margin: 0;
    background: #fff;
    img {
      border: 0 !important;
    }
  }
}
</style>
