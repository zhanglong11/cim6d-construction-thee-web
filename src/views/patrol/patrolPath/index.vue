<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="form" :model="filterForm" inline>
        <el-form-item prop="keyword">
          <el-input v-model="filterForm.keyword" placeholder="巡更路线名称/创建人" />
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange :start-time.sync="filterForm.startTime" :end-time.sync="filterForm.endTime"></DateRange>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button v-if="$hasPower('PatrolPlathAdd')" type="primary" @click="toAddPatrolPath">新增巡更路线</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->

    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" width="120" title="序号" />
      <vxe-table-column field="routeName" title="巡更路线名称" show-overflow-tooltip />
      <vxe-table-column field="patrolRouteDrawingsNum" title="包含图纸数量(张)" />
      <vxe-table-column field="patrolRouteDrawingsPointNum" title="包含巡更点数量(个)" />
      <vxe-table-column field="creatorName" title="创建人" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column title="操作">
        <template slot-scope="scope">
          <el-button v-if="$hasPower('PatrolPlathEdit')" type="text" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-if="$hasPower('PatrolPlathDelete')" type="text" @click="handleDelete(scope.row)">删除</el-button>
          <el-button v-if="$hasPower('PatrolPlathDetail')" type="text" @click="handleView(scope.row)">查看</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import Api from '../api'
export default {
  data() {
    return {
      filterForm: {
        keyword: ''
      },
      request(body) {
        return Api.getPatrolRouteList(body)
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
    // 跳转新增巡更路线页
    toAddPatrolPath() {
      this.$router.push({ name: 'PatrolPlathAdd' })
    },
    // 跳转修改巡更路线页
    handleUpdate(row) {
      this.$router.push({ name: 'PatrolPlathEdit', params: { id: row.patrolRouteId } })
    },
    // 跳转查看巡更路线页
    handleView(row) {
      this.$router.push({ name: 'PatrolPlathDetail', params: { id: row.patrolRouteId } })
    },
    // 删除巡更路线
    handleDelete(row) {
      this.$confirm('确定要删除该数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Api.deletePatrolRoute(row.patrolRouteId).then(res => {
            this.$message.success('操作成功')
            this.refresh()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
