<template>
  <div class="block-card">
    <div class="top">
      <div class="top-middle">
        <!-- <div class="icon-bg">
          <slot name="icon"></slot>
        </div> -->
        <div class="title">
          <span class="card-dot"></span>
          {{ title }}
        </div>
      </div>
      <div class="top-right"></div>
    </div>
    <div class="middle" :class="{ 'no-overflow': !isOverflow }">
      <div class="middle-content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    isOverflow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
@import url('./BlockCard.less');
</style>
