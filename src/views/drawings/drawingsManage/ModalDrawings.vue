<template>
  <el-dialog title="图纸预览" :visible="visible" width="1100px" @close="handleCancel">
    <div class="img-con">
      <img class="img-source" :src="imgSrc" />
    </div>

    <div slot="footer">
      <el-button type="primary" @click="handleCancel">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    imgSrc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    // 关闭模态框
    handleCancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped>
.img-con {
  border: solid 1px #e5e5e5;
  margin-top: 10px;
  font-size: 0px;
  .img-source {
    width: 100%;
  }
}
</style>
