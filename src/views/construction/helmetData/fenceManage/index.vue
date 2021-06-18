<template>
  <div>
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="filterForm.keyWord"
            suffix-icon="el-icon-search"
            placeholder="电子围栏名称/创建人"
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
          <el-button
            v-if="$hasPower('AcceptanceSpecificationAdd')"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd()"
            >新建电子围栏</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="name" title="电子围栏名称"></vxe-table-column>
      <vxe-table-column field="type" title="围栏类型">
        <template #default="{ row }">
          {{ $getLabel(fenceType, row.type) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="type1" title="围栏行为">
        <template #default="{ row }">
          {{ $getLabel(fenceXwType, row.type1) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="railSosCount" title="报警次数"> </vxe-table-column>
      <vxe-table-column field="adminName" title="创建人"> </vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"> </vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row.id)">更新</el-button>
          <el-button type="text" @click="handleDetail(row.id)">详情</el-button>
          <el-button type="text" @click="getRemove(row.id)">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import Api from '../api/index'
import { fenceType, fenceXwType } from '../lib/sosType'

export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'FenceManageList',
  components: {},
  data() {
    // 这里存放数据
    return {
      fenceType,
      fenceXwType,
      // 查询条件
      filterForm: {
        keyWord: '',
        projectId: localStorage.getItem('projectId')
      },
      //请求数据
      request(body) {
        return Api.getFenceList(body)
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
      this.$router.push({
        name: `FenceAdd`
      })
    },
    // 编辑
    handleEdit(id) {
      this.$router.push({
        name: `FenceEdit`,
        query: { id }
      })
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
          Api.getdelFence(data).then(() => {
            this.$message.success('删除成功')
            this.refresh()
          })
        })
        .catch(() => {})
    },
    // 查看
    handleDetail(id) {
      this.$router.push({
        name: `FenceDetail`,
        query: { id }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
