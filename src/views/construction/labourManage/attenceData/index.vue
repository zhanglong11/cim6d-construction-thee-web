<template>
  <div>
    <div class="tooltips">
      <div>
        <el-form inline>
          <el-form-item>
            <el-input
              v-model="filterForm.content"
              style="width: 300px"
              placeholder="人员卡号/姓名"
              suffix-icon="el-icon-search"
              @keyup.enter.native="refresh"
            />
          </el-form-item>
          <el-form-item label="考勤年月日">
            <DateRange :startTime.sync="filterForm.startDate" :endTime.sync="filterForm.endDate"></DateRange>
          </el-form-item>
          <el-form-item label="所属劳务公司及班组">
            <el-select v-model="filterForm.labourCompanyId" placeholder="请选择劳务公司" @change="changeSelect">
              <el-option v-for="item in selectDate1" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="filterForm.groupId" placeholder="请选择班组">
              <el-option v-for="item in selectDate2" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item v-if="$hasPower('LabourAttenceListDown')">
            <el-button type="primary" icon="el-icon-plus" @click="getDown()">下载检索内容</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="cardNumber" title="劳务人员卡号"></vxe-table-column>
      <vxe-table-column field="name" title="劳务人员姓名"></vxe-table-column>
      <vxe-table-column field="punchCardDate" title="打卡日期"></vxe-table-column>
      <vxe-table-column field="week" title="星期"></vxe-table-column>
      <vxe-table-column field="punchCardTime" title="打卡时间"></vxe-table-column>
      <vxe-table-column field="groupName" title="所属班组"></vxe-table-column>
      <vxe-table-column field="labourCompanyName" title="所属劳务公司"></vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import Api from '../api/labour-api'
export default {
  name: 'LabourAttenceList',
  components: {},
  data() {
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      disabled: true,
      disabledDay: true,
      startDate: moment(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      //当前公司名称id
      companyId: null,
      request(body) {
        return Api.getAttendancDetail(body)
      },
      //所有公司及班组
      labourCompanyId: '', //公司
      groupId: ' ', //班组
      selectDate2: [], //班组动态数据
      selectDate1: [], //公司下拉列表数据
      fileName: '考勤管理表.xls'
    }
  },
  watch: {},
  created() {
    this.getCompanyAndGroups()
  },
  mounted() {},
  methods: {
    //下载内容
    async getDown() {
      let res = await Api.getAttenceExport({
        content: this.filterForm.content || '',
        labourCompanyId: this.filterForm.labourCompanyId,
        groupId: this.filterForm.groupId,
        startDate: this.filterForm.startDate === undefined ? this.startDate : this.filterForm.startDate,
        endDate: this.filterForm.endDate === undefined ? this.endDate : this.filterForm.endDate
      })
      saveAs(res.data, this.fileName ? this.fileName : 'download.xls')
    },
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
      this.selectDate2 = []
    },
    //动态获取公司以及班组下拉框值
    changeSelect(value) {
      if (value !== '') {
        for (var item of this.selectDate1) {
          if (item.id === value) {
            this.selectDate2 = item.groupList
            this.groupId = ''
            break
          } else {
            continue
          }
        }
      } else {
        this.selectDate2 = []
        this.groupId = ''
      }
    },
    //获取所有劳务信息及班组接口
    async getCompanyAndGroups() {
      let res = await Api.getCompanyAndGroup()
      this.selectDate1 = res.data || []
    }
  }
}
</script>

<style scoped lang="less"></style>
