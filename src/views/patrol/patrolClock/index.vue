<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="form" :model="filterForm" inline>
        <el-form-item prop="keyword">
          <el-input v-model="filterForm.keyword" placeholder="打卡地点/打卡人" />
        </el-form-item>
        <el-form-item label="打卡时间">
          <DateRange :start-time.sync="filterForm.startTime" :end-time.sync="filterForm.endTime"></DateRange>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" width="120" title="序号" />
      <vxe-table-column field="clockInPlace" title="打卡地点" show-overflow-tooltip />
      <vxe-table-column field="patrolLocationName" title="巡更点名称" />
      <vxe-table-column field="remark" title="备注" />
      <vxe-table-column field="creatorName" title="打卡人" />
      <vxe-table-column field="clockTime" title="打卡时间" />
      <vxe-table-column title="操作">
        <template slot-scope="scope">
          <el-button v-if="$hasPower('ClockDetail')" type="text" @click="handleView(scope.row)">详情</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import Api from '../api'
export default {
  name: 'PatrolClock',
  data() {
    return {
      filterForm: {
        keyword: ''
      },
      request(body) {
        return Api.getClockList(body)
      }
    }
  },
  methods: {
    // 刷新数据
    refresh() {
      this.$refs.table.refresh()
    },
    // 重置搜索
    reset() {
      this.$refs.table.reset()
    },
    //
    handleView(row) {
      this.$router.push({ name: `ClockDetail`, params: { id: row.patrolClockInId } })
    }
  }
}
</script>
