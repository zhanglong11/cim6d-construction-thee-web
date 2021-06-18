<template>
  <div>
    <el-dialog
      class="beauty"
      el-dialog
      title="表格内容错误提示"
      :visible="visible"
      width="850px"
      :close-on-click-modal="false"
      @close="close"
    >
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="num" label="行数" width="180"> </el-table-column>
        <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
        <el-table-column prop="idCardNum" label="身份证号"></el-table-column>
        <el-table-column label="提示内容">
          <span>{{ message }}</span>
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
  name: 'ErrorDetail',
  props: {
    // 弹窗是否显示
    visible: {
      default: false,
      type: Boolean
    },
    tableData: {
      default() {
        return []
      },
      type: Array
    }
  },
  data() {
    return {
      message: '身份证号信息有误',
      tableDate: []
    }
  },
  created() {
    this.tableDate = this.tableData
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
