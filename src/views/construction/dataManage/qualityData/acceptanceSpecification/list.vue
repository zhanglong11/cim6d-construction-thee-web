<template>
  <div>
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="form" :model="queryForm" inline>
        <el-form-item prop="search">
          <el-input
            v-model="queryForm.search"
            suffix-icon="el-icon-search"
            placeholder="规范名称/规范编号/创建人"
            style="width: 206px"
          ></el-input>
        </el-form-item>
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
        <el-form-item label="类别" prop="category">
          <el-select v-model="queryForm.category" style="width: 120px">
            <el-option v-for="item in norm" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="$hasPower('AcceptanceSpecificationAdd')"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd()"
            >新建</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table v-loading="loading" :data="tableData" border stripe size="small">
      <el-table-column type="index" width="120" align="center" label="序号" />
      <el-table-column prop="specificationNumber" label="规范编号" show-overflow-tooltip />
      <el-table-column prop="specificationName" label="规范名称" show-overflow-tooltip />
      <el-table-column label="类别">
        <template slot-scope="scope">
          <span>{{ $getLabel(norm, scope.row.category) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="creatorName" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="$hasPower('AcceptanceSpecificationEdit')"
            type="text"
            size="mini"
            @click="handleEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            v-if="$hasPower('AcceptanceSpecificationDelete')"
            type="text"
            size="mini"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
          <el-button
            v-if="$hasPower('AcceptanceSpecificationDetail')"
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

    <!-- 添加验收规范模态框 start -->
    <AddAcceptanceDialog
      v-if="addAcceptanceVisible"
      :id="id"
      :visible.sync="addAcceptanceVisible"
      @refresh="
        () => {
          refresh()
        }
      "
    />
    <!-- 添加验收规范模态框 end -->

    <!-- 验收规范详情 start -->
    <DetailAcceptanceDialog v-if="detailAcceptanceVisible" :id="id" :visible.sync="detailAcceptanceVisible" />
    <!-- 验收规范详情 end -->
  </div>
</template>

<script>
import Api from '../../api/index'
import norm from './lib/norm'
import AddAcceptanceDialog from './addAcceptanceDialog'
import DetailAcceptanceDialog from './detailAcceptanceDialog'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'AcceptanceSpecificationList',
  components: { AddAcceptanceDialog, DetailAcceptanceDialog },
  data() {
    // 这里存放数据
    return {
      norm,
      // 查询条件
      loading: false,
      queryForm: {
        search: '',
        date: undefined,
        category: undefined,
        projectId: localStorage.getItem('projectId'),
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      tableData: [],
      total: 0,
      addAcceptanceVisible: !!+this.$route.query.showAdd || false,
      detailAcceptanceVisible: false,
      id: ''
    }
  },
  beforeCreate() {
    let query = this.$route.query
    if (query.showAdd === '0') {
      this.handleDetail(query.targetId)
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
      let beginTime = ''
      let endTime = ''
      if (this.queryForm.date) {
        beginTime = this.queryForm.date[0]
        endTime = this.queryForm.date[1]
      }
      Api.getCheckSpecificList({
        ...this.queryForm,
        beginTime,
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
      /*this.$router.push({
        path: '/dataManage/qualityData/acceptanceSpecificationAdd'
      })*/
      this.addAcceptanceVisible = true
      this.id = ''
    },
    // 编辑
    handleEdit(id) {
      /*this.$router.push({
        name: 'AcceptanceSpecificationEdit',
        params: { id: id }
      })*/
      this.addAcceptanceVisible = true
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
          Api.deleteCheckSpecific(id).then(() => {
            this.$message.success('删除成功')
            this.refresh()
          })
        })
        .catch(() => {})
    },
    // 查看
    handleDetail(id) {
      /*this.$router.push({
        name: 'AcceptanceSpecificationDetail',
        params: { id: id }
      })*/
      this.detailAcceptanceVisible = true
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

<style lang="less" scoped></style>
