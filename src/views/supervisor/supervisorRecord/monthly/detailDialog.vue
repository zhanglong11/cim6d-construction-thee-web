<template>
  <el-dialog :title="'详情'" :visible="visible" width="820px" @close="handleCancel">
    <div class="details">
      <div class="details-list">
        <h4 class="detail-title"><span>监理月报基本信息</span></h4>
        <el-row>
          <el-col :md="12">
            <span class="label">监理月报名称</span>
            <span class="label-content">{{ detailInfo.name }}</span>
          </el-col>
          <el-col :md="12">
            <span class="label">年度</span>
            <span class="label-content">{{ detailInfo.year }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <span class="label">月度</span>
            <span class="label-content">{{ detailInfo.month }}</span>
          </el-col>
          <el-col :md="12">
            <span class="label">编制人</span>
            <span class="label-content">{{ detailInfo.writerName }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <span class="label">编制日期</span>
            <span class="label-content">{{ detailInfo.writeDate }}</span>
          </el-col>
          <el-col :md="12">
            <span class="label">监理月报备注</span>
            <span class="label-content">{{ detailInfo.remark }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24">
            <span class="label">监理月报附件</span>
            <div class="label-content" style="display: inline-block; vertical-align: top">
              <FileList :ids="detailInfo.fileIds" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">返回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '@/views/supervisor/supervisorRecord/api'

export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'DetailImplementRulesDialog',
  props: {
    visible: Boolean,
    id: String
  },
  // 这里存放数据
  data() {
    return {
      detailInfo: {},
      form: {},
      loading: false,
      formRules: {
        signOpinion: [{ required: true, message: '必填' }]
      }
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    if (this.id) {
      this.getDetail()
    }
  },
  // 方法集合
  methods: {
    // 取消
    handleCancel() {
      this.$emit('update:visible', false)
    },
    // 获取详情
    getDetail() {
      Api.getMonthlyInfo(this.id).then(res => {
        this.detailInfo = res.data || {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.details {
  margin-top: -20px;
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
/deep/.el-dialog__body {
  padding: 20px 20px 30px 20px;
}
</style>
