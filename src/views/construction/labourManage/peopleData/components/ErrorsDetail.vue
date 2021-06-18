<template>
  <div>
    <el-dialog
      class="beauty"
      el-dialog
      title="导入结果"
      :visible="visible"
      width="950px"
      :close-on-click-modal="false"
      @close="close"
    >
      <div style="margin-bottom: 10px">
        <el-row :gutter="4">
          <el-col :span="12">
            <span class="desc-label">成功条数:</span>
            <span>{{ tableDates.successNum }}</span>
          </el-col>
          <el-col :span="12">
            <span class="desc-label">失败条数:</span>
            <span>{{ tableDates.failNum }}</span>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableDates.errorList" style="width: 100%" border>
        <el-table-column prop="name" label="人员姓名" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="idCardNum" label="身份证号" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="gender" label="人员性别"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="labourCompany" label="所属参建单位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="group" label="所属班组" show-overflow-tooltip></el-table-column>
        <el-table-column prop="workType" label="工种" show-overflow-tooltip></el-table-column>
        <el-table-column prop="jobStatus" label="在职状态" show-overflow-tooltip></el-table-column>
        <el-table-column prop="error" label="错误信息" show-overflow-tooltip>
          <template #default="{ row }">
            <span style="color: red">{{ row.error }}</span>
          </template>
        </el-table-column>
      </el-table>
      <footer slot="footer">
        <el-button @click="close">关闭</el-button>
      </footer>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'ErrorsDetail',
  props: {
    // 弹窗是否显示
    visible: {
      default: false,
      type: Boolean
    },
    tableData: {
      default() {
        return {}
      },
      type: Object
    }
  },
  data() {
    return {
      tableDates: [],
      errorList: []
    }
  },
  created() {
    this.tableDates = this.tableData || []
    this.errorList = _.pullAt(this.tableDates.errorList, 0)
    console.log(this.tableDates)
  },
  methods: {
    // 关闭弹窗
    close() {
      this.$emit('update:visible', false)
      this.$parent.close()
    }
  }
}
</script>
