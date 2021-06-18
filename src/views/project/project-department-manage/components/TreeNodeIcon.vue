<template>
  <i v-if="node.data.principalFlag && node.data.organType === 5" class="el-icon-star-on"></i>
  <img v-else-if="node.data.organType === 0" src="@/assets/images/project/project.png" class="" />
  <img
    v-else-if="node.data.organType === 1 && node.data.participantType === 1"
    src="@/assets/images/project/organ-host.png"
    class=""
  />
  <img
    v-else-if="node.data.organType === 1 && node.data.participantType === 2"
    src="@/assets/images/project/organ-join.png"
    class=""
  />
  <img v-else-if="node.data.organType === 2" src="@/assets/images/project/organ-category.png" class="" />
  <img v-else-if="node.data.organType === 3" src="@/assets/images/project/company.png" class="" />
  <img v-else-if="node.data.organType === 4" src="@/assets/images/project/flow-chart.png" class="" />
  <img v-else-if="node.data.organType === 5" src="@/assets/images/project/role.png" class="" />
</template>

<script>
export default {
  name: 'TreeNodeIcon',
  props: {
    node: {
      type: Object,
      default() {
        return {
          data: {}
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color';
</style>
