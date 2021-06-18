<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="filterForm.search" style="width: 360px" placeholder="检查人" />
        </el-form-item>
        <el-form-item label="检查时间">
          <DateRange :startTime.sync="filterForm.startDate" :endTime.sync="filterForm.endDate"></DateRange>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status">
            <el-option
              v-for="(item, index) of statusList"
              :key="'ss' + index"
              :value="item.value"
              :label="item.label"
            ></el-option
          ></el-select>
        </el-form-item>
        <el-form-item label="检查性质">
          <el-select v-model="filterForm.inspectNature">
            <el-option
              v-for="(item, index) of inspectNatureList"
              :key="'ssn' + index"
              :value="item.value"
              :label="item.label"
            ></el-option
          ></el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('QualityIssueAdd')" type="primary" icon="el-icon-plus" @click="addItem(null)"
            >新建</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="problemArea" title="问题部位" min-width="150"></vxe-table-column>
      <vxe-table-column field="problemDesc" title="问题描述" min-width="200"></vxe-table-column>
      <vxe-table-column field="status" title="检查性质" width="150">
        <template #default="{ row }">
          {{ $getLabel(inspectNatureList, row.inspectNature - 0) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="creatorName" title="检查人" width="120"></vxe-table-column>
      <vxe-table-column field="inspectTime" title="检查时间" width="150"></vxe-table-column>
      <vxe-table-column field="rectifyPrincipalName" title="整改人" width="120"></vxe-table-column>
      <vxe-table-column field="rectifyDeadline" title="整改期限" width="150">
        <template #default="{ row }">
          {{ row.rectifyDeadline | ymd }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="reviewPrincipalName" title="复检人" width="120"></vxe-table-column>
      <vxe-table-column field="reviewTime" title="复检时间" width="150"></vxe-table-column>
      <vxe-table-column field="status" title="状态" width="150">
        <template #default="{ row }">
          {{ $getLabel(statusList, row.status - 0) }}
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="200" fixed="right">
        <template #default="{ row }">
          <template v-if="row.status === 0 && userId === row.creator">
            <el-button v-if="$hasPower('QualityIssueRelease')" type="text" @click="handleRelease(row)">下达</el-button>
            <el-button v-if="$hasPower('QualityIssueEdit')" type="text" @click="addItem(row)">编辑</el-button>
            <el-button v-if="$hasPower('QualityIssueDelete')" type="text" @click="toDelete(row)">删除</el-button>
          </template>
          <template v-if="$hasPower('QualityIssueRectify') && row.status === 1 && userId === row.rectifyPrincipal">
            <el-button type="text" @click="toDetail(row, 'rectify')">整改</el-button>
          </template>
          <template v-if="$hasPower('QualityIssueReview') && row.status === 2">
            <el-button type="text" @click="toDetail(row, 'review')">复查</el-button>
          </template>
          <el-button v-if="$hasPower('QualityIssueDetail')" type="text" @click="toDetail(row, '')">查看</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <AddIssue
      v-if="addVisible"
      :id="rowId"
      :visible.sync="addVisible"
      :tableData="rowTableData"
      :viewType="viewType"
      @submit="handleSubmit"
    ></AddIssue>
    <QualityIssueDetail
      v-if="detailVisible"
      :id="rowId"
      :viewType="viewType"
      :visible.sync="detailVisible"
    ></QualityIssueDetail>
  </div>
</template>

<script>
import Api from './api'
import statusList from './lib/issueStatusList'
import AddIssue from './components/addIssue' //添加/编辑弹窗
import QualityIssueDetail from './components/qualityIssueDetail' //详情
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'QualityIssueList',
  components: { AddIssue, QualityIssueDetail },
  data() {
    // 这里存放数据
    return {
      projectId: localStorage.getItem('projectId'),
      statusList,
      viewType: '', //传给详情的type 是复查还是整改
      inspectNatureList: [
        { value: 1, label: '计划检查' },
        { value: 2, label: '日常巡检' }
      ],
      addVisible: !!+this.$route.query.showAdd || false, //添加弹窗
      detailVisible: false, //详情弹窗
      rowId: '', //点击的行id
      rowTableData: [], //点击编辑时传递的默认数据
      filterForm: {
        inspectType: 1,
        // 查询条件
        search: ''
      },
      request(body) {
        body.projectId = this.projectId
        return Api.getIssueList(body)
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
        name: 'QualityIssueDetail',
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
    /*toDetail(row, type) {
      this.rowId = row.id
      this.viewType = type
      this.detailVisible = true
    },*/
    toDetail(row, type) {
      this.$router.push({
        name: 'QualityIssueDetail',
        query: { id: row.id, viewType: type }
      })
    },
    // 新建/编辑
    async addItem(row) {
      let id = (row && row.id) || ''
      this.rowId = id
      if (id) {
        let res = await Api.getIssueDetailById(id)
        this.rowTableData = [{ ...row, projectId: this.projectId, inspectType: 1, fileId: res.data.fileId }]
      } else {
        this.rowTableData = []
      }
      this.addVisible = true
    },
    //新建或编辑提交
    async handleSubmit(isSave, data) {
      //isSave    true:保存 false:保存并下达
      let res = isSave ? await Api.saveIssue(data) : await Api.saveAddReleaseIssue(data)
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
        await Api.deleteIssueById([row.id])
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        await this.refresh()
      }
    },
    //下达
    async handleRelease(row) {
      await Api.releaseIssueById(row.id)
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
