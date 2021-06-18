<template>
  <div class="container">
    <template v-if="detailType === 1">
      <PerilDetail />
    </template>
    <template v-if="detailType === 2">
      <ReplyDetail />
    </template>
    <template v-if="detailType === 3">
      <CheckDetail />
    </template>
    <template v-if="detailType === 4">
      <RectifyDetail />
    </template>
  </div>
</template>

<script>
import PerilDetail from './periDetail'
import ReplyDetail from './replyDetail'
import CheckDetail from './checkDetail'
import RectifyDetail from './rectifyDetail'
import Api from '../api'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'SafetyDetail',
  components: { PerilDetail, ReplyDetail, CheckDetail, RectifyDetail },
  data() {
    return {
      id: this.$route.query.id,
      detailType: ''
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  created() {
    if (this.id) {
      Api.getsafetyTypekDetail(this.id).then(res => {
        this.detailType = res.data
      })
    }
  },
  // 方法集合
  methods: {}
}
</script>
<style lang="less" scoped></style>
