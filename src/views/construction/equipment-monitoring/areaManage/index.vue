<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="">
          <el-input v-model="filterForm.keyword" placeholder="区域名称/区域负责人/创建人" style="width: 240px">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange :startTime.sync="filterForm.startTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <!--        <el-form-item label="区域类型">-->
        <!--          <SelectList v-model="filterForm.type" :self-list="areaTypeList" />-->
        <!--        </el-form-item>-->
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item v-if="$hasPower('areaManageAdd')">
          <el-button type="primary" icon="el-icon-plus" @click="showAdd(null)">新建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="name" title="区域名称" />
      <!--      <vxe-table-column field="planNum" title="区域类型" />-->
      <vxe-table-column field="principalName" title="区域负责人" />
      <vxe-table-column field="creatorName" title="创建人" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column title="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button v-if="$hasPower('areaManageEdit')" type="text" @click="showAdd(row.id)">编辑</el-button>
          <el-button v-if="$hasPower('areaManageDelete')" type="text" @click="remove(row)">删除</el-button>
          <el-button type="text" @click="showDetail(row.id)">详情</el-button>
        </template>
      </vxe-table-column>
    </Grid>

    <AddDialog v-if="visible" :id="activeId" :visible.sync="visible" />
    <DetailDialog v-if="detailVisible" :id="activeId" :visible.sync="detailVisible" />
  </div>
</template>

<script>
import Api from './api'
import AddDialog from './components/addDialog'
import DetailDialog from './components/detailDialog'
export default {
  name: 'AreaManageList',
  components: {
    AddDialog,
    DetailDialog
  },
  data() {
    // 这里存放数据
    return {
      projectId: localStorage.getItem('projectId'),
      filterForm: {},
      request: body => Api.list(body),
      visible: false,
      detailVisible: false,
      activeId: null
    }
  },
  computed: {
    areaTypeList() {
      return this.$getArgList('workMeetingType') || []
    }
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
    //添加模态框
    showAdd(id) {
      this.activeId = id
      this.visible = true
    },
    showDetail(id) {
      this.activeId = id
      this.detailVisible = true
    },
    // 批量删除
    async remove(row) {
      await this.$tipRemove([row])
      await Api.delete(row.id)
      await this.$message.success('删除成功')
      this.refresh()
    }
  }
}
</script>
<style lang="less" scoped></style>
