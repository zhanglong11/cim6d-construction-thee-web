<template>
  <div class="no-padding">
    <el-card class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">XXX安全管理制度（20191230001）</span>
      </div>
      <div class="details">
        <el-row>
          <el-col :md="12">
            <span class="label">制度内容</span>
            <span class="label-content"
              >为了加强安全生产工作，防止和减少生产安全事故，保障人民群众生命和财 产安全，促进经济社会持续健康发展，制定本法</span
            >
          </el-col>
          <el-col :md="12">
            <span class="label">&nbsp;</span>
            <span class="label-content">&nbsp;</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <span class="label">附件</span>
            <div class="label-content" style="display: inline-block; vertical-align: top">
              <FileList :ids="''" />
            </div>
          </el-col>
          <el-col :md="12">
            <span class="label">创建人</span>
            <span class="label-content">张静茹</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <span class="label">&nbsp;</span>
            <span class="label-content">&nbsp;</span>
          </el-col>
          <el-col :md="12">
            <span class="label">创建时间</span>
            <span class="label-content">2019-12-10 10:00:00</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24">
            <span class="label">备注</span>
            <span class="label-content"
              >《中华人民共和国安全生产法》是为了加强安全生产工作，防止和减少生产安全事故，保障人民群众生命和财 产安全，促进经济社会持续健康发展，制定本法。</span
            >
          </el-col>
        </el-row>
      </div>
    </el-card>
    <div class="footer-btn">
      <el-button size="lg" @click="handleBack()">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'SafeRegimeDetail',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id || ''
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    console.log(this.$route.params.id)
  },
  // 方法集合
  methods: {
    // 返回
    handleBack() {
      this.$router.push({ name: 'SafeRegimeList' })
    }
  }
}
</script>

<style lang="less" scoped>
.details {
  font-size: 14px;
  .el-col {
    display: flex;
  }
  .label {
    margin-right: 25px;
    margin-bottom: 15px;
    color: #ccc;
    display: inline-block;
    width: 150px;
    text-align: right;
  }
  .label-content {
    margin-bottom: 15px;
    flex: 1;
  }
}
</style>
