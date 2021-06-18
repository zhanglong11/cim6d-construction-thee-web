<template>
  <div class="no-padding one-padding-bottom">
    <!-- 流程图 start -->
    <ViewFlow :id="id" :isExport="false" />
    <!-- 流程图 end -->
    <el-card class="box-card">
      <div class="details">
        <div class="details-list">
          <h4 class="detail-title"><span>监理实施细则信息</span></h4>
          <el-row>
            <el-col :md="12">
              <span class="label">监理实施细则名称</span>
              <span class="label-content">{{ detailInfo.name }}</span>
            </el-col>
            <el-col :md="12">
              <span class="label">适用范围</span>
              <span class="label-content">{{ detailInfo.applyRange }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12">
              <span class="label">编制人</span>
              <span class="label-content">{{ detailInfo.writer }}</span>
            </el-col>
            <el-col :md="12">
              <span class="label">编制日期</span>
              <span class="label-content">{{ detailInfo.writerDate }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12">
              <span class="label">监理实施细则备注</span>
              <span class="label-content">{{ detailInfo.remark }}</span>
            </el-col>
            <el-col :md="12">&nbsp;</el-col>
          </el-row>
          <el-row>
            <el-col :md="12">
              <span class="label">监理实施细则附件</span>
              <div class="label-content" style="display: inline-block; vertical-align: top">
                <FileList :ids="detailInfo.fileIds" />
              </div>
            </el-col>
            <el-col :md="12">&nbsp;</el-col>
          </el-row>
        </div>
      </div>
    </el-card>

    <el-card class="box-card">
      <div class="details">
        <div class="details-list">
          <h4 class="detail-title"><span>审核信息</span></h4>
          <el-row>
            <el-col :md="12">
              <span class="label">审核结果</span>
              <span class="label-content">
                <el-radio v-model="checked" label="1">通过</el-radio>
                <el-radio v-model="checked" label="2">驳回</el-radio>
              </span>
            </el-col>
            <el-col :md="12">&nbsp;</el-col>
          </el-row>
          <el-row>
            <el-col :md="12">
              <span class="label">审核意见</span>
              <span class="label-content">
                <el-input v-model="opinion" type="textarea" :rows="2" :resize="'none'" />
              </span>
            </el-col>
            <el-col :md="12">&nbsp;</el-col>
          </el-row>
        </div>
      </div>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="handleCancel()">取消</el-button>
      <el-button size="lg" type="primary" :loading="btnSubmitLoading" @click="handleSubmit()">确定</el-button>
    </div>
  </div>
</template>

<script>
import Api from '../api/index'
import { workBenchApi } from '@/api/work-bench'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'ApprovalPlanRegistration',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id || '',
      detailInfo: {},
      btnSubmitLoading: false,
      checked: undefined,
      opinion: ''
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    if (this.id) {
      this.getImplementRulesDetail()
    }
  },
  // 方法集合
  methods: {
    // 获取监理实施细则详情
    getImplementRulesDetail() {
      Api.getImplementRulesDetail(this.id).then(res => {
        this.detailInfo = res.data
      })
    },
    // 取消
    handleCancel() {
      this.$router.back()
    },
    // 确定
    handleSubmit() {
      if (this.checked) {
        this.btnSubmitLoading = true
        workBenchApi
          .completeTask(this.id, { flag: this.checked, remark: this.opinion })
          .then(res => {
            // console.log(res)
            this.$message.success('操作成功')
            this.$router.back()
          })
          .finally(() => {
            this.btnSubmitLoading = false
          })
      } else {
        this.$message.error('请选择审核结果')
      }
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
  .details-list {
    border: 1px solid rgba(193, 193, 193, 0.57);
    margin-bottom: 10px;
    padding: 10px 0;
    span {
      display: inline-block;
      margin-left: 10px;
    }
  }
  .detail-title {
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(193, 193, 193, 0.57);
    margin-bottom: 10px;
  }
}
</style>
