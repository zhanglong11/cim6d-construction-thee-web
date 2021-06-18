<template>
  <div class="detail-container">
    <!-- 流程图 start -->
    <!-- <ViewFlow :id="id" :info="detailInfo" @setAccessoryInfo="setAccessoryInfo" />-->
    <!-- 流程图 end -->
    <el-card class="box-card" shadow="never" style="margin: 10px">
      <div slot="header" class="clearfix">
        <span>详情</span>
        <el-button style="float: right; padding: 3px 0" type="text"></el-button>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="工种" :value="$getLabel(workTypeList, info.workType)"></DetailItem>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="施工部位" :value="info.constructionArea"></DetailItem>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="作业类型/内容" :value="info.taskContentType"></DetailItem>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="施工负责人" :value="info.constructionMangerName"></DetailItem>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="计划起始日期">{{ info.planStartDate | ymd }}~{{ info.planEndDate | ymd }} </DetailItem>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="安全防护措施" :value="info.safetyPrecautions"></DetailItem>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col>
            <DetailItem label="附件"><FileTable :ids="info.fileId"></FileTable></DetailItem>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="创建人" :value="info.creatorName"></DetailItem>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="创建时间" :value="info.createTime"></DetailItem>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 审批组件 start -->
    <CommonCheckFlow :id="id" ref="commonCheckCard"></CommonCheckFlow>
    <!-- 审批组件 end -->
    <div class="footer-btn">
      <el-button v-if="!isCheck" @click="goBack">返回</el-button>
      <template v-else>
        <el-button @click="goBack">取消</el-button>
        <el-button v-promise-btn type="primary" @click="handleAudit">审核</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import Api from './api'
import statusList from './lib/auditStatus'
import DetailItem from '@/views/construction/quality/components/detailItem'
import FileTable from '@/views/construction/quality/components/fileTable' //附件
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'SpecialDetail',
  components: { DetailItem, FileTable },
  data() {
    // 这里存放数据
    return {
      projectId: localStorage.getItem('projectId'),
      id: this.$route.query.id || '',
      isCheck: this.$route.query.isCheck || this.$route.query.isCheck || false,
      statusList,
      info: {},
      detailInfo: {}
    }
  },
  computed: {
    //工种类型
    workTypeList() {
      return this.$getArgList('workType') || [{ value: 1, label: '架子工' }]
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  created() {
    this.getDetail()
  },
  // 方法集合
  methods: {
    //获取详情
    async getDetail() {
      let res = await Api.getSpecialDetail(this.id)
      this.info = res.data
      this.wrapperInfo()
    },
    wrapperInfo() {
      let info = this.info
      this.detailInfo = {
        targetId: info.id,
        approveName: info.creator,
        projectId: localStorage.getItem('projectId'),
        approveContent: [{ tableKey: '申请人', tableValue: info.creator }]
      }
      this.detailInfo.approveContent.push({
        tableKey: '工种',
        tableValue: this.$getLabel(this.workTypeList, info.workType)
      })
      this.detailInfo.approveContent.push({ tableKey: '施工部位', tableValue: info.constructionArea })
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
    handleAudit() {
      this.$refs.commonCheckCard.audit()
    },
    //返回
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
