<template>
  <div>
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="form" :model="filterForm" inline>
        <el-form-item prop="content">
          <el-input
            v-model="filterForm.content"
            suffix-icon="el-icon-search"
            placeholder="单位工程名称"
            style="width: 230px"
          ></el-input>
        </el-form-item>
        <!--        <el-form-item label="状态" prop="status">-->
        <!--          <el-select v-model="filterForm.status" style="width: 120px">-->
        <!--            <el-option v-for="item in referStatus" :key="item.value" :value="item.value" :label="item.label" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="日期" prop="date">
          <DateRange :startTime.sync="filterForm.dateStartTime" :endTime.sync="filterForm.dateEndTime"></DateRange>
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
            v-if="$hasPower('SupervisionRecordWeeklyAdd')"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd()"
            >新建监理周报</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="code" title="编号"></vxe-table-column>
      <vxe-table-column field="engineeringName" title="单位工程名称" show-overflow-tooltip />
      <vxe-table-column field="reportDate" title="日期">
        <template slot-scope="{ row }">
          <span>{{ row.reportStartDate }}~{{ row.reportEndDate }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="creatorName" title="周报填写人" min-width="80" />
      <vxe-table-column field="status" title="状态" min-width="80">
        <template slot-scope="{ row }">{{ $getLabel(referStatus, row.status) }}</template>
      </vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column title="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <template v-if="scope.row.status === 0">
            <el-button
              v-if="$hasPower('SupervisionRecordWeeklyEdit')"
              type="text"
              size="mini"
              @click="handleEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              v-if="$hasPower('SupervisionRecordWeeklyDelete')"
              type="text"
              size="mini"
              @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
            <el-button
              v-if="$hasPower('SupervisionRecordWeeklySign') && scope.row.signPersonId === $store.state.user.id"
              type="text"
              size="mini"
              @click="handleDetail(scope.row.id, 1)"
              >签阅</el-button
            >
          </template>
          <el-button
            v-if="$hasPower('SupervisionRecordWeeklyDetail')"
            type="text"
            size="mini"
            @click="handleDetail(scope.row.id, 0)"
            >查看</el-button
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
    <DetailDialog v-if="detailVisible" :id="id" :visible.sync="detailVisible" :sign="sign" />
    <!-- 监理日志详情 end -->
  </div>
</template>

<script>
import Api from '../api'
import referStatus from '../lib/referStatus'
import AddDialog from './addDialog'
import DetailDialog from './detailDialog'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'SupervisionRecordWeekly',
  components: { AddDialog, DetailDialog },
  data() {
    // 这里存放数据
    return {
      referStatus,
      // 查询条件
      loading: false,
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
        return Api.getWeeklyList(body)
      },
      tableData: [],
      total: 0,
      addVisible: false,
      detailVisible: false,
      sign: null,
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
    // 删除
    handleDelete(id) {
      this.$confirm('确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Api.getWeeklyDelete([id]).then(res => {
            if (res.code === 200) {
              this.$message.info('删除成功')
              this.refresh()
            }
          })
        })
        .catch(() => {})
    },
    // 查看
    handleDetail(id, type) {
      this.detailVisible = true
      this.id = id
      this.sign = type
    }
  }
}
</script>
