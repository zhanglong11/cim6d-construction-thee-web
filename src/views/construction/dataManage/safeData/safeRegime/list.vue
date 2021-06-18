<template>
  <div>
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="form" :model="queryForm" inline>
        <el-form-item prop="keyWords">
          <el-input
            v-model="queryForm.keyWords"
            suffix-icon="el-icon-search"
            placeholder="资料名称/资料编号/创建人"
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
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('SafeRegimeAdd')" type="primary" icon="el-icon-plus" @click="handleAdd()"
            >新建安全资料</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table v-loading="loading" :data="tableData" border stripe size="small">
      <el-table-column type="index" width="120" align="center" label="序号" />
      <el-table-column prop="regimeName" label="资料名称" show-overflow-tooltip />
      <el-table-column prop="regimeNumber" label="资料编号" show-overflow-tooltip />
      <el-table-column prop="regimeContent" label="资料内容" show-overflow-tooltip />
      <el-table-column prop="remark" label="备注" show-overflow-tooltip />
      <el-table-column prop="creatorName" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button v-if="$hasPower('SafeRegimeEdit')" type="text" size="mini" @click="handleEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button v-if="$hasPower('SafeRegimeDelete')" type="text" size="mini" @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
          <el-button v-if="$hasPower('SafeRegimeDetail')" type="text" size="mini" @click="handleDetail(scope.row.id)"
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

    <!-- 添加安全管理制度模态框 start -->
    <AddSafeRegimeDialog
      v-if="addSafeRegimeDialogVisible"
      :id="id"
      :visible.sync="addSafeRegimeDialogVisible"
      @refresh="
        () => {
          refresh()
        }
      "
    />
    <!-- 添加安全管理制度模态框 end -->

    <!-- 安全管理制度详情 start -->
    <DetailSafeRegimeDialog
      v-if="detailSafeRegimeDialogVisible"
      :id="id"
      :visible.sync="detailSafeRegimeDialogVisible"
    />
    <!-- 安全管理制度详情 end -->
  </div>
</template>

<script>
import Api from '../../api/index'
import AddSafeRegimeDialog from './addSafeRegimeDialog'
import DetailSafeRegimeDialog from './detailSafeRegimeDialog'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'SafeRegimeList',
  components: { AddSafeRegimeDialog, DetailSafeRegimeDialog },
  data() {
    // 这里存放数据
    return {
      loading: false,
      queryForm: {
        keyWords: '',
        date: undefined,
        projectId: localStorage.getItem('projectId'),
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      tableData: [],
      total: 0,
      addSafeRegimeDialogVisible: !!+this.$route.query.showAdd || false,
      detailSafeRegimeDialogVisible: false,
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
      let createTimeStart = ''
      let createTimeEnd = ''
      if (this.queryForm.date) {
        createTimeStart = this.queryForm.date[0]
        createTimeEnd = this.queryForm.date[1]
      }
      Api.getManageRegimeList({
        ...this.queryForm,
        createTimeStart,
        createTimeEnd
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
        path: '/dataManage/safeData/safeRegimeAdd'
      })*/
      this.addSafeRegimeDialogVisible = true
      this.id = ''
    },
    // 编辑
    handleEdit(id) {
      /*this.$router.push({
        name: 'SafeRegimeEdit',
        params: { id: id }
      })*/
      this.addSafeRegimeDialogVisible = true
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
          Api.deleteManageRegime(id).then(() => {
            this.$message.success('删除成功')
            this.refresh()
          })
        })
        .catch(() => {})
    },
    // 查看
    handleDetail(id) {
      /*this.$router.push({
        name: 'SafeRegimeDetail',
        params: { id: id }
      })*/
      this.detailSafeRegimeDialogVisible = true
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
