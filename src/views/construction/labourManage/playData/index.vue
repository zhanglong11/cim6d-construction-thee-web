<template>
  <div>
    <div class="tooltips">
      <div>
        <el-form inline>
          <el-form-item label="工资月份">
            <el-date-picker
              v-model="filterForm.salaryYear"
              type="year"
              format="yyyy年"
              value-format="yyyy"
              placeholder="选择年"
            ></el-date-picker>
            <el-date-picker
              v-model="filterForm.salaryMonth"
              :disabled="disabled"
              type="month"
              format="M月"
              value-format="M"
              placeholder="选择月"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="劳务公司">
            <el-select v-model="filterForm.labourCompanyId" placeholder="请选择劳务公司">
              <el-option v-for="item in selectDate" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否拖欠劳务人员工资">
            <el-select v-model="filterForm.arrearsOfWage">
              <el-option value="1" label="已拖欠">已拖欠</el-option>
              <el-option value="2" label="否">否</el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
              <el-button @click="reset">重置</el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item v-if="$hasPower('LabourPlayListUplodes')">
            <el-button size="small" type="primary" @click="getPlay">导入工资支付单</el-button>
          </el-form-item>
          <el-form-item v-if="$hasPower('LabourPlayListDowns')">
            <el-button type="primary" @click="downPlaybtn">下载工资支付单模板</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="salaryMonth" title="工资月份">
        <template slot-scope="{ row }">
          {{ moment(row.salaryMonth).format('YYYY年MM月 ') }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="labourCompanyName" title="公司名称"></vxe-table-column>
      <vxe-table-column field="contractWorkersNum" title="所属劳务人员数量"></vxe-table-column>
      <vxe-table-column field="alreadyPayNum" title="已发工资劳务人员数量"></vxe-table-column>
      <vxe-table-column field="notPayNum" title="未发工资劳务人员数量"></vxe-table-column>
      <vxe-table-column field="issueDate" title="公司每月发工资日期">
        <template slot-scope="{ row }"> {{ row.issueDate }}日 </template>
      </vxe-table-column>
      <vxe-table-column
        field="arrearsOfWage"
        title="是否拖欠劳务人员工资"
        :formatter="({ cellValue }) => ['已拖欠', '否'][cellValue - 1]"
      ></vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button v-if="$hasPower('LabourPlayListDetail')" type="text" @click="getView(row)">详情</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <!-- 查看模态框 -->
    <PlayDetail v-if="viewDialogVisible" :id="employeeId" :visible.sync="viewDialogVisible"></PlayDetail>
    <!-- 导入工资支付单模态框 -->
    <PlayUpload v-if="playDialogVisible" :selectDate="selectDate" :visible.sync="playDialogVisible"></PlayUpload>
  </div>
</template>

<script>
import Api from '../api/labour-api'
import PlayDetail from './PlayDetail'
import PlayUpload from './DownPlay'
import { saveAs } from 'file-saver'
export default {
  name: 'LabourPlayList',
  components: { PlayDetail, PlayUpload },
  data() {
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      disabled: true,
      selectDate: [],
      //当前名称id
      employeeId: null,
      //弹窗默认隐藏
      viewDialogVisible: false, //查看弹窗
      playDialogVisible: false,
      request(body) {
        return Api.getPeoplePlay(body)
      },
      //劳务公司名称
      labourName: [],
      fileName: '导入工资模板'
    }
  },
  watch: {
    'filterForm.salaryYear'(val) {
      this.disabled = !val
    }
  },
  created() {
    this.getCompanyAndGroup()
  },
  mounted() {},
  methods: {
    //下载工资模板
    async downPlaybtn() {
      let res = await Api.getSalaryDown()
      saveAs(res.data, this.fileName ? this.fileName : 'download')
    },
    //导入工人信息
    getPlay() {
      this.playDialogVisible = true
    },
    refresh() {
      this.$refs.table.refresh()
    },
    //查看
    getView(row) {
      this.viewDialogVisible = true
      this.employeeId = row.id
    },
    //获取所有劳务公司信息
    async getCompanyAndGroup() {
      let res = await Api.getCompanyAndGroup()
      this.selectDate = res.data || []
    },
    reset() {
      this.$refs.table.reset()
    }
  }
}
</script>

<style scoped lang="less">
.upload {
  width: 150px;
  display: inline-block;
}
.download {
  display: inline;
}
</style>
