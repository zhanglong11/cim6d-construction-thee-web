<template>
  <div class="container no-footer">
    <!-- 工具栏 start -->
    <div class="tooltips top-fixed">
      <el-form inline>
        <el-form-item>
          <el-input v-model="filterForm.search" style="width: 250px" placeholder="施工班组名称/所属公司名称/创建人" />
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange :startTime.sync="filterForm.startDate" :endTime.sync="filterForm.endDate"></DateRange>
        </el-form-item>
        <el-form-item label="班组状态">
          <el-select v-model="filterForm.status">
            <el-option :value="null" label="全部"></el-option>
            <el-option
              v-for="(item, index) of statusList"
              :key="'ss' + index"
              :value="item.value"
              :label="item.label"
            ></el-option
          ></el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('ConstructionGroupAdd')" type="primary" icon="el-icon-plus" @click="addGroup"
            >添加分组</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="scroll-area">
      <Grid ref="table" :request="request" :filter-form.sync="filterForm">
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="name" title="班组名称" min-width="150"></vxe-table-column>
        <vxe-table-column field="belongCompanyId" title="所属公司" min-width="200"></vxe-table-column>
        <vxe-table-column field="creatorName" title="创建人" width="150"></vxe-table-column>
        <vxe-table-column field="createTime" title="创建时间" width="180"></vxe-table-column>
        <vxe-table-column field="status" title="班组状态" width="150">
          <template #default="{ row }">
            <span :style="{ color: row.status && row.status === 0 ? '#f00' : '#000' }">{{
              $getLabel(statusList, row.status)
            }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button v-if="$hasPower('ConstructionGroupEdit')" type="text" @click="editGroup(row)">修改</el-button>
            <el-button
              v-if="$hasPower('ConstructionGroupDelete') && row.status === 0"
              type="text"
              @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </vxe-table-column>
      </Grid>
    </div>
    <!-- 工具栏 end -->
    <AddGroup v-if="addVisible" :visible.sync="addVisible" :info="selectGroup" @submit="handleGroupSubmit"></AddGroup>
  </div>
</template>

<script>
import Api from '@/views/construction/engineeringAmountManage/api'
import AddGroup from './components/AddGroup'
export default {
  name: 'ConstructionGroup',
  components: { AddGroup },
  data() {
    return {
      addVisible: false, //添加弹窗
      statusList: [
        { value: 0, label: '未调取' },
        { value: 1, label: '已调取' }
      ],
      selectGroup: {},
      filterForm: {
        inspectType: 1,
        // 查询条件
        search: ''
      },
      request: body => {
        return Api.getGroupList(body)
      }
    }
  },
  methods: {
    //刷新数据
    refresh() {
      this.$refs.table.refresh()
    },
    //重置搜索
    reset() {
      this.$refs.table.reset()
    },
    addGroup() {
      this.selectGroup = {}
      this.addVisible = true
    },
    editGroup(row) {
      this.selectGroup = row
      this.addVisible = true
    },
    async handleDelete(row) {
      let res = await this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message.info('操作已取消')
      })
      if (res) {
        await Api.deleteGroupById([row.id])
        this.$message.success('操作成功!')
        await this.refresh()
      }
    },
    //添加/修改分组
    async handleGroupSubmit(row) {
      row.id ? await Api.updateGroup(row) : await Api.addGroup(row)
      this.$message.success(`${row.id ? '修改' : '添加'}成功`)
      this.addVisible = false
      await this.refresh()
    }
  }
}
</script>

<style scoped></style>
