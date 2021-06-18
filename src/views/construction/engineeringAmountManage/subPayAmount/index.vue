<template>
  <div class="container no-footer">
    <!-- 工具栏 start -->
    <div class="tooltips top-fixed">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="filterForm.search"
            style="width: 360px"
            placeholder="工程名称/结构名称/分项工程名称/上传人/最新修改人"
          />
        </el-form-item>
        <el-form-item label="所属月份">
          <el-date-picker v-model="filterForm.yearMonth" type="month" value-format="yyyy-MM" placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="施工班组">
          <el-select v-model="filterForm.teamId">
            <el-option :value="null" label="全部"></el-option>
            <el-option
              v-for="(item, index) of groupList"
              :key="'ss' + index"
              :value="item.id"
              :label="item.name"
            ></el-option
          ></el-select>
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
        <el-form-item v-if="$hasPower('SubPayAmountListUpload')">
          <UploadFile @success="handleUploadSuccess"></UploadFile>
        </el-form-item>
        <el-form-item>
          <a v-if="$hasPower('SubPayAmountListTemplateDownload')" href="/template/分包汇总工程量清单模板.xlsx"
            >下载分包汇总工程量上传模板</a
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="scroll-area">
      <Grid ref="table" :request="request" :filter-form.sync="filterForm">
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="month" title="所属月份" width="120"></vxe-table-column>
        <vxe-table-column field="engineeringName" title="所属工程" min-width="180"></vxe-table-column>
        <vxe-table-column field="structureName" title="包含结构" min-width="160"></vxe-table-column>
        <vxe-table-column field="subProjectName" title="包含分项工程" min-width="160"></vxe-table-column>
        <vxe-table-column field="constructionTeamName" title="施工班组" width="180"></vxe-table-column>
        <vxe-table-column field="creatorName" title="上传人" width="100"></vxe-table-column>
        <vxe-table-column field="createTime" title="上传时间" width="180"></vxe-table-column>
        <vxe-table-column field="updatorName" title="最新修改人" width="100"></vxe-table-column>
        <vxe-table-column field="updateTime" title="最新修改时间" width="180"></vxe-table-column>
        <vxe-table-column title="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button v-if="$hasPower('SubPayAmountListEdit')" type="text" @click="handleEdit(row)">修改</el-button>
            <el-button v-if="$hasPower('SubPayAmountListDetail')" type="text" @click="handleDetail(row)"
              >查看详情</el-button
            >
          </template>
        </vxe-table-column>
      </Grid>
    </div>
    <ImportResult
      v-if="importResultVisible"
      :visible.sync="importResultVisible"
      :info="importSuccessInfo"
    ></ImportResult>
  </div>
</template>

<script>
import Api from '@/views/construction/engineeringAmountManage/api'
import UploadFile from './components/UploadFile'
import ImportResult from './components/ImportResult'
import { saveAs } from 'file-saver'
export default {
  name: 'SubPayAmountList',
  components: { UploadFile, ImportResult },
  data() {
    return {
      groupList: [],
      filterForm: {
        search: ''
      },
      request: body => {
        return Api.getSubPayAmountList(body)
      },
      importResultVisible: false, //上传结果弹窗
      importSuccessInfo: {}
    }
  },
  created() {
    this.getGroupList()
  },
  methods: {
    async getGroupList() {
      let res = await Api.getAllGroupList()
      this.groupList = res.data || []
    },
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
        name: 'EditSubPayAmount',
        params: { id: row.id }
      })
    },
    handleDetail(row) {
      this.$router.push({
        name: 'SubPayAmountDetail',
        params: { id: row.id }
      })
    },
    handleUploadSuccess(res) {
      try {
        if (res.code === 200) {
          this.refresh()
          this.importResultVisible = true
          this.importSuccessInfo = res.data
        } else {
          this.$message.error(res.message)
        }
      } catch (error) {
        this.$message.error('服务器没有返回任何响应')
      }
    }
  }
}
</script>

<style scoped></style>
