<template>
  <div class="detail-container">
    <el-card class="box-card" shadow="never" style="margin: 10px">
      <div slot="header" class="clearfix">
        <span>危险源详情</span>
        <el-button style="float: right; padding: 3px 0" type="text"></el-button>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="危险源名称" :value="info.dangerSource"></DetailItem>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="伤害类型" :value="$getLabel(harmTypeList, info.harmCategory)"></DetailItem>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="防范措施" :value="info.precautionaryMeasure"></DetailItem>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="备注" :value="info.dangerSourceRemark"></DetailItem>
          </el-col>
        </el-row>
        <!--附件-->
        <el-row :gutter="20">
          <el-col>
            <DetailItem label="附件"><FileTable :ids="info.fileId"></FileTable></DetailItem>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!--时间轴 start-->
    <FlowLine :info="info"></FlowLine>
    <!--时间轴  end-->
    <!--整改人 start-->
    <template v-if="viewType === 'rectify'">
      <RectifyForm ref="rectifyForm"></RectifyForm>
    </template>
    <!--整改人 end-->
    <!--复查人 start-->
    <template v-if="viewType === 'review'">
      <ReviewForm ref="reviewForm"></ReviewForm>
    </template>
    <!--复查人 end-->
    <div class="footer-btn">
      <el-button @click="goBack">返回</el-button>
      <template v-if="viewType">
        <el-button v-promise-btn type="primary" @click="handleSave">保 存</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import Api from './api'
import DetailItem from '@/views/construction/quality/components/detailItem'
import FileTable from '@/views/construction/quality/components/fileTable' //附件
import RectifyForm from './components/rectifyForm'
import ReviewForm from './components/reviewForm'
import FlowLine from './components/flowLine'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'DangerCheckDetail',
  components: { DetailItem, FileTable, RectifyForm, ReviewForm, FlowLine },
  data() {
    // 这里存放数据
    return {
      projectId: localStorage.getItem('projectId'),
      id: this.$route.query.id || '',
      viewType: this.$route.query.viewType || '',
      info: {}
    }
  },
  computed: {
    //伤害类型
    harmTypeList() {
      return this.$getArgList('harmType') || []
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
      let res = await Api.getDangerInspectDetail(this.id)
      this.info = res.data
    },
    //整改或复查保存
    async handleSave() {
      if (this.viewType === 'rectify') {
        let data = await this.$refs.rectifyForm.validForm()
        if (data) {
          await Api.handleDangerRectify({
            ...data,
            inspectRecordId: this.id,
            rectifyPrincipal: this.info.rectifyPrincipal
          })
        } else {
          return false
        }
      }
      if (this.viewType === 'review') {
        let data = await this.$refs.reviewForm.validForm()
        if (data) {
          await Api.handleDangerReview({
            ...data,
            inspectRecordId: this.id,
            reviewPrincipal: this.info.creator,
            id: this.info.rectifyReviewList[this.info.rectifyReviewList.length - 1].rectifyReviewId
          })
        } else {
          return false
        }
      }
      this.$message.success('保存成功')
      setTimeout(() => {
        this.$router.back()
      }, 500)
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
