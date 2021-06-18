<template>
  <el-dialog
    title="上传结果"
    width="600px"
    class="middle-v"
    :visible="visible"
    :close-on-click-modal="false"
    @close="$emit('update:visible', false)"
  >
    <div class="body-container">
      <h3 v-if="false">恭喜您，上传成功！</h3>
      <template v-else>
        <h3>上传失败！</h3>
        <div class="fail-content">
          <p>少时诵诗书,的点点滴滴,吾问无为谓,凄凄切切群</p>
          <p>少时诵诗书,的点点滴滴,吾问无为谓,凄凄切切群</p>
          <p>少时诵诗书,的点点滴滴,吾问无为谓,凄凄切切群</p>
          <p>少时诵诗书,的点点滴滴,吾问无为谓,凄凄切切群</p>
          <p>少时诵诗书,的点点滴滴,吾问无为谓,凄凄切切群</p>
        </div>
      </template>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddSubEngineer',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.body-container {
  padding: 10px 50px;
  h3 {
    color: #f00;
    text-align: center;
  }
  .fail-content {
    margin-top: 10px;
    line-height: 24px;
  }
}
</style>
