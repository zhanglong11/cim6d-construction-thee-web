<template>
  <div class="container no-padding" :class="{ inDialog, isFooter: !inDialog }">
    <component :is="inDialog ? 'div' : 'el-card'" class="box-card">
      <el-row :gutter="15">
        <el-col :span="inDialog ? 22 : 10">
          <div class="item-replay">
            <h3 class="title-h3">质量安全整改回复单</h3>
            <div class="from">
              <p class="b-t">工程名称:{{ form.engineeringName }}</p>
              <div class="item-body">
                <div>致:{{ form.rectificationReplyCompany }}</div>
                <div>
                  <p>附:(文字资料及照片):</p>
                  <div class="label-content" style="display: inline-block; vertical-align: top">
                    <FileList :ids="form.fileIds" />
                  </div>
                </div>
                <div class="right-desc">
                  <div>
                    <span>总承包单位(章):</span>
                    <span>项目负责人(签名):</span>
                    <span>年&nbsp;月&nbsp;日</span>
                  </div>
                </div>
              </div>
              <div class="item-body">
                <p>监理单位审查意见:</p>
                <div class="right-desc">
                  <div>
                    <span>项目监理机构(章):</span>
                    <span>总监监工程师(签名):</span>
                    <span>年&nbsp;月&nbsp;日</span>
                  </div>
                </div>
              </div>
              <div class="item-body">
                <p>建设单位审查意见:</p>
                <div class="right-desc">
                  <div>
                    <span>建设单位(章):</span>
                    <span>项目负责人(签名):</span>
                    <span>年&nbsp;月&nbsp;日</span>
                  </div>
                </div>
              </div>
              <div class="item-body" style="background-color: #fff">
                <h4 class="b-h4">针对住建局《责令整改通知书》</h4>
                <h5 class="b-h5">(深建市政改[2021]0566号)整改情况</h5>
                <div v-for="(item, index) of form.details" :key="index">
                  <div class="w-t">
                    <p>问题{{ index + 1 }}:{{ item.problemDescribe }}</p>
                    <p>整改情况:{{ item.rectificationSituation }}</p>
                  </div>
                </div>
                <div class="right-desc">
                  <div style="width: 190px; text-align: center">
                    <span style="margin-bottom: 5px">中交天津航道局有限公司</span>
                    <span>{{ form.engineeringName }}</span>
                    <span>年&nbsp;月&nbsp;日</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </component>
    <!-- 审批组件 start -->
    <CommonCheckFlow :id="id" ref="commonCheckCard"></CommonCheckFlow>
    <!-- 审批组件 end -->
    <div v-if="!inDialog" class="footer-btn">
      <template v-if="!isCheck">
        <el-button size="lg" @click="goBack()">取消</el-button>
        <el-button size="lg" @click="goDwon()">下载</el-button>
      </template>
      <template v-else>
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" :loading="btnAuditLoading" @click="handleSubmit">审核</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import Api from '../api'
export default {
  name: 'RectifyDetail',
  components: {
    // SelectLabourWorker
  },
  data() {
    return {
      id: this.$route.query.id || this.$route.query.targetId || '',
      form: {},
      inDialog: false,
      fileName: '质量安全整改回复单.doc',
      btnAuditLoading: false,
      detailInfo: {},
      isCheck: this.$route.query.isCheck || false
    }
  },
  computed: {},
  created() {
    if (this.id) {
      Api.getrectifyDetail(this.id).then(res => {
        console.log(res)
        this.form = { ...res.data }
        this.wrapperInfo()
      })
    }
  },
  methods: {
    // 返回
    goBack() {
      this.$router.back()
    },
    async goDwon() {
      let res = await Api.getQualitySafetyDown(this.id)
      saveAs(res.data, this.fileName ? this.fileName : 'download.doc')
    },
    //验收申请详情页
    wrapperInfo() {
      let info = this.form
      console.log(info)
      this.detailInfo = {
        targetId: info.qualityProblemId,
        approveName: info.creator,
        projectId: localStorage.getItem('projectId'),
        approveContent: [{ tableKey: '申请人', tableValue: info.creator }]
      }
      this.detailInfo.approveContent.push({ tableKey: '工程名称', tableValue: info.engineeringName })
      this.detailInfo.approveContent.push({ tableKey: '创建人', tableValue: info.creator })
      this.detailInfo.approveContent.push({ tableKey: '创建时间', tableValue: info.createTime })
    },
    //审核流程附件
    setAccessoryInfo() {
      let flag = true
      let approveContent = this.detailInfo.approveContent
      for (let i = 0; i < approveContent.length; i++) {
        if (approveContent[i].tableKey === '附件') {
          flag = false
          break
        }
      }
      if (flag) {
        this.detailInfo.approveContent.push({ tableKey: '附件', tableValue: this.getAccessoryInfo() })
      }
    },
    //提交审核
    handleSubmit() {
      this.btnAuditLoading = true
      this.$refs.commonCheckCard.audit()
      this.btnAuditLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.inDialog {
  max-height: calc(100vh - 230px);
  overflow-y: auto;
  overflow-x: hidden;
}
.el-input.temperature {
  display: flex;
  border-radius: 4px;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  .el-input__inner {
    border: none;
    width: 66px;
    text-align: center;
    padding: 0 3px;
  }
}
.item-replay {
  width: 100%;
  .title-h3 {
    text-align: center;
  }
  .from {
    border: 1px solid #999;
    background-color: #f4f4f4;
    .b-t {
      border-bottom: 1px solid #999;
      padding: 10px 2px;
    }
    .item-body {
      min-height: 300px;
      border-bottom: 1px solid #999;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      p {
        margin-bottom: 20px;
        padding-top: 5px;
      }
      .right-desc {
        display: flex;
        justify-content: flex-end;
        margin-right: 10%;
        margin-bottom: 5px;
        span {
          display: block;
          font-size: 14px;
          margin-bottom: 2px;
        }
      }
      .b-h4 {
        text-align: center;
        padding: 10px 0;
      }
      .b-h5 {
        text-align: center;
      }
      .w-t {
        padding: 10px;
      }
    }
  }
}
</style>
