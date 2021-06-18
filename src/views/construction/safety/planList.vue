<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="filterForm.creatorName" style="width: 360px" placeholder="创建人" />
        </el-form-item>
        <el-form-item label="计划时间">
          <DateRange :startTime.sync="filterForm.planStartTime" :endTime.sync="filterForm.planEndTime"></DateRange>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('SafetyPlanAdd')" type="primary" icon="el-icon-plus" @click="addItem()"
            >新建</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="planNum" title="检查计划编号" width="180"></vxe-table-column>
      <vxe-table-column field="name" title="计划起止时间" width="200">
        <template #default="{ row }"> {{ row.planStartTime | ymd }}~{{ row.planEndTime | ymd }} </template>
      </vxe-table-column>
      <vxe-table-column field="inspectDuration" title="检查周期(天)" width="100"></vxe-table-column>
      <vxe-table-column field="inspectRequirements" title="检查要求" min-width="200"></vxe-table-column>
      <vxe-table-column field="inspectPrincipalName" title="检查人" width="120"></vxe-table-column>
      <vxe-table-column field="inspectNum" title="检查次数" width="120"></vxe-table-column>
      <vxe-table-column field="inspectedNum" title="已检查次数" width="120"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人" width="120"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间" width="150"></vxe-table-column>
      <vxe-table-column field="status" title="状态" width="150">
        <template #default="{ row }">
          {{ $getLabel(statusList, row.status - 0) }}
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="200" fixed="right">
        <template #default="{ row }">
          <!--启用-->
          <template v-if="row.status === 2">
            <el-button
              v-if="$hasPower('SafetyPlanStop') && row.inspectedNum === 0 && userId === row.creator"
              type="text"
              @click="stop(row.id)"
              >停用</el-button
            >
            <el-button
              v-if="
                $hasPower('SafetyPlanInspect') && row.inspectedNum !== row.inspectNum && userId === row.inspectPrincipal
              "
              type="text"
              @click="toDetail(row, true)"
              >检查</el-button
            >
          </template>
          <template v-if="row.status === 1">
            <template v-if="row.inspectedNum === 0 && userId === row.creator">
              <el-button v-if="$hasPower('SafetyPlanStart')" type="text" @click="start(row.id)">启用</el-button>
              <el-button v-if="$hasPower('SafetyPlanEdit')" type="text" @click="addItem(row.id)">编辑</el-button>
              <el-button v-if="$hasPower('SafetyPlanDelete')" type="text" @click="toDelete(row)">删除</el-button>
            </template>
          </template>
          <el-button v-if="$hasPower('SafetyPlanDetail')" type="text" @click="toDetail(row, false)">查看</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <AddPlan v-if="addVisible" :id="rowId" :visible.sync="addVisible" @submit="handleSubmit"></AddPlan>
    <PlanDetail v-if="detailVisible" :id="rowId" :isChecker="isChecker" :visible.sync="detailVisible"></PlanDetail>
  </div>
</template>

<script>
import Api from './api'
import statusList from './lib/statusList'
import AddPlan from './components/addPlan' //添加/编辑弹窗
import PlanDetail from './components/planDetail' //详情
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'SafetyPlanList',
  components: { AddPlan, PlanDetail },
  data() {
    // 这里存放数据
    return {
      projectId: localStorage.getItem('projectId'),
      statusList,
      addVisible: !!+this.$route.query.showAdd || false, //添加弹窗
      detailVisible: false, //详情弹窗
      isChecker: false, //是否是检查者
      rowId: '', //点击的行id
      filterForm: {
        // 查询条件
        creatorName: '',
        planType: 2
      },
      request(body) {
        body.projectId = this.projectId
        return Api.getPlanList(body)
      }
    }
  },
  computed: {
    //登录的用户id
    userId() {
      return this.$store.state.user.id
    }
  },
  beforeCreate() {
    let query = this.$route.query
    if (query.showAdd === '0') {
      this.$router.push({
        name: 'SafetyPlanDetail',
        query: { id: query.targetId }
      })
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    //刷新数据
    refresh() {
      this.$refs.table.refresh()
    },
    //重置搜索
    reset() {
      this.$refs.table.reset()
    },
    // 查看详情
    /*  toDetail(row, isChecker) {
      this.rowId = row.id
      this.isChecker = isChecker
      this.detailVisible = true
    },*/
    toDetail(row, isChecker) {
      this.$router.push({
        name: 'SafetyPlanDetail',
        query: { id: row.id, isChecker: '' + isChecker }
      })
    },
    // 新建/编辑
    addItem(id = '') {
      this.rowId = id
      this.addVisible = true
    },
    //新建或编辑提交
    async handleSubmit(isSave, data) {
      //isSave    true:保存 false:保存并启用  planType:1,质量;2,安全.
      let params = { ...data, planType: 2, projectId: this.projectId }
      let res = isSave ? await Api.savePlan(params) : await Api.saveAndStartPlan(params)
      if (res.code === 200) {
        this.addVisible = false
        await this.refresh()
      }
    },
    // 删除计划 - 异步
    async toDelete(row) {
      let res = await this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作已取消'
        })
      })
      if (res) {
        await Api.deletePlanById([row.id])
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        await this.refresh()
      }
    },
    //停用
    async stop(id) {
      await Api.stopPlanById(id)
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      await this.refresh()
    },
    //停用
    async start(id) {
      await Api.startPlanById(id)
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      await this.refresh()
    }
  }
}
</script>
<style lang="less" scoped></style>
