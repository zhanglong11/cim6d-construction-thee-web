<template>
  <div class="is-footer">
    <div class="wrap">
      <el-card class="aside">
        <el-table ref="table" class="table" max-height="580" stripe :data="detailData">
          <el-table-column type="index" label="序号" align="center" show-overflow-tooltip />
          <el-table-column prop="createTime" label="时间" align="center" show-overflow-tooltip />
          <el-table-column prop="userName" label="姓名" align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="sosType" label="原因" align="center">
            <template #default="{ row }">
              {{ $getLabel(sosType, row.sosType) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right" align="center">
            <template #default="{ row }">
              <el-button type="text" size="mini" @click="handleDetail(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card style="flex: 1" class="gantt-card">
        <div style="width: 900px; height: 700px">
          <!-- 地图 -->
          <OLMap
            ref="olmap"
            edit
            style="height: 500px"
            :multiplePoint.sync="mapData.multiplePoint"
            multiple
            multipleEdit
            :addressData="addressData"
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
// import Map from '../../../project/components/Map'
import OLMap from '../component/index'
import { sosType } from '../lib/sosType'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'AlarmManageDetail',
  components: { OLMap },
  data() {
    // 这里存放数据
    return {
      sosType,
      deviceNum: this.$route.query.id || '',
      detailData: [],
      address: '',
      mapData: {
        color: '#ff0000',
        multiplePoint: []
      },
      addressData: {}
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    if (this.deviceNum) {
      Api.getSosList({ deviceNum: this.deviceNum }).then(res => {
        this.detailData = res.data.records
        // const multiplePoint = []
        // multiplePoint.push({
        //   id: this.detailInfo.id,
        //   color: `#409eff`,
        //   points: this.detailInfo.eara
        // })
        // this.mapData.multiplePoint = multiplePoint
      })
    }
  },
  // 方法集合
  methods: {
    handleDetail(row) {
      this.addressData = row
    }
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
  }
}
</style>
