<template>
  <div class="detail-container">
    <el-card class="box-card" shadow="never" style="margin: 10px">
      <div slot="header" class="clearfix">
        <span>质量问题详情</span>
        <el-button style="float: right; padding: 3px 0" type="text"></el-button>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="问题部位" :value="info.problemArea"></DetailItem>
          </el-col>
          <el-col :span="12">
            <DetailItem label="问题描述" :value="info.problemDesc"></DetailItem>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <DetailItem label="照片">
              <!--              <FileTable :ids="info.fileId"></FileTable>-->
              <ImgList :ids="info.fileId"></ImgList>
            </DetailItem>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="整改人" :value="info.rectifyPrincipalName"></DetailItem>
          </el-col>
          <el-col :span="12">
            <DetailItem label="整改期限">{{ info.rectifyDeadline | ymd }}</DetailItem>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="检查人" :value="info.creatorName"></DetailItem>
          </el-col>
          <el-col :span="12">
            <DetailItem label="检查时间" :value="info.inspectTime"></DetailItem>
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
import DetailItem from './components/detailItem'
import FileTable from './components/fileTable' //附件
import ImgList from './components/imgList' //附件
import RectifyForm from './components/rectifyForm' //整改表单
import ReviewForm from './components/reviewForm' //复查表单
import FlowLine from './components/flowLine' //检查流程
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'QualityIssueDetail',
  components: { DetailItem, RectifyForm, ReviewForm, FlowLine, ImgList },
  data() {
    // 这里存放数据
    return {
      projectId: localStorage.getItem('projectId'),
      id: this.$route.query.id || '',
      viewType: this.$route.query.viewType || '',
      info: {}
    }
  },
  computed: {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  created() {
    this.getDetail()
  },
  // 方法集合
  methods: {
    //获取详情
    async getDetail() {
      let res = await Api.getIssueDetailById(this.id)
      this.info = res.data
    },
    //整改或复查保存
    async handleSave() {
      if (this.viewType === 'rectify') {
        let data = await this.$refs.rectifyForm.validForm()
        if (data) {
          await Api.handleRectify({ ...data, inspectRecordId: this.id, rectifyPrincipal: this.info.rectifyPrincipal })
        } else {
          return false
        }
      }
      if (this.viewType === 'review') {
        let data = await this.$refs.reviewForm.validForm()
        if (data) {
          await Api.handleReview({
            ...data,
            inspectRecordId: this.id,
            //reviewPrincipal: this.info.creator,
            id: this.info.rectifyReviewList[this.info.rectifyReviewList.length - 1].rectifyReviewId
          })
        } else {
          return false
        }
      }
      this.$router.back()
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
