<template>
  <div class="container">
    <div class="tooltips">
      <el-form ref="form" inline :model="filterForm">
        <el-form-item>
          <el-input v-model="filterForm.name" style="width: 200px" placeholder="资料名称" />
        </el-form-item>
        <el-form-item label="上传日期">
          <DateRange :startTime.sync="filterForm.startTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <el-form-item label="所属模块">
          <el-select v-model="filterForm.module" clearable placeholder="所属模块">
            <el-option v-for="item in archiveTypeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="name" title="归档文件名称" minWidth="200"></vxe-table-column>
      <vxe-table-column
        field="module"
        title="所属模块"
        width="200"
        :formatter="({ cellValue }) => $getLabel(archiveTypeList, cellValue)"
      >
      </vxe-table-column>
      <vxe-table-column field="fileNum" title="文件数量" width="150"></vxe-table-column>
      <vxe-table-column field="createTime" title="上传时间" width="200"></vxe-table-column>
      <vxe-table-column title="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button v-if="$hasPower('ProjectArchiveDetail')" type="text" @click="toDetail(row)">查看</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import Api from './api'
export default {
  name: 'DataArchiveList',
  components: {},
  data() {
    return {
      filterForm: {},
      request(body) {
        body.projectId = localStorage.getItem('projectId')
        return Api.getList(body)
      }
    }
  },
  computed: {
    //所属模块
    archiveTypeList() {
      return this.$getArgList('pigeonhole') || []
    }
  },
  mounted() {},
  methods: {
    //刷新数据
    refresh() {
      this.$refs.table.refresh()
    },
    //重置搜索
    reset() {
      this.$refs.table.reset()
    },
    //跳转到详情
    toDetail(row) {
      this.$router.push({
        name: 'ProjectArchiveDetail',
        params: {
          id: row.id
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
