<template>
  <el-dialog :visible="visible" title="单位工程" width="600px" @close="handleCancel">
    <el-tree ref="tree" :data="treeData" node-key="id" :expand-on-click-node="false" default-expand-all>
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span v-if="node.isLeaf">
          <el-radio v-model="unitNode" :label="data">{{data.label}}</el-radio>
        </span>
        <span v-else>{{data.label}}</span>
      </span>
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'UnitDialog',
  components: {},
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    // 这里存放数据
    return {
      treeData: [
        {
          id: 1,
          label: '01 1#号楼',
          children: [
            {
              id: 3,
              label: '0101地基与基础处理',
              children: [
                {
                  id: 4,
                  label: '0101土方开挖'
                },
                {
                  id: 5,
                  label: '0101土方回填'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '02 2#号楼',
          children: [
            {
              id: 6,
              label: '0202地基与地基处理',
              children: [
                {
                  id: 7,
                  label: '0202土方开挖'
                },
                {
                  id: 8,
                  label: '0202土方回填'
                }
              ]
            }
          ]
        }
      ],
      unitNode: undefined
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    // 关闭、取消
    handleCancel() {
      this.unitNode = undefined
      this.$emit('update:visible', false)
    },
    // 确定
    handleSubmit() {
      if (this.unitNode) {
        this.$emit('getUnitInfo', this.unitNode)
        this.handleCancel()
      } else {
        this.$message.error('请选择单位工程')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
