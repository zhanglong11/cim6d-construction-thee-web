<template>
  <div>
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="form" :model="filterForm" inline>
        <el-form-item prop="content">
          <el-input
            v-model="filterForm.content"
            suffix-icon="el-icon-search"
            placeholder="监理月报名称/编制人/创建人"
            style="width: 230px"
          ></el-input>
        </el-form-item>
        <el-form-item label="年度" prop="date">
          <el-date-picker v-model="filterForm.year" type="year" value-format="yyyy" placeholder="请选择" />
        </el-form-item>
        <el-form-item label="月份" prop="date">
          <SelectList v-model="filterForm.month" :self-list="monthList" :has-all-option="false" />
          <!--          <el-date-picker-->
          <!--            v-model="filterForm.monthly"-->
          <!--            type="month"-->
          <!--            value-format="yyyy-MM"-->
          <!--            placeholder="请选择"-->
          <!--            @input="getMonth"-->
          <!--          />-->
        </el-form-item>
        <el-form-item label="创建时间" prop="date">
          <DateRange :startTime.sync="filterForm.createStartTime" :endTime.sync="filterForm.createEndTime"></DateRange>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="$hasPower('SupervisionRecordMonthlyAdd')"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd()"
            >新建监理月报</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="name" title="监理月报名称" show-overflow-tooltip />
      <vxe-table-column field="year" title="年度" />
      <vxe-table-column field="month" title="月份" min-width="80">
        <template slot-scope="{ row }">
          <span>{{ row.month }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="writerName" title="编制人" min-width="80" />
      <vxe-table-column field="writeDate" title="编制日期" min-width="80" />
      <vxe-table-column field="remark" title="备注" min-width="80" />
      <vxe-table-column field="creatorName" title="创建人" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column title="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="$hasPower('SupervisionRecordMonthlyDetail')"
            type="text"
            size="mini"
            @click="handleDetail(scope.row.id)"
            >查看</el-button
          >
          <el-button
            v-if="$hasPower('SupervisionRecordMonthlyEdit')"
            type="text"
            size="mini"
            @click="handleEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            v-if="$hasPower('SupervisionRecordMonthlyDelete')"
            type="text"
            size="mini"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>
    <!-- 添加监理日志模态框 start -->
    <AddDialog
      v-if="addVisible"
      :id="id"
      :visible.sync="addVisible"
      @refresh="
        () => {
          refresh()
        }
      "
    />
    <!-- 添加监理日志模态框 end -->

    <!-- 监理日志详情 start -->
    <DetailDialog v-if="detailVisible" :id="id" :visible.sync="detailVisible" />
    <!-- 监理日志详情 end -->
  </div>
</template>

<script>
import Api from '../api'
import AddDialog from './addDialog'
import DetailDialog from './detailDialog'
import monthList from '../lib/monthList'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'SupervisionRecordMonthly',
  components: { AddDialog, DetailDialog },
  data() {
    // 这里存放数据
    return {
      // 查询条件
      loading: false,
      monthList,
      filterForm: {
        content: '',
        status: undefined,
        date: undefined,
        page: 1,
        rows: this.$pageConfig.pageSize,
        projectId: this.$store.state.project.projectId
      },
      request(body) {
        body.projectId = localStorage.getItem('projectId')
        return Api.getMonthlyList(body)
      },
      tableData: [],
      total: 0,
      addVisible: false,
      detailVisible: false,
      id: ''
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    // 查询列表
    refresh() {
      this.$refs.table.refresh()
    },
    // 搜索
    search() {
      if (this.filterForm.month && !this.filterForm.year) {
        this.$message.info('请先选择年份')
        return
      }
      this.refresh()
    },
    // 重置
    reset() {
      this.$refs.table.reset()
    },
    // 新建
    handleAdd() {
      this.addVisible = true
      this.id = ''
    },
    // 编辑
    handleEdit(id) {
      this.addVisible = true
      this.id = id
    },
    //获取月份
    getMonth(e) {
      this.filterForm.month = e.split('-')[1]
    },
    // 删除
    handleDelete(id) {
      this.$confirm('确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Api.getMonthlyDelete([id]).then(res => {
            if (res.code === 200) {
              this.$message.info('删除成功')
            }
          })
          this.refresh()
        })
        .catch(() => {})
    },
    // 查看
    handleDetail(id) {
      this.detailVisible = true
      this.id = id
    }
  }
}
</script>
