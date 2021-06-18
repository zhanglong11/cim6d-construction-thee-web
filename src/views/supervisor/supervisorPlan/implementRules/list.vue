<template>
  <div>
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="form" :model="queryForm" inline>
        <el-form-item prop="keyword">
          <el-input
            v-model="queryForm.keyword"
            suffix-icon="el-icon-search"
            placeholder="监理实施细则名称/编制人"
            style="width: 196px"
          ></el-input>
        </el-form-item>
        <!--<el-form-item label="状态" prop="status">
          <el-select v-model="queryForm.status" style="width: 120px">
            <el-option v-for="item in auditStatus" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>-->
        <el-form-item label="创建时间" prop="date">
          <el-date-picker
            v-model="queryForm.date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="请选择"
            end-placeholder="请选择"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            style="width: 330px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('ImplementRulesAdd')" type="primary" icon="el-icon-plus" @click="handleAdd()"
            >新建</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table v-loading="loading" :data="tableData" border stripe size="small">
      <el-table-column type="index" width="120" align="center" label="序号" />
      <el-table-column prop="name" label="监理实施细则名称" show-overflow-tooltip />
      <el-table-column prop="applyRange" label="适用范围" show-overflow-tooltip />
      <el-table-column prop="writer" label="编制人" />
      <el-table-column prop="writerDateStr" label="编制日期" />
      <el-table-column prop="remark" label="备注" show-overflow-tooltip />
      <el-table-column prop="creatorStr" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" />
      <!--<el-table-column prop="status" label="状态">
        <template slot-scope="scope">{{ $getLabel(auditStatus, scope.row.status) }}</template>
      </el-table-column>-->
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 0 && $hasPower('ImplementRulesEdit')"
            type="text"
            size="mini"
            @click="handleEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            v-if="scope.row.status === 0 && $hasPower('ImplementRulesDelete')"
            type="text"
            size="mini"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
          <el-button
            v-if="$hasPower('ImplementRulesDetail')"
            type="text"
            size="mini"
            @click="handleDetail(scope.row.id)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <p class="total">
        共 {{ total }} 条记录 第 {{ queryForm.page }} / {{ Math.ceil(total / queryForm.rows) || 1 }}
        <el-button type="text primary" class="el-icon-refresh" @click="refresh"></el-button>
      </p>
      <el-pagination
        background
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="queryForm.page"
        :page-size="queryForm.rows"
        :page-sizes="$pageConfig.pageSizes"
        @size-change="changePageSize"
        @current-change="changePageNumber"
      />
    </div>

    <!-- 添加监理实施细则模态框 start -->
    <AddImplementRulesDialog
      v-if="addImplementRulesVisible"
      :id="id"
      :visible.sync="addImplementRulesVisible"
      @refresh="
        () => {
          refresh()
        }
      "
    />
    <!-- 添加监理实施细则模态框 end -->

    <!-- 监理实施细则详情 start -->
    <DetailImplementRulesDialog
      v-if="detailImplementRulesVisible"
      :id="id"
      :visible.sync="detailImplementRulesVisible"
    />
    <!-- 监理实施细则详情 end -->
  </div>
</template>

<script>
import Api from '../api/index'
import auditStatus from '../lib/auditStatus'
import AddImplementRulesDialog from './addImplementRulesDialog'
import DetailImplementRulesDialog from './detailImplementRulesDialog'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'ImplementRulesList',
  components: { AddImplementRulesDialog, DetailImplementRulesDialog },
  data() {
    // 这里存放数据
    return {
      auditStatus,
      // 查询条件
      loading: false,
      queryForm: {
        keyword: '',
        // status: undefined,
        date: undefined,
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      tableData: [],
      total: 0,
      addImplementRulesVisible: false,
      detailImplementRulesVisible: false,
      id: ''
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.refresh()
  },
  // 方法集合
  methods: {
    // 查询列表
    async refresh(isFirstPage = true) {
      if (isFirstPage) {
        this.queryForm.page = 1
      }
      this.loading = true
      let startTime = ''
      let endTime = ''
      if (this.queryForm.date) {
        startTime = this.queryForm.date[0]
        endTime = this.queryForm.date[1]
      }
      Api.getImplementRulesList({
        ...this.queryForm,
        startTime,
        endTime
      })
        .then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 搜索
    search() {
      this.refresh()
    },
    // 重置
    reset() {
      this.$refs.form.resetFields()
      this.refresh(true)
    },
    // 新建
    handleAdd() {
      this.addImplementRulesVisible = true
      this.id = ''
    },
    // 编辑
    handleEdit(id) {
      this.addImplementRulesVisible = true
      this.id = id
    },
    // 删除
    handleDelete(id) {
      this.$confirm('确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Api.deleteImplementRules(id).then(() => {
            this.$message.success('删除成功')
            this.refresh()
          })
        })
        .catch(() => {})
    },
    // 查看
    handleDetail(id) {
      this.detailImplementRulesVisible = true
      this.id = id
    },
    // 当前页码改变
    changePageNumber(pageNumber) {
      this.queryForm.page = pageNumber
      this.refresh(false)
    },
    // 每页显示条数改变
    changePageSize(pageSize) {
      this.queryForm.page = 1
      this.queryForm.rows = pageSize
      this.refresh(false)
    }
  }
}
</script>
