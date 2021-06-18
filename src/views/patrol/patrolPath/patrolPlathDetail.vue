<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div class="header-info">路线名称：{{ detailData.routeName }}</div>
      <div class="header-info">路线详情：</div>
      <ShowPath :treeData="treeData" />
    </el-card>

    <div class="footer-btn">
      <el-button @click="handleBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import ShowPath from '../components/ShowPath'
import Api from '../api'
export default {
  components: {
    ShowPath
  },
  data() {
    return {
      id: this.$route.params.id || '',
      detailData: {},
      treeData: []
    }
  },
  async mounted() {
    if (this.id) {
      this.getPatrolRouteDetail(this.id)
    }
  },
  methods: {
    // 获取巡更路线详情
    getPatrolRouteDetail(id) {
      Api.getPatrolRouteDetail(id).then(res => {
        // console.log(res)
        if (res.data) {
          let datas = res.data
          this.detailData = datas
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
            item.id = item.drawingsId
            item.label = item.drawingsName
            item.imgUrl = item.modelUrl
            item.children = []
            item.pointList.map((e, i) => {
              e.actual = i < 2
            })
          })
          treeData[0].children = patrolRouteDrawingsList
          this.treeData = treeData // 初始左侧图纸树
        }
      })
    },
    // 返回
    handleBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.header-info {
  font-size: 14px;
  margin-bottom: 14px;
}
</style>
