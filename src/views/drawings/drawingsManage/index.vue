<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="form" :model="filterForm" inline>
        <el-form-item prop="keyword">
          <el-input v-model="filterForm.keyword" placeholder="上传人/图纸名称" />
        </el-form-item>
        <el-form-item label="上传日期" prop="date">
          <DateRange :start-time.sync="filterForm.startTime" :end-time.sync="filterForm.endTime"></DateRange>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button v-if="$hasPower('DrawingsAdd')" type="primary" @click="toAddDrawings">新增图纸</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->

    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" width="120" title="序号" />
      <vxe-table-column field="drawingsName" title="图纸名称" show-overflow-tooltip />
      <vxe-table-column field="creatorName" title="上传人" />
      <vxe-table-column field="createTime" title="上传时间" />
      <vxe-table-column title="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="$hasPower('DrawingsEdit')" type="text" @click="handleEdit(scope.row)">修改</el-button>
          <el-button v-if="$hasPower('DrawingsDetail')" type="text" @click="handleDetail(scope.row)">查看</el-button>
          <el-button v-if="$hasPower('DrawingsDelete')" type="text" @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import { getDrawingsList, removeDrawing } from '../api'
export default {
  data() {
    return {
      filterForm: {
        keyword: ''
      },
      request(body) {
        return getDrawingsList(body)
      }
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.refresh()
  },
  // 方法集合
  methods: {
    // 刷新数据
    refresh() {
      this.$refs.table.refresh()
    },
    // 重置搜索
    reset() {
      this.$refs.table.reset()
    },
    // 新增图纸
    toAddDrawings() {
      this.$router.push({ name: 'DrawingsAdd' })
    },
    // 修改图纸
    handleEdit(row) {
      this.$router.push({ name: 'DrawingsEdit', params: { id: row.id } })
    },
    // 查看图纸
    handleDetail(row) {
      this.$router.push({ name: 'DrawingsDetail', params: { id: row.id } })
    },
    // 删除
    handleRemove(row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          removeDrawing(row.id)
          this.refresh()
          this.$message.success('操作成功')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped></style>
