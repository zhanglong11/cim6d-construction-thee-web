<template>
  <el-dialog
    width="400px"
    :modal="true"
    top="10vh"
    title="请选择"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <div class="treeView">
      <el-input v-model="filterText" placeholder="请输入" style="width: 180px; margin-right: 10px"> </el-input>
      <el-button type="primary" icon="el-icon-search" @click="$refs.tree.filter(filterText)">搜索</el-button>
      <el-button
        icon="el-icon-refresh-left"
        @click="
          () => {
            filterText = ''
            $refs.tree.filter('')
          }
        "
        >重置</el-button
      >
    </div>
    <br />
    <el-tree
      ref="tree"
      class="filter-tree"
      node-key="taskId"
      :expand-on-click-node="false"
      :check-on-click-node="true"
      show-checkbox
      default-expand-all
      :data="treeData"
      :props="defaultProps"
      check-strictly
      :filter-node-method="filterNode"
      style="max-height: 300px; overflow-y: auto"
      @check-change="checkChange"
    >
    </el-tree>
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import toTreeData from '@/utils/toTree'
export default {
  name: 'SelectTreeMonomer',
  props: {
    visible: {},
    targetType: {
      default: null
    }
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'synthesisTaskName'
      },
      filterText: '',
      uniqueValue: '',
      projectId: localStorage.getItem('projectId'),
      checkName: null,
      taskUniqueId: '',
      planUnicode: ''
    }
  },
  watch: {
    targetType: function (val) {
      this.refresh()
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.getScheduleList()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.taskName.indexOf(value) !== -1
    },

    /*进度列表*/
    async getScheduleList() {
      let res = await this.axios.construction.post(`/schedule/task/list`, {
        projectId: this.projectId,
        selectFlag: 1
      })
      this.treeData = toTreeData(res.data.baseList, 'parentTaskUniqueId', 'planStartDate', 'taskUniqueId')
      // console.log(this.treeData)
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    submit() {
      this.$emit('getTarget', {
        name: this.checkName,
        taskUniqueId: this.taskUniqueId,
        planUnicode: this.planUnicode,
        length: this.length
      })
      this.$emit('update:visible', false)
    },
    handle(e, data) {
      if (data.engineeringDivide !== this.targetType) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    },
    //节点选择状态发生改变时
    checkChange(data, checkbox) {
      let label = this.$refs.tree.getCheckedNodes()[0].synthesisTaskName || ''
      // console.log('标准', label, data)
      this.checkName = label
      this.taskUniqueId = data.taskUniqueId
      this.planUnicode = data.planUnicode
      this.length = data?.children?.length || 0
      if (checkbox) {
        this.$refs.tree.setCheckedKeys([data.taskId])
        this.uniqueValue = this.$refs.tree.getCheckedKeys()
      } else {
        this.uniqueValue = this.$refs.tree.getCheckedKeys()
        if (this.uniqueValue.length === 0) {
          this.uniqueValue = ''
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.filter-tree {
  /deep/.tree-item {
    &.active {
      color: #409eff;
    }
    &.disabled {
      width: 100%;
      cursor: not-allowed;
      color: #dcdfe6;
    }
  }
}
/deep/ .el-tree-node {
  .is-leaf + .el-checkbox .el-checkbox__inner {
    display: inline-block;
  }
  /deep/ .el-checkbox .el-checkbox__inner {
    display: none;
  }
}
</style>
