<template>
  <div class="is-footer">
    <div class="common-table">
      <table class="detail-table" border="1" cellspacing="0" cellpadding="50">
        <tr>
          <td colspan="8">
            <h4>{{ tableTitle }}</h4>
            <h4>{{ tableSubTitle }}</h4>
          </td>
        </tr>
        <template v-if="tableData.length">
          <template v-for="(item, index) of tableData || []">
            <tr :key="'l1' + index">
              <td colspan="2">单位(子单位)工程名称：</td>
              <td colspan="6" class="align-left">{{ item.name }}</td>
            </tr>
            <tr v-if="index === 0" :key="'header' + index">
              <th width="80">序号</th>
              <th width="200">施工部位</th>
              <th>项目名称</th>
              <th width="120">单位</th>
              <th width="150">截止上期计量工程量</th>
              <th width="150">本期计量工程量</th>
              <th width="150">合计</th>
              <th width="200">备注</th>
            </tr>
            <template v-for="subItem of item.childrens">
              <template v-for="(subSubItem, ii) of subItem.childrens">
                <tr
                  v-for="(subSubSubItem, iii) of subSubItem.engineeringAmountsSummaryYearMonthList"
                  :key="'sss' + ii + iii"
                >
                  <td v-if="iii === 0" :rowspan="subSubItem.engineeringAmountsSummaryYearMonthList.length">
                    {{ ii + 1 }}
                  </td>
                  <td v-if="iii === 0" :rowspan="subSubItem.engineeringAmountsSummaryYearMonthList.length">
                    {{ subItem.name }}
                  </td>
                  <td v-if="iii === 0" :rowspan="subSubItem.engineeringAmountsSummaryYearMonthList.length">
                    {{ subSubItem.name }}
                  </td>
                  <td v-if="iii === 0" :rowspan="subSubItem.engineeringAmountsSummaryYearMonthList.length">
                    {{ subSubItem.unit }}
                  </td>
                  <td>{{ subSubSubItem.asOfLastPeriodEngineeringAmounts }}</td>
                  <td>{{ subSubSubItem.thisIssueEngineeringAmounts }}</td>
                  <td>
                    {{ subSubSubItem.asOfLastPeriodEngineeringAmounts + subSubSubItem.thisIssueEngineeringAmounts }}
                  </td>
                  <td>
                    <el-tooltip class="item" effect="dark" :content="subSubSubItem.remark" placement="top-start">
                      <div class="ellipsis" style="width: 200px">{{ subSubSubItem.remark }}</div>
                    </el-tooltip>
                  </td>
                </tr>
              </template>
              <!--<tr :key="'l2total' + i" class="bold">
              <td colspan="4">{{ subItem.name }}合计</td>
              <td>{{ subItem.asOfLastPeriodEngineeringAmounts }}</td>
              <td>{{ subItem.thisIssueEngineeringAmounts }}</td>
              <td>{{ subItem.asOfLastPeriodEngineeringAmounts + subItem.thisIssueEngineeringAmounts }}</td>
              <td>{{ subItem.remark }}</td>
            </tr>-->
            </template>
          </template>
        </template>
        <template v-else>
          <tr>
            <td colspan="8">暂无数据</td>
          </tr>
        </template>
      </table>
      <ul class="table-info">
        <li>
          制表人：<span class="table-info-value">{{ creator }}</span>
        </li>
        <li>
          甲方审核(工程技术部)：<span class="table-info-value">{{ engineerAuditorNamePartA }}</span>
        </li>
        <li>
          乙方审核：<span class="table-info-value">{{ auditorNamePartB }}</span>
        </li>
        <li>
          甲方审核(项目经理)：<span class="table-info-value">{{ manageAuditorNamePartA }}</span>
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
  name: 'EditSubPayAmount',
  components: {},
  data() {
    return {
      id: this.$route.params.id || '',
      tableData: [],
      tableTitle: '',
      tableSubTitle: '',
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
      let res1 = await Api.getSubPayAmountInfoDetail(this.id)
      this.tableTitle = res1.data.title
      this.tableSubTitle = `${res1.data.yearMonth.split('-')[0]}年${res1.data.yearMonth.split('-')[1]}月计量工程量清单`
      let res = await Api.getSubPayAmountDetail(this.id)
      this.tableData = res.data
    },
    async download() {
      const res = await Api.downloadSubPayAmount(this.id)
      saveAs(res.data, '分包汇总工程量.xlsx')
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
  line-height: 3;
  margin-top: 10px;
  li {
    flex: 0 0 50%;
    .table-info-value {
      font-size: 14px;
    }
  }
}
</style>
