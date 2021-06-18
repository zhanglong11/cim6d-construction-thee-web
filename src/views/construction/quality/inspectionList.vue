<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline :model="filterForm">
        <el-form-item>
          <el-input v-model="filterForm.search" style="width: 360px" placeholder="施工负责人/创建人" />
        </el-form-item>
        <el-form-item label="计划验收时间:">
          <DateRange
            :startTime.sync="filterForm.acceptanceStartDate"
            :endTime.sync="filterForm.acceptanceEndDate"
          ></DateRange>
        </el-form-item>
        <el-form-item label="状态" label-width="100px" prop="supplyStatus" style="margin-right: 20px">
          <el-select v-model="filterForm.status" placeholder="请选择">
            <el-option
              v-for="item in inspectStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('QualityInspectionListAdd')" type="primary" icon="el-icon-plus" @click="addItem()"
            >新建</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="acceptanceName" title="验收名称"></vxe-table-column>
      <vxe-table-column field="acceptanceDate" title="计划验收时间">
        <template #default="{ row }">
          {{ row.acceptanceDate | ymd }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="constructionDirectorName" title="施工负责人"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column field="status" title="状态">
        <template #default="{ row }">
          {{ $getLabel(inspectStatus, row.status - 0) }}
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="150" fixed="right">
        <template #default="{ row }">
          <template v-if="row.status < 1">
            <el-button v-if="$hasPower('QualityInspectionListEdit')" type="text" @click="addItem(row.id)"
              >编辑</el-button
            >
            <el-button v-if="$hasPower('QualityInspectionListDelete')" type="text" @click="toDelete(row)"
              >删除</el-button
            >
          </template>
          <el-button v-if="$hasPower('QualityInspectionDetail')" type="text" @click="toDetail(row)">查看</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <AddInspection v-if="addVisible" :id="rowId" :visible.sync="addVisible"></AddInspection>
  </div>
</template>

<script>
import Api from './api'
import inspectStatus from './lib/inspectStatus'
import AddInspection from './components/addInspection' //添加/编辑弹窗
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'QualityInspectionList',
  components: { AddInspection },
  data() {
    // 这里存放数据
    return {
      inspectStatus, //验收状态
      addVisible: !!+this.$route.query.showAdd || false, //添加弹窗
      detailVisible: false, //详情弹窗
      rowId: '', //点击的行id
      loading: false,
      filterForm: {},
      request(body) {
        body.projectId = localStorage.getItem('projectId')
        return Api.getInspectionList(body)
      }
    }
  },
  beforeCreate() {
    let query = this.$route.query
    if (!+this.$route.query.showAdd && !!+this.$route.query.isDetail) {
      this.$router.replace({ name: 'QualityInspectionDetail', query: { id: query.targetId, isCheck: query.isCheck } })
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    console.log(this.addVisible)
  },
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
    toDetail(row) {
      this.$router.push({ name: 'QualityInspectionDetail', query: { id: row.id } })
    },
    // 新建/编辑
    addItem(id = '') {
      this.rowId = id
      this.addVisible = true
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
        await Api.deleteInspectionById([row.id])
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        await this.refresh()
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
