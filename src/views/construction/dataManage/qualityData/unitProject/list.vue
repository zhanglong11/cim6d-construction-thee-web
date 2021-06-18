<template>
  <div>
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="form" :model="queryForm" inline>
        <el-form-item>
          <el-input
            v-model="queryForm.keyword"
            suffix-icon="el-icon-search"
            placeholder="单位工程编号/单位工程名称/创建人"
            style="width: 270px"
          ></el-input>
        </el-form-item>
        <el-form-item label="资料类型">
          <el-select v-model="queryForm.dataType" style="width: 180px">
            <el-option v-for="item in dataType" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目种类">
          <el-select v-model="queryForm.projectType" style="width: 180px">
            <el-option v-for="item in projectType" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd()">新建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table v-loading="loading" :data="tableData" border stripe size="small">
      <el-table-column type="index" width="120" align="center" label="序号" />
      <el-table-column prop="code" label="单位工程编号" />
      <el-table-column prop="name" label="单位工程名称" />
      <el-table-column prop="dataType" label="资料类型">
        <template slot-scope="scope">{{ dataType.filter(item => item.value == scope.row.dataType)[0].label }}</template>
      </el-table-column>
      <el-table-column prop="projectType" label="项目种类">
        <template slot-scope="scope">{{
          projectType.filter(item => item.value == scope.row.projectType)[0].label
        }}</template>
      </el-table-column>
      <el-table-column prop="creator" label="创建人" />
      <el-table-column prop="creatTime" label="创建时间" />
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button type="text" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
          <el-button type="text" size="mini" @click="handleDetail(scope.row.id)">查看</el-button>
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
  </div>
</template>

<script>
import dataType from './lib/dataType'
import projectType from './lib/projectType'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'UnitProjectList',
  components: {},
  data() {
    // 这里存放数据
    return {
      dataType,
      projectType,
      // 查询条件
      loading: false,
      queryForm: {
        keyword: '',
        dataType: undefined,
        projectType: undefined,
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      tableData: [
        { id: 1, code: '编号1', name: '名称1', dataType: 1, projectType: 1, creator: '创建人1', creatTime: '时间1' },
        { id: 2, code: '编号2', name: '名称2', dataType: 2, projectType: 2, creator: '创建人2', creatTime: '时间2' },
        { id: 3, code: '编号3', name: '名称3', dataType: 3, projectType: 3, creator: '创建人3', creatTime: '时间3' }
      ],
      total: 0
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    // 查询列表
    async refresh(isFirstPage = true) {},
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
      this.$router.push({
        path: '/dataManage/qualityData/unitProjectAdd'
      })
    },
    // 编辑
    handleEdit(id) {
      this.$router.push({
        name: 'UnitProjectEdit',
        params: { id: id }
      })
    },
    // 删除
    handleDelete(id) {
      this.$confirm('确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message.success('删除成功')
        })
        .catch(() => {})
    },
    // 查看
    handleDetail(id) {
      this.$router.push({
        name: 'UnitProjectDetail',
        params: { id: id }
      })
    },
    // 当前页码改变
    changePageNumber(pageNumber) {
      this.queryForm.page = pageNumber
      this.refresh()
    },
    // 每页显示条数改变
    changePageSize(pageSize) {
      this.queryForm.page = 1
      this.queryForm.pageSize = pageSize
      this.refresh()
    }
  }
}
</script>

<style lang="less" scoped></style>
