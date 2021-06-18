<template>
  <div class="no-padding">
    <el-card class="box-card">
      <div class="details">
        <el-row>
          <el-col :md="12">
            <span class="label">打卡地点:</span>
            <span class="label-content">{{ form.clockInPlace }}</span>
          </el-col>
          <el-col :md="12">
            <span class="label">备注</span>
            <span class="label-content">{{ form.remark }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24">
            <span class="label">打卡时间</span>
            <span class="label-content">{{ form.clockTime }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24">
            <span class="label">打卡人</span>
            <span class="label-content">{{ form.creatorName }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24">
            <span class="label">巡更点名称</span>
            <span class="label-content">{{ form.patrolLocationName }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24">
            <span class="label">打卡拍照</span>
            <span class="label-content" style="display: inline-block; vertical-align: top">
              <ImgList :ids="form.attachment"></ImgList>
            </span>
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
import Api from '../api'
import ImgList from '@/views/construction/quality/components/imgList' //附件
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'ClockDetail',
  components: { ImgList },
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id || '',
      form: {}
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  created() {
    if (this.id) {
      Api.getClockDetail(this.id).then(res => {
        this.form = res.data
      })
    }
  },
  // 方法集合
  methods: {
    // 返回
    handleBack() {
      this.$router.back()
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
    color: #999;
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
