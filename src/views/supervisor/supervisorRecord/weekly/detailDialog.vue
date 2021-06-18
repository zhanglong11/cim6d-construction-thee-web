<template>
  <el-dialog :title="'详情'" :visible="visible" width="820px" @close="handleCancel">
    <div class="details">
      <div class="details-list">
        <h4 class="detail-title"><span>监理周报基本信息</span></h4>
        <el-row>
          <el-col :md="12">
            <span class="label">单位工程名称</span>
            <span class="label-content">{{ detailInfo.engineeringName }}</span>
          </el-col>
          <el-col :md="12">
            <span class="label">时间</span>
            <span class="label-content">{{ `${detailInfo.reportStartDate}~${detailInfo.reportEndDate}` }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <span class="label">签阅人</span>
            <span class="label-content">{{ detailInfo.signPersonName }}</span>
          </el-col>
          <el-col :md="12">
            <span class="label">周报填写人</span>
            <span class="label-content">{{ detailInfo.creatorName }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="23">
            <span class="label">本周工程进度</span>
            <el-table :data="detailInfo.thisWeekList" stripe border align="center">
              <el-table-column type="index" width="50" label="序号"> </el-table-column>
              <el-table-column prop="workContent" label="工作内容名称"></el-table-column>
              <el-table-column prop="finishSituation" label="完成情况(%)"></el-table-column>
              <el-table-column prop="unfinishedReason" label="未完成原因"></el-table-column>
              <el-table-column prop="principal" label="负责人"></el-table-column>
              <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <br />
        <el-row>
          <el-col :md="23">
            <span class="label">下周工程安排</span>
            <el-table :data="detailInfo.nextWeekList" stripe border align="center">
              <el-table-column type="index" width="50" label="序号"> </el-table-column>
              <el-table-column prop="workContent" label="工作内容名称"></el-table-column>
              <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24">
            <span class="label">本周现场大事记</span>
            <span class="label-content">{{ detailInfo.breakingNews }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <span class="label">本周质量问题反馈</span>
            <span class="label-content">{{ detailInfo.qualityIssueFeedback }}</span>
          </el-col>
          <el-col :md="12">
            <span class="label">本周安全问题反馈</span>
            <span class="label-content">{{ detailInfo.safetyIssueFeedback }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24">
            <span class="label">本周工程照片</span>
            <div class="label-content" style="display: inline-block; vertical-align: top">
              <FileList :ids="detailInfo.engineeringImgIds" />
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24">
            <span class="label">监理周报附件</span>
            <div class="label-content" style="display: inline-block; vertical-align: top">
              <FileList :ids="detailInfo.fileIds" />
            </div>
          </el-col>
        </el-row>
      </div>
      <!--签阅文件填写 start-->
      <div v-if="detailInfo.status === 0 && sign === 1" class="details-list">
        <h4 class="detail-title"><span>签阅信息</span></h4>
        <el-form ref="form" :model="form" label-width="200px" :rules="formRules">
          <el-row>
            <el-col :md="12">
              <el-form-item label="总监理工程师签阅意见" prop="signOpinion">
                <el-input v-model="form.signOpinion" type="textarea" :rows="2" placeholder="请输入" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12">
              <el-form-item label="签阅附件">
                <FileEdit v-model="form.signFileIds" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!--签阅文件填写 end-->
      <!--签阅详情 start-->
      <div v-if="detailInfo.status === 1" class="details-list">
        <h4 class="detail-title"><span>签阅信息</span></h4>
        <el-row>
          <el-col :md="16">
            <span class="label">总监理工程师签阅意见</span>
            <span class="label-content">{{ detailInfo.signOpinion }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="16">
            <span class="label">签阅附件</span>
            <div class="label-content" style="display: inline-block; vertical-align: top">
              <FileList :ids="detailInfo.signFileIds" />
            </div>
          </el-col>
        </el-row>
      </div>
      <!--签阅详情end-->
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">返回</el-button>
      <el-button v-if="detailInfo.status === 0 && sign === 1" :loading="loading" @click="handleSubmit">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '@/views/supervisor/supervisorRecord/api'

export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'DetailLogDialog',
  props: {
    visible: Boolean,
    id: String,
    sign: [String, Number]
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
    //签阅文件提交
    async handleSubmit() {
      try {
        this.loading = true
        await this.$refs.form.validate()
        await Api.getWeeklySign({ ...this.form, id: this.id }).then(res => {
          if (res.code === 200) {
            this.loading = false
            this.$message.success('签阅成功')
            this.handleCancel()
            this.$parent.refresh()
          } else {
            this.$message.success('签阅失败')
          }
        })
      } catch (e) {
        this.loading = false
      }
    },
    // 获取详情
    getDetail() {
      Api.getWeeklyInfo(this.id).then(res => {
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
