<template>
  <div class="container">
    <template v-if="detailType === 1">
      <QualityDetail />
    </template>
    <template v-if="detailType === 2">
      <ProjectDetail />
    </template>
    <template v-if="detailType === 3">
      <WorkDetail />
    </template>
  </div>
</template>

<script>
import ProjectDetail from './projectDetail'
import QualityDetail from './qualityDetail'
import WorkDetail from './workDetail'
import Api from '../api'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'ProblemDetail',
  components: { ProjectDetail, QualityDetail, WorkDetail },
  data() {
    return {
      id: this.$route.query.id,
      detailType: this.$route.query.type
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  created() {
    if (this.id) {
      Api.getqualityTypekDetail(this.id).then(res => {
        this.detailType = res.data
      })
    }
  },
  // 方法集合
  methods: {}
}
</script>
<style lang="less" scoped></style>
