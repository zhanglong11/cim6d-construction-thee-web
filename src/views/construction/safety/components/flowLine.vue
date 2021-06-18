<template>
  <div>
    <div class="timeline">
      <div v-for="(item, index) in timelineList" :key="index" class="item">
        <div @click="handleClick(item)">
          <p>{{ item.statusText }}</p>
          <p v-if="item.operator">{{ item.operatorLabel }}:{{ item.operator }}</p>
          <p v-if="item.operatorTime">{{ item.timeLabel }}:{{ item.operatorTime | ymd }}</p>
        </div>
      </div>
    </div>
    <CheckDetail v-if="type === 'check'" :info="itemInfo"></CheckDetail>
    <RectifyDetail v-if="type === 'rectify'" :info="itemInfo"></RectifyDetail>
    <ReviewDetail v-if="type === 'review'" :info="itemInfo"></ReviewDetail>
  </div>
</template>

<script>
import RectifyDetail from './rectifyDetail'
import Api from '../api'
import ReviewDetail from './reviewDetail'
import CheckDetail from './checkDetail'
export default {
  name: 'FlowLine',
  components: { CheckDetail, RectifyDetail, ReviewDetail },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      timelineList: [],
      type: '',
      itemInfo: {}
    }
  },
  watch: {
    info: {
      immediate: true,
      handler(val) {
        this.init(val)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    init(data) {
      this.timelineList = []
      if ([0, 1].includes(data.firstInspectStatus)) {
        this.timelineList.push({
          type: 'check',
          statusText: `检查${data.firstInspectStatus === 0 ? '不合格' : '合格'}`,
          operatorLabel: '检查人',
          operator: data.creatorName,
          timeLabel: '检查时间',
          operatorTime: data.createTime,
          param: {}
        })
      } else {
        this.timelineList.push({
          statusText: `开始`
        })
      }
      for (let item of data.rectifyReviewList || []) {
        let resultContent = ['不合格', '合格']
        //整改
        if (item.rectifyReviewFlag === 0) {
          this.timelineList.push({
            type: 'rectify',
            statusText: '整改完成',
            operatorLabel: '整改人',
            operator: item.rectifyPrincipalName,
            timeLabel: '整改日期',
            operatorTime: item.rectifyTime,
            param: { ...item }
          })
        } else {
          this.timelineList.push({
            type: `review`,
            statusText: `复查${resultContent[item.reviewResult]}`,
            operatorLabel: `复查人`,
            operator: item.reviewPrincipalName,
            timeLabel: `复查日期`,
            operatorTime: item.reviewTime,
            param: { ...item }
          })
          if (item.reviewResult === 1) {
            this.timelineList.push({
              statusText: `结束`
            })
          }
        }
      }
      this.showLast()
    },
    //默认打开最后一个
    showLast() {
      let data = this.info.rectifyReviewList || []
      let resultContent = ['不合格', '合格']
      let item
      let lastItem
      if (data.length) {
        lastItem = data[data.length - 1]
        if (lastItem.rectifyReviewFlag === 0) {
          item = {
            type: 'rectify',
            statusText: '整改完成',
            operatorLabel: '整改人',
            operator: lastItem.rectifyPrincipalName,
            timeLabel: '整改日期',
            operatorTime: lastItem.rectifyTime,
            param: { ...lastItem }
          }
        } else {
          item = {
            type: `review`,
            statusText: `复查${resultContent[lastItem.reviewResult]}`,
            operatorLabel: `复查人`,
            operator: lastItem.reviewPrincipalName,
            timeLabel: `复查日期`,
            operatorTime: lastItem.reviewTime,
            param: { ...lastItem }
          }
        }
        this.handleClick(item)
      } else {
        if ([0, 1].includes(this.info.firstInspectStatus)) {
          item = {
            type: 'check',
            statusText: `检查${this.info.firstInspectStatus === 0 ? '不合格' : '合格'}`,
            operatorLabel: '检查人',
            operator: this.info.creatorName,
            timeLabel: '检查时间',
            operatorTime: this.info.createTime,
            param: {}
          }
          this.handleClick(item)
        }
      }
    },
    async handleClick(item) {
      this.type = item.type
      if (item.type === 'check') {
        this.itemInfo = {
          result: this.info.firstInspectStatus,
          location: this.info.dangerSourcePlaceName,
          dangerStartTime: this.info.timelinessStartTime,
          dangerEndTime: this.info.timelinessEndTime,
          desc: this.info.problemDesc,
          fileIds: this.info.fileId,
          principalName: this.info.rectifyPrincipalName,
          deadline: this.info.rectifyDeadline,
          remark: this.info.remark
        }
      }
      //整改
      if (item.type === 'rectify') {
        this.itemInfo = {
          name: '整改',
          rectifyTime: item.operatorTime,
          operator: item.operator,
          rectifyContent: item.param.rectifyContent,
          fileIds: item.param.rectifyFileId
        }
      }
      //复查
      if (item.type === 'review') {
        this.itemInfo = {
          name: '复查',
          result: item.param.reviewResult,
          rectifyTime: item.operatorTime,
          operator: item.operator,
          reviewOpinion: item.param.reviewOpinion,
          fileIds: item.param.reviewFileId
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.timeline {
  display: flex;
  flex-wrap: wrap;
  margin: 10 -10px;
  .item {
    width: 160px;
    height: 160px;
    background-color: #00a6ff;
    color: #fff;
    margin: 10px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    font-size: 13px;
    border: 2px solid #fffc;
    box-shadow: 5px 5px 5px #3333;
    position: relative;
    &:hover {
      cursor: pointer;
    }
    & + .item {
      margin-left: 120px;
      &:before {
        content: '';
        display: block;
        width: 100px;
        height: 30px;
        position: absolute;
        top: 70px;
        left: -120px;
        background: url(~@/assets/images/arrow.png) no-repeat;
      }
    }
  }
}
</style>
