<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="form" :model="filterForm" inline>
        <el-form-item prop="keyword">
          <el-input v-model="filterForm.keyword" placeholder="巡更人员" />
        </el-form-item>
        <el-form-item label="巡更路线">
          <el-select v-model="filterForm.patrolRouteId">
            <el-option label="全部" :value="null" />
            <el-option
              v-for="(pathItem, index) in patrolPathList"
              :key="index"
              :label="pathItem.routeName"
              :value="pathItem.patrolRouteId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="巡更结果">
          <el-select v-model="filterForm.patrolResult">
            <el-option label="全部" :value="null" />
            <el-option label="正常" :value="true" />
            <el-option label="异常" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="巡更时间">
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
          <el-button v-if="$hasPower('PatrolPlanAdd')" type="primary" @click="toAddPatrolPlan">新增巡更计划</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->

    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" width="80" title="序号" />
      <vxe-table-column field="time" title="巡更时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.patrolStartTime + '~' + scope.row.patrolEndTime }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="path" title="巡更路线" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button v-if="$hasPower('PatrolPlanPathDetail')" type="text" @click="handleDetail(scope.row)">{{
            scope.row.routeName
          }}</el-button>
        </template>
      </vxe-table-column>
      <vxe-table-column field="groupMemberName" title="巡更人员" show-overflow-tooltip />
      <vxe-table-column title="巡更结果">
        <template slot-scope="scope">
          <span v-if="scope.row.patrolResult === null"></span>
          <span v-else-if="scope.row.patrolResult === true">正常</span>
          <span v-else>异常</span>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作">
        <template slot-scope="scope">
          <template v-if="scope.row.patrolResult === null">
            <el-button v-if="$hasPower('PatrolPlanUploadReport')" type="text" @click="handleReport(scope.row)"
              >上传报告</el-button
            >
            <el-button v-if="$hasPower('PatrolPlanEdit')" type="text" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button v-if="$hasPower('PatrolPlanDelete')" type="text" @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
          <el-button
            v-if="$hasPower('PatrolPlanViewReport') && scope.row.patrolResult !== null"
            type="text"
            @click="handleViewReport(scope.row)"
            >查看报告</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>

    <!-- 巡更计划(新增、修改)模态框组件 start -->
    <ModalPatrolPlan
      :visible.sync="visiblePatrolPlan"
      :item="item"
      :patrolPathList="patrolPathList"
      :patrolGroupList="patrolGroupList"
      @refresh="refresh"
    />
    <!-- 巡更计划(新增、修改)模态框组件 end -->

    <!-- 上传报告模态框组件 start -->
    <ModalReport v-if="visibleReport" :visible.sync="visibleReport" :patrolId="patrolId" @refresh="refresh" />
    <!-- 上传报告模态框组件 end -->

    <!-- 查看报告模态框组件 start -->
    <ModalViewReport v-if="visibleViewReport" :visible.sync="visibleViewReport" :patrolId="patrolId" />
    <!-- 查看报告模态框组件 end -->
  </div>
</template>

<script>
import ModalPatrolPlan from './ModalPatrolPlan'
import ModalReport from './ModalReport'
import ModalViewReport from './ModalViewReport'
import Api from '../api'
export default {
  components: { ModalPatrolPlan, ModalReport, ModalViewReport },
  data() {
    return {
      filterForm: {
        keyword: '',
        patrolRouteId: undefined
      },
      request(body) {
        return Api.getPatrolPlanList(body)
      },
      visiblePatrolPlan: false,
      item: {},
      visibleReport: false,
      patrolId: '',
      visibleViewReport: false,
      patrolPathList: [], // 巡更路线列表
      patrolGroupList: [] // 巡更小组列表
    }
  },
  mounted() {
    // 获取巡更路线集合
    Api.getPatrolRouteList({}).then(res => {
      if (res.data && res.data.records && res.data.records.length) {
        this.patrolPathList = res.data.records
      }
    })

    // 获取巡更小组集合
    Api.getPatrolGroupList({}).then(res => {
      if (res.data && res.data.records && res.data.records.length) {
        this.patrolGroupList = res.data.records
      }
    })
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
    // 上传报告
    handleReport(item) {
      this.visibleReport = true
      this.patrolId = item.patrolId
    },
    // 显示新增巡更计划模态框
    toAddPatrolPlan() {
      this.visiblePatrolPlan = true
      this.item = {}
    },
    // 显示修改巡更计划模态框
    handleUpdate(item) {
      this.visiblePatrolPlan = true
      this.item = item
    },
    // 删除巡更计划
    handleDelete(item) {
      this.$confirm('确定要删除该数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Api.deletePatrolPlan(item.patrolId).then(res => {
            this.$message.success('操作成功')
            this.refresh()
          })
        })
        .catch(() => {})
    },
    // 查看报告
    handleViewReport(item) {
      this.visibleViewReport = true
      this.patrolId = item.patrolId
    },
    // 跳转路线详情页
    handleDetail(item) {
      this.$router.push({ name: 'PatrolPlathDetail', params: { id: item.patrolRouteId } })
    }
  }
}
</script>

<style lang="less" scoped></style>
