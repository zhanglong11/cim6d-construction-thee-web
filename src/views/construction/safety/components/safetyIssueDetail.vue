<template>
  <el-dialog title="详情" width="1200px" top="10vh" :visible="visible" @close="$emit('update:visible', false)">
    <div class="body-container">
      <el-card class="box-card" shadow="never" style="margin: 10px">
        <div slot="header" class="clearfix">
          <span>安全问题</span>
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
              <DetailItem label="照片"> <FileTable :ids="info.fileId"></FileTable></DetailItem>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <DetailItem label="整改人" :value="info.rectifyPrincipalName"></DetailItem>
            </el-col>
            <el-col :span="12">
              <DetailItem label="整改期限" :value="info.rectifyDeadline"></DetailItem>
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
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">返 回</el-button>
      <template v-if="viewType">
        <el-button v-promise-btn type="primary" @click="handleSave">保 存</el-button>
      </template>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api'
import DetailItem from '@/views/construction/quality/components/detailItem'
import FileTable from '@/views/construction/quality/components/fileTable' //附件
import RectifyForm from '@/views/construction/quality/components/rectifyForm' //整改表单
import ReviewForm from '@/views/construction/quality/components/reviewForm' //复查表单
import FlowLine from '@/views/construction/quality/components/flowLine' //检查流程
export default {
  name: 'SafetyIssueDetail',
  components: { DetailItem, FileTable, RectifyForm, ReviewForm, FlowLine },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    viewType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      info: {
        tableData: []
      }
    }
  },
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
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
            reviewPrincipal: this.info.creator,
            id: this.info.rectifyReviewList[this.info.rectifyReviewList.length - 1].rectifyReviewId
          })
        } else {
          return false
        }
      }
      await this.$parent.refresh()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
</style>
