<template>
  <div>
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="filterForm.keyWord"
            suffix-icon="el-icon-search"
            placeholder="用户ID/创建人"
            style="width: 206px"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="date">
          <DateRange :startTime.sync="filterForm.startDate" :endTime.sync="filterForm.endDate"></DateRange>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd()">新建安全帽</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="attendanceGroupName" title="用户ID"></vxe-table-column>
      <vxe-table-column field="userName" title="姓名"> </vxe-table-column>
      <vxe-table-column field="deviceNum" title="设备编号"> </vxe-table-column>
      <vxe-table-column field="staffType" title="人员类型"> </vxe-table-column>
      <vxe-table-column field="adminName" title="创建人"> </vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"> </vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button type="text" @click="handleDetail(row.id)">详情</el-button>
          <el-button type="text" @click="handleEdit(row.id)">编辑</el-button>
          <el-button type="text" @click="getRemove(row.id)">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>

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
import Api from '../api/index'

import AddAcceptanceDialog from './addHelmetDialog'
import DetailAcceptanceDialog from './detailHelmetDialog'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'HelmetManageList',
  components: { AddAcceptanceDialog, DetailAcceptanceDialog },
  data() {
    // 这里存放数据
    return {
      id: '',
      // 查询条件
      filterForm: {
        keyWord: '',
        projectId: localStorage.getItem('projectId')
      },
      addAcceptanceVisible: !!+this.$route.query.showAdd || false,
      detailAcceptanceVisible: false,
      //请求数据
      request(body) {
        return Api.getSafeCapDeviceList(body)
      }
    }
  },

  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    // 查询
    refresh() {
      this.$refs.table.refresh()
    },
    // 重置
    reset() {
      this.$refs.table.reset()
    },
    // 新建
    handleAdd() {
      this.addAcceptanceVisible = true
      this.id = ''
    },
    // 编辑
    handleEdit(id) {
      this.addAcceptanceVisible = true
      this.id = id
    },
    // 删除
    getRemove(id) {
      let data = {
        id: id,
        projectId: localStorage.getItem('projectId')
      }
      this.$confirm('确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Api.getdelSafeCapDevice(data).then(() => {
            this.$message.success('删除成功')
            this.refresh()
          })
        })
        .catch(() => {})
    },
    // 查看
    handleDetail(id) {
      this.detailAcceptanceVisible = true
      this.id = id
    }
  }
}
</script>

<style lang="less" scoped></style>
