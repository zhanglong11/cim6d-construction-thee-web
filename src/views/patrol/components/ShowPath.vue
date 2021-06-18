<template>
  <div class="path-con">
    <div v-if="treeData.length > 0" class="left">
      <div class="block-card">
        <div class="top">
          <div class="top-middle">
            <div class="title">
              <span class="card-dot"></span>
              巡更路线列表
            </div>
          </div>
          <div class="top-right"></div>
        </div>
        <div class="middle">
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
    </div>
    <div :id="pathId" class="right">
      <div class="block-card">
        <div class="top">
          <div class="top-middle">
            <div class="title">
              <span class="card-dot"></span>
              巡更路线
            </div>
          </div>
          <div class="top-right"></div>
        </div>
        <div class="middle">
          <div class="img-con">
            <div v-if="isLegend" class="legend">
              <span class="plan">计划巡更点位</span>
              <span class="actual">实际巡更点位</span>
            </div>
            <img
              v-if="drawingsInfo.imgUrl"
              :src="drawingsInfo.imgUrl"
              :style="`width: ${canvasParams.width}px;height: ${canvasParams.height}px;`"
            />
            <canvas :id="canvasId" :width="canvasParams.width" :height="canvasParams.height"></canvas>
          </div>
        </div>
      </div>
    </div>
    <DialogPatrolRecord :visible.sync="dialogVisible" :dataValue="dialogData" />
  </div>
</template>

<script>
import { drawPatrolPath } from './drawPatrolPath'
import DialogPatrolRecord from '@/views/bimSynergy/internet/components/DialogPatrolRecord' // 点位巡更记录 模态框
export default {
  components: {
    DialogPatrolRecord
  },
  props: {
    pathId: {
      type: String,
      default: 'PathCon'
    },
    canvasId: {
      type: String,
      default: 'canvas_path'
    },
    isLegend: {
      type: Boolean,
      default: true
    },
    treeData: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    //这里存放数据
    return {
      drawingsInfo: {
        imgUrl: '',
        coordinate: []
      },
      canvasContext: null,
      canvasParams: {
        width: 800,
        height: 600
      },
      canvasParamsBack: {},
      scaleSize: 1,
      dialogVisible: false,
      dialogData: {},
      pathRead: false
    }
  },
  watch: {
    treeData(array) {
      if (array.length > 0) {
        setTimeout(() => {
          this.init()
        }, 100)

        setTimeout(() => {
          let item = array[0].children[0]
          this.$nextTick(() => {
            this.$refs.elTree.setCurrentKey(item.drawingsId) // 默认选中第一个节点
            this.drawingsSwitch(item)
            this.pathRead = true
          })
        }, 300)
      }
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.$nextTick(() => {
      // this.init()
    })
  },
  //方法集合
  methods: {
    // 初始化画布，仅初始一次
    init() {
      Object.assign(this.canvasParamsBack, this.canvasParams)
      let pathConWidth = document.getElementById(this.pathId).offsetWidth
      const canvas = document.getElementById(this.canvasId)
      console.log(1111, this.pathId, pathConWidth, document.getElementById(this.pathId))
      this.canvasContext = canvas.getContext('2d')
      this.canvasContext.lineWidth = 2
      this.canvasContext.lineColor = 'red'
      let scaleSize = (pathConWidth / this.canvasParamsBack.width) * 0.95
      this.scaleSize = scaleSize
      this.canvasParams.width = this.canvasParamsBack.width * scaleSize
      this.canvasParams.height = this.canvasParamsBack.height * scaleSize
    },
    // 图纸信息切换
    drawingsSwitch(item) {
      let drawingsInfo = {
        imgUrl: item.imgUrl || '', // 展示图片
        coordinate: [], // 存放路线点坐标
        coordinateColors: [] // 存放路线点颜色
      }
      if (!item.imgUrl) {
        return
      }
      let pointList = item.pointList || []
      pointList.map(e => {
        let coordinateArray = e.patrolPointLocation.split(',')
        let coordinateX = parseFloat(coordinateArray[0] * this.scaleSize)
        let coordinateY = parseFloat(coordinateArray[1] * this.scaleSize)
        drawingsInfo.coordinate.push([coordinateX, coordinateY]) // 字符串坐标需要转换成数字类型
        drawingsInfo.coordinateColors.push(e.actual ? '#1296db' : '#f00')
      })
      this.drawingsInfo = Object.assign({}, drawingsInfo)

      this.$nextTick(() => {
        drawPatrolPath(this.drawingsInfo.coordinate, {
          canvasContext: this.canvasContext,
          width: this.canvasParams.width,
          height: this.canvasParams.height,
          colors: this.drawingsInfo.coordinateColors
        }) // 回显绘制路线
        let self = this

        this.canvasContext.canvas.addEventListener('click', function (e) {
          function checkBoundary({ x, y, coordinateX, coordinateY }) {
            let w = 8
            // 判断边界方法
            return x + w > coordinateX && x < coordinateX + w && y + w > coordinateY && y < coordinateY + w
          }
          self.drawingsInfo.coordinate.map((f, index) => {
            let obj = { x: e.offsetX, y: e.offsetY, coordinateX: f[0], coordinateY: f[1] }
            if (checkBoundary(obj)) {
              self.dialogVisible = true
              let dialogData = Object.assign({}, item.pointList[index], {
                routeName: item.routeName,
                drawingsName: item.drawingsName
              })
              self.dialogData = dialogData
              // console.log('增加点击事件------', index, item, item.pointList[index], dialogData)
            }
          })
        })
      })
    },
    // 图纸树节点点击
    handleNodeClick(data) {
      console.log('图纸树节点点击', data)
      this.drawingsSwitch(data) // 图纸信息切换
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/views/bimSynergy/common.less');
.block-card {
  flex: 1;
  .top-middle {
    display: none;
    /deep/.el-tree {
      flex: 1;
    }
  }
}
.path-con {
  display: flex;
  height: 100%;
  flex: 1;
  .left {
    width: 380px;
    padding-right: 16px;
    display: flex;
  }
  .right {
    flex: 1;
    display: flex;
    overflow: hidden;
    position: relative;
    .legend {
      padding: 0 10px;
      position: absolute;
      top: 10px;
      left: 50%;
      margin-left: -150px;
      color: #fff;
      display: flex;
      align-items: center;
      span {
        margin: 10px;
        padding: 0 10px 0 6px;
        display: flex;
        align-items: center;
        font-size: 12px;
        background: rgba(135, 159, 185, 0.2);
        border-radius: 12px;
        height: 28px;
        &:before {
          margin-right: 10px;
          content: '';
          width: 10px;
          height: 10px;
          background: #f00;
          border-radius: 50%;
        }
        &.actual {
          &:before {
            background: #1296db;
          }
        }
      }
    }
    .img-con {
      font-size: 0px;
      position: relative;
      overflow: auto;
      img {
        object-fit: contain;
      }
      canvas {
        position: absolute;
        top: 0px;
        left: 0px;
      }
    }
  }
}
</style>
