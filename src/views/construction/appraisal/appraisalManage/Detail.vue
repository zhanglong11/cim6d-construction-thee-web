<template>
  <div class="wrap">
    <el-form label-width="140px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="考勤组名称：">{{ detailData.attendanceGroupName }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="考勤组人员：">
            <span style="display: block">{{ ['管理人员', '劳务人员'][detailData.attendanceGroupType - 1] }}</span>
            <span>{{ detailData.attendanceGroupUserName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="考勤负责人：">{{ detailData.attendanceGroupPrincipalName }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="地点：">{{ detailData.locationName }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="有效范围：">{{ detailData.effectiveRange }}米</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="打卡时段：">{{
            '上班：' + detailData.workTime + '~下班：' + detailData.offDutyTime
          }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer-btn">
      <el-button @click="handleBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from '../api'
export default {
  name: 'AppraisalDetail',
  data() {
    return {
      id: this.$route.params.id || '',
      detailData: {}
    }
  },
  mounted() {},
  created() {
    if (this.id) {
      Api.getAttendanceClockInDetail(this.id).then(res => {
        this.detailData = res.data
      })
    }
  },
  methods: {
    // 返回
    handleBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-form-item__label {
  color: #999999;
  font-size: 16px;
}
div.wrap {
  padding-bottom: 40px;
}
</style>
