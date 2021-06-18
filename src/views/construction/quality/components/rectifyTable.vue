<template>
  <el-dialog
    :append-to-body="appendToBody"
    title="检查详情"
    width="1600px"
    top="12vh"
    :visible="visible"
    @close="$emit('update:visible', false)"
  >
    <div class="body-container">
      <el-table :data="tableData">
        <el-table-column type="index" width="50" label="序号"> </el-table-column>
        <el-table-column prop="problemArea" label="问题部位" width="180"> </el-table-column>
        <el-table-column prop="problemDesc" label="问题描述" width="180"> </el-table-column>
        <el-table-column prop="inspectNature" label="检查性质" width="180">
          <template slot-scope="scope">
            {{ scope.row.inspectNature === 1 ? '计划检查' : '日常巡检' }}
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="检查人"> </el-table-column>
        <el-table-column prop="inspectTime" label="检查时间" width="180"> </el-table-column>
        <el-table-column prop="rectifyPrincipalName" label="整改人"> </el-table-column>
        <el-table-column
          prop="rectifyDeadline"
          label="整改期限"
          :formatter="(row, column, cellValue) => moment(cellValue).format('YYYY-MM-DD')"
        >
        </el-table-column>
        <el-table-column prop="reviewPrincipalName" label="复检人"> </el-table-column>
        <el-table-column prop="reviewTime" label="复检时间" width="180"> </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ $getLabel(statusList, scope.row.status) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import statusList from '../lib/problemStatusList'
export default {
  name: 'RectifyTable',
  components: {},
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      statusList: statusList
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
@import '../index.less';
</style>
