<template>
  <div class="is-footer">
    <div class="common-table">
      <h2 style="text-align: center">{{ title }}</h2>
      <h4 style="margin: 20px 0 5px 0">项目名称:{{ projectName }}</h4>
      <table class="detail-table" border="1" cellspacing="0" cellpadding="50">
        <tr>
          <th width="80">序号</th>
          <th>分项工程</th>
          <th width="120">单位</th>
          <th width="200">截止上期计量工程量</th>
          <th width="150">本期计量工程量</th>
          <th width="150">累计工程量</th>
          <th width="200">备注</th>
        </tr>
        <template v-for="(item, index) of tableData || []">
          <tr :key="'td' + index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.unit }}</td>
            <td>{{ item.asOfLastPeriodEngineeringAmounts }}</td>
            <td>{{ item.thisIssueEngineeringAmounts }}</td>
            <td>{{ item.totleEngineeringAmounts }}</td>
            <td>{{ item.remark }}</td>
          </tr>
        </template>
      </table>
      <ul class="table-info">
        <li>
          施工单位：<span class="table-info-value">{{ creator }}</span>
        </li>
        <li>
          监理单位：<span class="table-info-value">{{ engineerAuditorNamePartA }}</span>
        </li>
        <li>
          日期：<span class="table-info-value">{{ auditorNamePartB }}</span>
        </li>
        <li>
          日期：<span class="table-info-value">{{ manageAuditorNamePartA }}</span>
        </li>
      </ul>
    </div>
    <div class="footer-btn">
      <el-button size="lg" @click="$router.back()">返 回</el-button>
      <el-button type="primary" size="lg" @click="download">下 载</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/views/construction/engineeringAmountManage/api'

export default {
  name: 'OwnerReceiveAmountDetail',
  components: {},
  data() {
    return {
      id: this.$route.params.id || '',
      tableData: [],
      title: '',
      projectName: '',
      month: '',
      creator: '',
      engineerAuditorNamePartA: '',
      auditorNamePartB: '',
      manageAuditorNamePartA: ''
    }
  },
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    async getDetail() {
      let res1 = await Api.getTotalPayAmountInfoDetail(this.id)
      this.title = res1.data.title || ''
      this.projectName = res1.data.engineeringName || ''
      this.month = res1.data.yearMonth || ''
      let res = await Api.getTotalPayAmountDetail(this.id)
      this.tableData = res.data
    },
    async download() {
      const res = await Api.downloadOwnerReceiveAmount(this.id)
      saveAs(res.data, `${this.month}总包汇总工程量.xlsx`)
    }
  }
}
</script>

<style lang="less" scoped>
@border-color: #6f6f6f;
.detail-table {
  width: 100%;
  text-align: center;
  line-height: 1.5;
  .align-left {
    text-align: left;
  }
  td {
    padding: 3px 5px;
  }
  tr {
    &.bold {
      font-weight: bolder;
    }
  }
}
.table-info {
  display: flex;
  flex-wrap: wrap;
  line-height: 4;
  margin-top: 10px;
  li {
    flex: 0 0 50%;
    .table-info-value {
      font-size: 14px;
    }
  }
}
</style>
