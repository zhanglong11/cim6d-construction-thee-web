<template>
  <div class="container no-footer">
    <!-- 工具栏 start -->
    <div class="tooltips top-fixed">
      <el-button v-if="$hasPower('SubPayTotalAmountDownload')" type="primary" icon="el-icon-search" @click="download()"
        >下载</el-button
      >
    </div>
    <div class="scroll-area">
      <vxe-grid
        ref="table"
        :stripe="false"
        :border="false"
        :data="tableData"
        :columns="columns"
        :row-class-name="calcRowClassName"
      >
      </vxe-grid>
    </div>
  </div>
</template>

<script>
import Api from '@/views/construction/engineeringAmountManage/api'
import { saveAs } from 'file-saver'
export default {
  name: 'TotalAmount',
  components: {},
  data() {
    return {
      filterForm: {
        search: ''
      },
      tableData: [],
      columns: [
        { title: '项目名称', field: 'name', width: 180 },
        { title: '项目特征', field: 'features', width: 180 },
        { title: '单位', field: 'unit', width: 80 },
        { title: '施工班组', field: 'teamName', width: 120 }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    //刷新数据
    refresh() {
      this.$refs.table.refresh()
    },
    //重置搜索
    reset() {
      this.$refs.table.reset()
    },
    async getList() {
      const res = await Api.getSubTotalAmountList()
      this.tableData = res.data || []
      let { rows, allMonth } = this.transData(this.tableData)
      let arr = []
      allMonth.forEach(item => {
        arr.push({
          title: `${item.split('-')[0]}年${item.split('-')[1]}月`,
          field: `${item.split('-')[0]}${item.split('-')[1]}`,
          width: 200,
          children: [
            {
              title: '本期数量',
              field: `thisNum${item}`,
              width: 100
            },
            {
              title: '累计数量',
              field: `totalNum${item}`,
              width: 100
            }
          ]
        })
      })
      this.columns = [...this.columns, ...arr]
      this.tableData = rows
      /*await this.$nextTick()
      await this.$refs.table.loadColumn(this.columns)*/
    },
    transData(data) {
      let rows = []
      let allMonth = []
      if (data) {
        /*let stack = []
        stack.push(data)*/
        let stack = [...data].reverse()
        while (stack.length !== 0) {
          let item = stack.pop()
          rows.push(item)
          let children = []
          if (item.type !== 3) {
            children = item.childrens || []
          }
          for (let i = children.length - 1; i >= 0; i--) stack.push(children[i])
          if (item.type === 3 && item.engineeringAmountsSummaryYearMonthList) {
            for (let a of item.engineeringAmountsSummaryYearMonthList) {
              item['thisNum' + a['month']] = a['thisIssueEngineeringAmounts']
              item['totalNum' + a['month']] = a['totleEngineeringAmounts']
              allMonth.push(a['month'])
            }
          }
        }
      }
      return {
        rows,
        allMonth: _.uniq(allMonth)
      }
    },
    calcRowClassName({ row }) {
      return `rowType${row.type}`
    },
    //下载
    async download() {
      const res = await Api.downloadSubTotalAmount()
      saveAs(res.data, '总包汇总工程量.xlsx')
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .vxe-table {
  .vxe-header--column {
    padding: 3px 0;
  }
  .vxe-body--column {
    height: 24px;
  }
  .rowType1 {
    background-color: #00b050;
    color: #fff;
  }
  .rowType2 {
    background-color: #92d050;
    color: #fff;
  }
}
</style>
