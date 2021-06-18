<template>
  <div class="detail-container" :class="{ inDialog, isFooter: !inDialog }">
    <component :is="inDialog ? 'el-card' : 'div'" class="box-card">
      <el-row :gutter="15">
        <el-col :span="inDialog ? 22 : 10">
          <div class="item-replay">
            <h3 class="title-h3">工程质量通知单</h3>
            <div class="s-p">
              <span>日期:{{ form.noticeDate | dateFonts }}</span>
              <span>编号:{{ form.qualityProblemCode }}</span>
            </div>
            <div class="from">
              <table border="0">
                <tr>
                  <td width="20%">工程名称</td>
                  <td width="80%" colspan="3">{{ form.engineeringName }}</td>
                  <!-- <td width="20%"></td> -->
                  <!-- <td width="20%"></td> -->
                </tr>
                <tr>
                  <td width="20%">协作单位</td>
                  <td width="40%">{{ form.collaborationCompany }}</td>
                  <td width="20%">施工内容</td>
                  <td width="20%">{{ form.constructionContent }}</td>
                </tr>
                <tr style="height: 100%">
                  <td width="100%" colspan="3">
                    <div class="conten">
                      <div>
                        <span class="line-p">{{ form.noticeContactCompany }}</span
                        ><span>公司:</span>
                      </div>
                      <div>
                        <div class="main-body">
                          <span>现场问题:</span>
                          <div class="desc-main">
                            {{ form.siteProblem }}
                          </div>
                        </div>
                        <div class="main-body">
                          <span>整改要求:</span>
                          <div class="desc-main">
                            {{ form.rectificationRequirements }}
                          </div>
                        </div>
                      </div>
                      <div class="desc">
                        <div style="width: 200px">
                          <p>{{ form.constructionCompany }}</p>
                          <p>{{ form.startDate | dateFonts }}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="20%">技术负责人</td>
                  <td width="40%">主办技术员</td>
                  <td width="20%">质量员</td>
                  <td width="20%">协作单位负责人</td>
                </tr>
                <tr>
                  <td width="20%"></td>
                  <td width="40%"></td>
                  <td width="20%"></td>
                  <td width="20%"></td>
                </tr>
              </table>
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
import { saveAs } from 'file-saver'
export default {
  name: 'QualityDetail',
  components: {
    // SelectLabourWorker
  },
  data() {
    return {
      id: this.$route.query.id || this.$route.query.targetId || '',
      form: {},
      inDialog: false,
      fileName: '工程质量通知单.doc',
      btnAuditLoading: false,
      detailInfo: {},
      isCheck: this.$route.query.isCheck || false
    }
  },
  computed: {},
  created() {
    if (this.id) {
      Api.getEngineeringDetail(this.id).then(res => {
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
      let res = await Api.getEngineeringQualityNoticeDown(this.id)
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
.from {
  background-color: #f4f4f4;
}
.item-replay {
  width: 100%;
  font-size: 14px;
  margin-bottom: 20px;
  .title-h3 {
    text-align: center;
  }
  .s-p {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  table {
    border: 1px solid #ccc;
    border-collapse: collapse;
    width: 100%;
    tr {
      width: 100%;
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ccc;
      td {
        display: inline-block;
        margin: auto 0;
        text-align: center;
        vertical-align: middle;
        height: 100%;
        word-wrap: break-word;
        word-break: normal;
        border-right: 1px solid #ccc;
        .conten {
          text-align: left;
          padding: 10px;
          min-height: 600px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .line-p {
            border-bottom: 1px solid #999;
            padding-bottom: 2px;
          }

          .main-body {
            margin-left: 20px;
            margin-bottom: 40px;
            .desc-main {
              line-height: 1.2;
            }
          }
          .desc {
            line-height: 1.4;
            display: flex;
            justify-content: flex-end;
          }
        }
      }

      td:last-child {
        border-right: none;
      }
    }
  }
}
</style>
