<template>
  <div class="bim-view">
    <BimView :modelId="modelId" />
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    //这里存放数据
    return {
      modelId: this.$route.query.type === 'big' ? 'Z8WKEX8A' : 'q8Z9ZJYa'
    }
  },
  mounted() {
    document.title = 'Bim模型展示'
  },
  //方法集合
  methods: {}
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.bim-view {
  width: 100%;
  height: 100%;
}
</style>
