<template>
  <div class="no-wrap">
    <img src="../../newImages/internet/no-data.png" alt="" />
    <span>暂无数据...</span>
  </div>
</template>

<script>
export default {
  name: 'NoData',
  // import引入的组件
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {}
  },
  // 生命周期 - 挂载完成
  created() {},
  // 方法集合
  methods: {
    //刷新
    refresh() {}
  }
}
</script>

<style scoped lang="less">
.no-wrap {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #909399;
  img {
    width: 32px;
    height: 32px;
    margin-bottom: 10px;
  }
}
</style>
