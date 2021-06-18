<template>
  <div class="is-Footer" title="详情">
    <!-- 流程图 start -->
    <!-- <ViewFlow :id="id" :info="detailInfo" @setAccessoryInfo="setAccessoryInfo" />-->
    <!-- 流程图 end -->
    <div class="body-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <DetailItem label="验收名称" :value="info.acceptanceName"></DetailItem>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <DetailItem label="计划验收时间" :label-width="120" :value="info.acceptanceDate | ymd"></DetailItem>
        </el-col>
        <el-col :span="12">
          <DetailItem label="施工负责人" :value="info.constructionDirectorName"></DetailItem>
        </el-col>
      </el-row>
      <!--附件-->
      <FileTable :ids="info.fileIds"></FileTable>
      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="12">
          <DetailItem label="创建人" :value="info.creatorName"></DetailItem>
        </el-col>
        <el-col :span="12">
          <DetailItem label="创建日期" :value="info.createTime"></DetailItem>
        </el-col>
      </el-row>
    </div>
    <div class="footer-btn">
      <el-button v-if="!isCheck" @click="goBack">返回</el-button>
      <template v-else>
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" :loading="btnAuditLoading" @click="handleSubmit">审核</el-button>
      </template>
    </div>
    <!-- 审批组件 start -->
    <CommonCheckFlow :id="id" ref="commonCheckCard"></CommonCheckFlow>
    <!-- 审批组件 end -->
  </div>
</template>

<script>
import Api from './api'
import DetailItem from './components/detailItem'
import FileTable from './components/fileTable' //附件
export default {
  name: 'QualityInspectionDetail',
  components: { DetailItem, FileTable },
  data() {
    return {
      info: {
        fileIds: ''
      },
      btnAuditLoading: false,
      id: '',
      detailInfo: {}
    }
  },
  computed: {
    isCheck() {
      return this.$route.query.isCheck
    }
  },
  created() {
    this.id = this.$route.query.id
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    //获取详情
    async getDetail() {
      let res = await Api.getInspectionInfo(this.id)
      this.info = res.data
      this.wrapperInfo()
    },
    //验收申请详情页
    wrapperInfo() {
      let info = this.info
      this.detailInfo = {
        targetId: info.id,
        approveName: info.creator,
        projectId: localStorage.getItem('projectId'),
        approveContent: [{ tableKey: '申请人', tableValue: info.creator }]
      }
      this.detailInfo.approveContent.push({ tableKey: '验收名称', tableValue: info.acceptanceName })
      this.detailInfo.approveContent.push({ tableKey: '计划验收时间', tableValue: info.acceptanceDate })
      this.detailInfo.approveContent.push({ tableKey: '施工负责人', tableValue: info.constructionDirectorName })
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
    //返回上一级
    goBack() {
      this.$router.back()
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
@import './index.less';
</style>
