<template>
  <el-dialog title="详情" width="1400px" top="5vh" :visible="visible" @close="$emit('update:visible', false)">
    <div class="body-container">
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
import RectifyForm from './rectifyForm'
import ReviewForm from './reviewForm'
import FlowLine from './flowLine'
export default {
  name: 'DangerCheckDetail',
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
      info: {}
    }
  },
  computed: {
    //伤害类型
    harmTypeList() {
      return this.$getArgList('harmType') || []
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
      await this.$parent.refresh()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
</style>
