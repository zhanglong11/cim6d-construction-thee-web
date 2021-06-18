<template>
  <div class="container no-footer">
    <!-- 工具栏 start -->
    <div class="tooltips top-fixed">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="filterForm.search"
            style="width: 360px"
            placeholder="工程名称/结构名称/分项工程名称/最新修改人"
          />
        </el-form-item>
        <el-form-item label="所属月份">
          <el-date-picker v-model="filterForm.yearMonth" type="month" value-format="yyyy-MM" placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上传时间">
          <DateRange :startTime.sync="filterForm.uploadStartDate" :endTime.sync="filterForm.uploadEndDate"></DateRange>
        </el-form-item>
        <el-form-item label="最新修改时间">
          <DateRange :startTime.sync="filterForm.updateStartDate" :endTime.sync="filterForm.updateEndDate"></DateRange>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="$hasPower('OwnerReceiveAmountListMultipleDownload')"
            type="primary"
            icon="el-icon-download"
            @click="downloadMultiple"
            >批量下载选中表格</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="scroll-area">
      <Grid ref="table" :request="request" :filter-form.sync="filterForm" @checkboxChange="handleChecked">
        <vxe-table-column type="checkbox" title="全选" width="80"></vxe-table-column>
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="month" title="所属月份" width="120"></vxe-table-column>
        <vxe-table-column field="engineeringName" title="所属工程" min-width="180"></vxe-table-column>
        <vxe-table-column field="structureName" title="包含结构" min-width="160"></vxe-table-column>
        <vxe-table-column field="subProjectName" title="包含分项工程" min-width="160"></vxe-table-column>
        <vxe-table-column field="createTime" title="生成时间" width="180"></vxe-table-column>
        <vxe-table-column field="updatorName" title="最新修改人" width="100"></vxe-table-column>
        <vxe-table-column field="updateTime" title="最新修改时间" width="180"></vxe-table-column>
        <vxe-table-column title="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button v-if="$hasPower('OwnerReceiveAmountListEdit')" type="text" @click="handleEdit(row)"
              >修改</el-button
            >
            <el-button v-if="$hasPower('OwnerReceiveAmountListDetail')" type="text" @click="handleDetail(row)"
              >查看详情</el-button
            >
            <el-button v-if="$hasPower('OwnerReceiveAmountListDownload')" type="text" @click="handleDownload(row)"
              >下载</el-button
            >
          </template>
        </vxe-table-column>
      </Grid>
    </div>
  </div>
</template>

<script>
import Api from '@/views/construction/engineeringAmountManage/api'
import { saveAs } from 'file-saver'
export default {
  name: 'OwnerReceiveAmountList',
  components: {},
  data() {
    return {
      filterForm: {
        search: ''
      },
      selectRows: [],
      request: body => {
        return Api.getOwnerReceiveAmountList(body)
      }
    }
  },
  computed: {
    selectRowIds() {
      return _.map(this.selectRows, 'id')
    }
  },
  created() {},
  methods: {
    //刷新数据
    refresh() {
      this.$refs.table.refresh()
    },
    //重置搜索
    reset() {
      this.$refs.table.reset()
    },
    handleEdit(row) {
      this.$router.push({
        name: 'EditOwnerReceiveAmount',
        params: { id: row.id }
      })
    },
    handleDetail(row) {
      this.$router.push({
        name: 'OwnerReceiveAmountDetail',
        params: { id: row.id }
      })
    },
    async handleDownload(row) {
      const res = await Api.downloadOwnerReceiveAmount(row.id)
      saveAs(res.data, `${row.month}总包汇总工程量.xlsx`)
    },
    async downloadMultiple() {
      if (!this.selectRowIds.length) {
        this.$message.info('请至少选择一条数据')
        return
      }
      const res = await Api.downloadOwnerReceiveAmountMultiple(this.selectRowIds)
      saveAs(res.data, '总包汇总工程量批量下载.zip')
    },
    //复选框改变时
    handleChecked(data) {
      this.selectRows = [...data]
    }
  }
}
</script>

<style scoped></style>
