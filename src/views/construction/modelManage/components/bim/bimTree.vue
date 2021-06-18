<template>
  <div>
    <el-tree :data="bimTree" show-checkbox :props="defaultProps" @check="checkChange" />
  </div>
</template>

<script>
export default {
  name: 'BimTree',
  // import引入的组件
  components: {},
  props: {
    treeData: {
      default: () => []
    }
  },
  data() {
    // 这里存放数据
    return {
      defaultProps: { children: 'children', label: 'name' }
    }
  },
  computed: {
    bimTree() {
      return this.treeData
    }
  },
  // 生命周期 - 挂载完成
  created() {
    this.refresh()
  },
  // 方法集合
  methods: {
    //刷新
    refresh() {},
    checkChange(data, { checkedNodes }) {
      this.$emit('changeBox', checkedNodes)
    }
  }
}
</script>

<style scoped></style>
