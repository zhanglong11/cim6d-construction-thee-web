<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="form" :model="filterForm" inline>
        <el-form-item prop="keyword">
          <el-input v-model="filterForm.keyword" placeholder="小组名称/巡更人员/创建人" />
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
          <el-button v-if="$hasPower('PatrolGroupAdd')" type="primary" @click="toAddPatrolGroup"
            >新增巡更小组</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->

    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" width="120" title="序号" />
      <vxe-table-column field="groupName" title="巡更小组名称" show-overflow-tooltip />
      <vxe-table-column field="groupLeaderName" title="巡更小组组长" />
      <vxe-table-column field="groupMemberName" title="巡更小组组员" show-overflow-tooltip />
      <vxe-table-column field="creatorName" title="创建人" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column title="操作">
        <template slot-scope="scope">
          <el-button v-if="$hasPower('PatrolGroupEdit')" type="text" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-if="$hasPower('PatrolGroupDelete')" type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>

    <!-- 巡更小组(新增、修改)模态框组件 start -->
    <ModalPatrolGroup v-if="visiblePatrolGroup" :visible.sync="visiblePatrolGroup" :item="item" @refresh="refresh" />
    <!-- 巡更小组(新增、修改)模态框组件 end -->
  </div>
</template>

<script>
import Api from '../api'
import ModalPatrolGroup from './ModalPatrolGroup'
export default {
  components: { ModalPatrolGroup },
  data() {
    return {
      filterForm: {
        keyword: ''
      },
      request(body) {
        return Api.getPatrolGroupList(body)
      },
      visiblePatrolGroup: false,
      item: {}
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
    // 显示新增巡更小组模态框
    toAddPatrolGroup() {
      this.visiblePatrolGroup = true
      this.item = {}
    },
    // 显示修改巡更小组模态框
    handleUpdate(item) {
      this.visiblePatrolGroup = true
      this.item = item
    },
    // 删除巡更小组
    handleDelete(row) {
      this.$confirm('确定要删除该数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Api.deletePatrolGroup(row.patrolGroupId).then(res => {
            this.$message.success('操作成功')
            this.refresh()
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style></style>
