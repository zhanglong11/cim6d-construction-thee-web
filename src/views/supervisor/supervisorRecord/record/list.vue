<template>
  <div>
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="form" :model="filterForm" inline>
        <el-form-item prop="keyword">
          <el-input
            v-model="filterForm.keyword"
            suffix-icon="el-icon-search"
            placeholder="单位工程名称/旁站部位/旁站人"
            style="width: 230px"
          ></el-input>
        </el-form-item>
        <!--        <el-form-item label="状态" prop="status">-->
        <!--          <el-select v-model="filterForm.status" style="width: 120px">-->
        <!--            <el-option v-for="item in referStatus" :key="item.value" :value="item.value" :label="item.label" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="旁站开始时间" prop="date">
          <DateRange
            :startTime.sync="filterForm.siteStationStartFromDate"
            :endTime.sync="filterForm.siteStationStartToDate"
          ></DateRange>
        </el-form-item>
        <el-form-item label="创建时间" prop="date">
          <DateRange
            :startTime.sync="filterForm.createTimeFromDate"
            :endTime.sync="filterForm.createTimeToDate"
          ></DateRange>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="$hasPower('SupervisionRecordRecordAdd')"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd()"
            >新建旁站记录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="code" title="编号"></vxe-table-column>
      <vxe-table-column field="engineeringName" title="单位工程名称" show-overflow-tooltip />
      <vxe-table-column field="partProcedure" title="旁站部位或工序" />
      <vxe-table-column field="weather" title="天气" min-width="80" />
      <vxe-table-column field="startDate" title="旁站开始时间" min-width="80">
        <template slot-scope="{ row }">
          <span>{{ row.startDate | ymd }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="endDate" title="旁站结束时间" min-width="80">
        <template slot-scope="{ row }">
          <span>{{ row.endDate | ymd }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="creatorName" title="旁站人" min-width="80" />
      <vxe-table-column field="remark" title="备注"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间">
        <template slot-scope="{ row }">
          <span>{{ row.createTime | ymd }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="$hasPower('SupervisionRecordRecordDetail')"
            type="text"
            size="mini"
            @click="handleDetail(scope.row.id)"
            >查看</el-button
          >
          <el-button
            v-if="$hasPower('SupervisionRecordRecordEdit')"
            type="text"
            size="mini"
            @click="handleEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            v-if="$hasPower('SupervisionRecordRecordDelete')"
            type="text"
            size="mini"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>
    <!-- 添加监理记录模态框 start -->
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
    <!-- 添加监理记录模态框 end -->

    <!-- 监理记录详情 start -->
    <DetailDialog v-if="detailVisible" :id="id" :visible.sync="detailVisible" />
    <!-- 监理记录详情 end -->
  </div>
</template>

<script>
import Api from '../api'
import referStatus from '../lib/referStatus'
import AddDialog from './addDialog'
import DetailDialog from './detailDialog'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'SupervisionRecordRecord',
  components: { AddDialog, DetailDialog },
  data() {
    // 这里存放数据
    return {
      referStatus,
      // 查询条件
      loading: false,
      filterForm: {
        keyword: '',
        status: undefined,
        date: undefined,
        page: 1,
        rows: this.$pageConfig.pageSize,
        projectId: this.$store.state.project.projectId
      },
      request(body) {
        body.projectId = localStorage.getItem('projectId')
        return Api.getRecordList(body)
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
          Api.getRecordDelete([id]).then(res => {
            if (res.code === 200) {
              this.$message.info('删除成功')
              this.refresh()
            }
          })
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
