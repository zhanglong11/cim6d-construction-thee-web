<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'Iot',
  created() {
    this.$store.dispatch('iot/getGroupListTree')
  }
}
</script>

<style scoped lang="less"></style>
