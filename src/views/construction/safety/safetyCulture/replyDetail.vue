<template>
  <div class="container no-padding" :class="{ inDialog, isFooter: !inDialog }">
    <component :is="inDialog ? 'div' : 'el-card'" class="box-card">
      <el-row :gutter="15">
        <el-col :span="inDialog ? 22 : 12">
          <div class="item-replay">
            <h3 class="title-h3">周安全检查回复表</h3>
            <div class="from">
              <table border="0">
                <tr>
                  <td width="20%">工程名称</td>
                  <td width="40%">
                    <span class="td-span">
                      {{ form.engineeringName }}
                    </span>
                  </td>
                  <td width="20%">检查区域</td>
                  <td width="20%">
                    <span class="td-span">{{ form.checkArea }}</span>
                  </td>
                </tr>
                <tr>
                  <td width="20%">整改单位</td>
                  <td width="40%">
                    <span class="td-span">{{ form.rectificationReplyCompany }}</span>
                  </td>
                  <td width="20%">整改期限</td>
                  <td width="20%">
                    <span class="td-span">{{ form.rectificationTerm }}</span>
                  </td>
                </tr>
                <tr>
                  <td width="60%" colspan="2">整改通知书编号</td>
                  <td width="40%">
                    <span class="td-span">{{ form.rectificationNoticeNo }}</span>
                  </td>
                </tr>
                <tr style="height: 100%">
                  <td width="3%">需整改内容</td>
                  <td width="97%" colspan="3">
                    <div class="conten">
                      <div class="main">
                        {{ form.rectificationContent }}
                      </div>
                      <div class="desc">
                        <p>项目负责人签名:</p>
                        <p>项目章:</p>
                        <p>年&nbsp;月&nbsp;日</p>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr style="height: 100%">
                  <td width="3%" style="padding-top: 13%">监理单位意见</td>
                  <td width="97%" colspan="3">
                    <div class="conten">
                      <div class="main"></div>
                      <div class="desc">
                        <p>(总监理工程师/总监代表)签名:</p>
                        <p>项目章:</p>
                        <p>年&nbsp;月&nbsp;日</p>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr style="height: 100%">
                  <td width="3%">建设单位意见</td>
                  <td width="97%" colspan="3">
                    <div class="conten">
                      <div class="main"></div>
                      <div class="desc">
                        <p>主管工程师签名:</p>
                        <p>项目章:</p>
                        <p>年&nbsp;月&nbsp;日</p>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </el-col>
        <el-col :span="inDialog ? 22 : 19">
          <div class="item-body">
            <div class="titles">
              <h3 class="title-h3">海洋新兴产业基地项目安全检查记录</h3>
            </div>
            <div class="item-main">
              <el-row>
                <el-col>
                  <el-table
                    :data="form.hiddenDangerDetails"
                    style="width: 100%"
                    border
                    :header-cell-style="{ background: '#fff', borderColor: '#fff' }"
                  >
                    <el-table-column type="index" label="序号" align="center"></el-table-column>
                    <el-table-column label="隐患排查">
                      <el-table-column prop="locationActivity" label="位置/活动"> </el-table-column>
                      <el-table-column prop="hiddenDangerProblemDescribe" label="存在隐患或问题描述"> </el-table-column>
                      <el-table-column prop="hiddenDangerFileIds" label="隐患照片" width="200">
                        <template #default="{ row }">
                          <ImgList :ids="row.hiddenDangerFileIds" />
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column label="隐患整改">
                      <el-table-column prop="rectificationPerson" label="整改人"> </el-table-column>
                      <el-table-column prop="rectificationMeasures" label="整改措施"> </el-table-column>
                      <el-table-column prop="afterRectificationFileIds" label="整改后照片" width="200">
                        <template #default="{ row }">
                          <ImgList :ids="row.afterRectificationFileIds" />
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column label="整改验收">
                      <el-table-column prop="qualifiedStatus" label="是否合格">
                        <template #default="{ row }">
                          {{ $getLabel(quaStatus, row.qualifiedStatus) }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="acceptanceTime" label="验收时间">
                        <template #default="{ row }">
                          {{ row.acceptanceTime ? moment(row.acceptanceTime).format('YYYY-MM-DD') : '' }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="" label="验收人（笔签）"> </el-table-column>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
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
import { quaStatus } from '../lib/safetyStauas'
// import ImagePreview from '@/components/ImagePreview'
import ImgList from '../components/imgList' //附件
export default {
  name: 'ReplyDetail',
  components: {
    // SelectLabourWorker
    // ImagePreview
    ImgList
  },
  data() {
    return {
      quaStatus,
      id: this.$route.query.id || this.$route.query.targetId || '',
      form: {},
      inDialog: false,
      fileName: '周安全检查回复表.doc',
      fileNameForm: '安全检查记录.doc',
      btnAuditLoading: false,
      detailInfo: {},
      isCheck: this.$route.query.isCheck || false
    }
  },
  computed: {},
  created() {
    if (this.id) {
      Api.getReplyDetail(this.id).then(res => {
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
      let res = await Api.getWeekCheckDown(this.id)
      let resForm = await Api.getWeekCheckDownForm(this.id)
      saveAs(res.data, this.fileName ? this.fileName : 'download.doc')
      saveAs(resForm.data, this.fileNameForm ? this.fileNameForm : 'download.doc')
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
/deep/.el-table .cell {
  max-height: 200px;
  overflow: auto;
}
.td-span {
  display: inline-block;
  line-height: 1.1;
  text-align: center;
}
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
  margin-bottom: 20px;
  .title-h3 {
    text-align: center;
    margin-bottom: 10px;
  }
  .from {
    background-color: #f4f4f4;
  }
  table {
    border: 1px solid #ccc;
    border-collapse: collapse;
    width: 100%;
    // table-layout: fixed;
    tr {
      width: 100%;
      height: 50px;
      // display: block;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ccc;
      // align-items: center;
      // justify-content: center;
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
          .main {
            padding: 3px;
            line-height: 1.4;
            margin-bottom: 5px;
            text-align: left;
          }
          .desc {
            text-align: right;
            font-size: 14px;
            padding-right: 10%;
          }
          .desc p {
            line-height: 23px;
          }
        }
      }
      td:last-child {
        border-right: none;
      }
    }
  }
}
.item-body {
  .titles {
    text-align: center;
    margin-bottom: 5px;
    width: 100%;
    .title-h3 {
      margin: 0 auto;
      width: 390px;
      border-bottom: 2px solid #000;
    }
  }
}
.item-main {
  border: 1px solid #ccc;
  font-size: 14px;
  overflow: hidden;
  margin-bottom: 0px;
  .item-hdc {
    h3 {
      text-align: center;
      border-bottom: 1px solid #ccc;
      padding: 10px;
    }
    h4 {
      border-bottom: 1px solid #ccc;
      font-size: 16px;
      padding: 10px;
      font-weight: normal;
    }
    .b-t {
      display: inline-block;
      margin-left: 40px;
      padding: 8px 30px;
      background: red;
      border: none;
      color: #fff;
      border-radius: 10%;
    }
  }
  .f-o {
    span {
      display: inline-block;
      padding: 20px;
    }
  }
}
</style>
