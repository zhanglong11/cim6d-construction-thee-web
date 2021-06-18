<template>
  <div>
    <el-dialog
      class="beauty"
      title="考勤机人员详情"
      :visible="visible"
      width="680px"
      :close-on-click-modal="false"
      @close="close"
    >
      <div class="desc">
        <el-row :gutter="4">
          <el-table ref="table" class="table" max-height="280" stripe :data="exceptionList" border="">
            <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="name" label="名称" align="center" />
            <el-table-column prop="mobile" label="手机号" align="center" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="employeeNum" label="工号" align="center" show-overflow-tooltip> </el-table-column>
          </el-table>
        </el-row>
      </div>
      <footer slot="footer">
        <el-button type="primary" @click="close">取消</el-button>
      </footer>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'AttendanceDetail',
  components: {},
  props: {
    // 弹窗是否显示
    visible: {
      default: false,
      type: Boolean
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      exceptionList: []
    }
  },
  watch: {
    async visible(val) {
      if (val) {
        console.log(this.data)
        this.exceptionList = _.cloneDeep(this.data)
      }
    }
  },
  methods: {
    // 关闭弹窗
    close() {
      this.$emit('update:visible', false)
    },
    refresh() {}
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
.el-col {
  margin-bottom: 25px;
  font-size: 16px;
}
.desc-label {
  margin-right: 10px;
}
</style>
