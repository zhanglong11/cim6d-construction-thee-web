<template>
  <div class="container no-padding" :class="{ inDialog, isFooter: !inDialog }">
    <component :is="inDialog ? 'div' : 'el-card'" class="box-card">
      <el-row :gutter="15">
        <el-col :span="inDialog ? 22 : 10">
          <div class="item-replay">
            <h3 class="title-h3">工作业务联系单</h3>
            <div class="display-sb">
              <span
                >工程名称:<span>{{ form.engineeringName }}</span></span
              >
              <span
                >编号:<span class="font14">{{ form.qualityProblemCode }}</span></span
              >
            </div>
            <div class="from">
              <div class="item-body">
                <div>
                  <p class="s-s">
                    致:<b class="font14">{{ form.noticeContactCompany }}</b>
                  </p>
                  <p class="s-p">
                    事由:<b class="font14">{{ form.reason }}</b>
                  </p>
                </div>
                <div class="ppp">
                  <p>具体内容如下:</p>
                  <div class="font14" style="text-indent: 2em">{{ form.concreteContent }}</div>
                </div>
                <div class="f-j">妥否,请批示。</div>
                <div class="f-j">
                  <p>附件为:</p>
                  <div class="label-content" style="display: inline-block; vertical-align: top">
                    <FileList :ids="form.fileIds" />
                  </div>
                </div>
                <div class="right-desc">
                  <div class="sign">
                    <span
                      >施工单位(盖章):<b>{{ form.constructionCompany }}</b></span
                    >
                    <span>日期:<b></b></span>
                  </div>
                </div>
              </div>
              <hr />
              <div class="item-body">
                <p class="s-s">建设单位意见:</p>
                <div class="right-desc">
                  <div class="desc-sign">
                    <div>
                      <span> 建设单位代表(签字):<b></b> </span>
                      <span>日期:<b></b></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p style="font-size: 14px">注:本表一式多份,相关单位各一份.</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 审批组件 start -->
      <CommonCheckFlow :id="id" ref="commonCheckCard"></CommonCheckFlow>
      <!-- 审批组件 end -->
    </component>
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
  name: 'WorkDetail',
  components: {
    // SelectLabourWorker
  },
  data() {
    return {
      id: this.$route.query.id || this.$route.query.targetId || '',
      form: {},
      inDialog: false,
      weatherInfo: {},
      rules: {
        diaryDate: [{ required: true, message: '必填' }]
      },
      btnSaveLoading: false,
      fileName: '工作业务联系单.doc',
      detailInfo: {},
      isCheck: this.$route.query.isCheck || false
    }
  },
  computed: {},
  created() {
    if (this.id) {
      Api.getworkDetail(this.id).then(res => {
        this.form = res.data
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
      let res = await Api.getworkBusinessDown(this.id)
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
  font-size: 14px;
  margin-bottom: 20px;
  .title-h3 {
    text-align: center;
    margin-bottom: 10px;
  }
  .display-sb {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .font14 {
    font-size: 14px;
  }
  .from {
    border: 1px solid #000;
    margin-bottom: 10px;
    background-color: #f4f4f4;
    .b-t {
      border-bottom: 1px solid #999;
      padding: 10px 2px;
    }
    .item-body {
      min-height: 400px;
      padding: 10px 30px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      b {
        min-width: 40px;
        display: inline-block;
        border-bottom: 1px solid;
      }
      .s-s {
        margin-bottom: 20px;
      }
      .s-p {
        margin-bottom: 20px;
      }
      .ppp {
        margin-bottom: 20px;
      }
      .f-j {
        margin-bottom: 10px;
      }
      .right-desc {
        position: relative;
        // overflow: hidden;
        margin: 20px 0;
        height: 150px;
        .sign {
          position: absolute;
          right: 20px;
          bottom: 5px;
          span {
            display: block;
            font-size: 14px;
            margin-bottom: 2px;
          }
        }
      }
      .desc-sign {
        position: absolute;
        right: 20px;
        bottom: 5px;
        font-size: 14px;
      }
    }
  }
}
</style>
