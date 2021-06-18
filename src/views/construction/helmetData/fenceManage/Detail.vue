<template>
  <div class="is-footer">
    <div class="wrap">
      <el-card class="aside">
        <div class="left-desc">
          <el-row>
            <el-col :md="24">
              <span class="label">电子围栏名称：</span>
              <span class="label-content">{{ detailInfo.name }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24">
              <span class="label">围栏类型：</span>
              <span class="label-content">{{ detailInfo.type === 1 ? '圆形' : '多边形' }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24">
              <span class="label">半径：</span>
              <!-- <span class="label-content">{{ 1 }}</span> -->
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24">
              <span class="label">围栏行为：</span>
              <span class="label-content">{{ detailInfo.type1 === 0 ? '禁止离开' : '禁止进入' }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24">
              <span class="label">报警次数：</span>
              <span class="label-content">{{ detailInfo.railSosCount }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24">
              <span class="label">报警时间：</span>
              <span class="label-content">{{ detailInfo.railTime }}</span>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card style="flex: 1" class="gantt-card">
        <div style="width: 900px; height: 700px">
          <!-- 地图 -->
          <OLMap
            ref="olmap"
            edit
            multipleEdit
            style="height: 500px"
            :multiplePoint.sync="mapData.multiplePoint"
          ></OLMap>
        </div>
      </el-card>
    </div>
    <div class="footer-btn">
      <el-button @click="$router.back()">返回</el-button>
    </div>
  </div>
</template>
<script>
import Api from '../api'
import OLMap from '../component/index'
// import Map from '../../../project/components/Map'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'FenceDetail',
  components: { OLMap },
  data() {
    // 这里存放数据
    return {
      dialogVisible: true,
      detailInfo: {},
      id: this.$route.query.id,
      railTimes: [],
      mapData: {
        color: '#ff0000',
        multiplePoint: []
      }
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    if (this.id) {
      this.getFenceDetail()
    }
  },
  // 方法集合
  methods: {
    // 获取验收规范详情
    getFenceDetail() {
      Api.getFenceDetail(this.id).then(res => {
        this.detailInfo = res.data
        this.detailInfo.eara = JSON.parse(this.detailInfo.eara)
        this.detailInfo.eara = _.flattenDeep(
          this.detailInfo.eara.map(item => {
            return [item.x_point, item.y_point]
          })
        )
        // this.detailInfo.eara = _.join(this.detailInfo.eara)
        this.detailInfo.railTime = JSON.parse(this.detailInfo.railTime).toString()
        const multiplePoint = []
        multiplePoint.push({
          id: this.detailInfo.id,
          color: `#409eff`,
          points: this.detailInfo.eara
        })
        this.mapData.multiplePoint = multiplePoint
      })
    },
    handleDetail() {}
  }
}
</script>
<style lang="less" scoped>
.wrap {
  display: flex;
  .aside {
    margin-right: 20px;
    width: 40%;
    /deep/ .el-card__body {
      padding: 0;
    }
    .left-desc {
      padding: 50px;
      /deep/.el-row {
        margin-bottom: 20px;
        .label {
          color: #999;
        }
      }
    }
  }
}
</style>
