<template>
  <div class="wrap">
    <div class="tree">
      <BimTree @changeBox="changeBox" />
    </div>
    <div class="bim"><BimView ref="bim" has-tool /></div>
  </div>
</template>

<script>
export default {
  name: 'Test',
  // import引入的组件
  props: {},
  data() {
    // 这里存放数据
    return {
      treeData: []
    }
  },
  watch: {
    treeData(v) {
      console.log(v)
    }
  },
  // 生命周期 - 挂载完成
  created() {},
  // 方法集合
  methods: {
    //刷新
    refresh() {},
    changeBox(v) {
      console.log(v)
      let ele = v.filter(v => v.type === 'element')
      this.$refs.bim.showGuid(ele.map(c => c.id))
      // this.$refs.bim.setColor(
      //   ele.map(c => c.id),
      //   [255, 0, 0]
      // )
      // this.$refs.bim.clearMark()
      // this.$refs.bim.setMark(
      //   ele.map(c => c.id),
      //   require('./images/safe.png')
      // )
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
  display: flex;
  .tree {
    width: 260px;
  }
  .bim {
    width: 100%;
  }
}
</style>
