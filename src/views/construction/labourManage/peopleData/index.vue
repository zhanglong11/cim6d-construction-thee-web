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
          <el-form-item label="工种">
            <SelectArg v-model="filterForm.workType" arg-group="workType"></SelectArg>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="filterForm.gender" style="width: 100px">
              <el-option value="1" label="男">男</el-option>
              <el-option value="2" label="女">女</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="在职状态">
            <el-select v-model="filterForm.jobStatus" style="width: 100px">
              <el-option value="1" label="在职">在职</el-option>
              <el-option value="2" label="离职">离职</el-option>
            </el-select>
            <!-- <SelectArg v-model="filterForm.jobStatus" arg-group="jobStatus"></SelectArg> -->
          </el-form-item>
          <el-form-item label="用工性质">
            <SelectArg v-model="filterForm.staffKind" arg-group="workerProperty"></SelectArg>
          </el-form-item>
          <el-form-item label="微信绑定状态">
            <el-select v-model="filterForm.wxBindStatus">
              <el-option :value="1" label="已绑定"></el-option>
              <el-option :value="2" label="未绑定"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属劳务公司及班组">
            <el-select v-model="filterForm.labourCompanyId" placeholder="请选择劳务公司" @change="changeSelect">
              <el-option v-for="item in selectDate1" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="filterForm.groupId" placeholder="请选择班组">
              <el-option v-for="item in selectDate2" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同状态" prop="contractFileType">
            <!-- <SelectArg v-model="filterForm.contractFileType" arg-group="contractFileType"></SelectArg> -->
            <el-select v-model="filterForm.contractFileType">
              <el-option
                v-for="item in contractFileType"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item v-if="$hasPower('LabourPeopleListAdd')">
            <el-button type="primary" icon="el-icon-plus" @click="getAdd()">新增劳务人员</el-button>
          </el-form-item>
          <el-form-item v-if="$hasPower('LabourPersonnelAdd')">
            <el-button type="primary" icon="el-icon-plus" @click="getPersonnelAdd()">导入</el-button>
          </el-form-item>
          <el-form-item v-if="$hasPower('LabourPersonnelAdd')">
            <el-button type="primary" @click="getPersonnelDown()">下载人员信息模板</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="cardNumber" title="人员卡号"></vxe-table-column>
      <vxe-table-column field="name" title="姓名"></vxe-table-column>
      <vxe-table-column
        field="gender"
        title="性别"
        :formatter="({ cellValue }) => ['男', '女'][cellValue - 1]"
      ></vxe-table-column>
      <vxe-table-column
        field="workType"
        title="工种"
        :formatter="({ cellValue }) => $getLabelFromArg('workType', cellValue)"
      ></vxe-table-column>
      <vxe-table-column
        field="jobStatus"
        title="在职状态"
        :formatter="({ cellValue }) => ['在职', '离职'][cellValue - 1]"
      ></vxe-table-column>
      <vxe-table-column
        field="staffKind"
        title="用工性质"
        :formatter="({ cellValue }) => $getLabelFromArg('workerProperty', cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="groupName" title="所属班组"></vxe-table-column>
      <vxe-table-column field="labourCompanyName" title="所属劳务公司"></vxe-table-column>
      <vxe-table-column
        field="labourCompanyType"
        title="企业类型"
        :formatter="({ cellValue }) => $getLabelFromArg('labourCompanyType', cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="labourContractFileId" title="合同">
        <template slot-scope="{ row }">
          <MyWork
            :fileId="row.labourContractFileId"
            :buttonContent="row.labourContractFileId != null && row.labourContractFileId != '' ? '查看合同' : '暂无'"
          ></MyWork>
        </template>
      </vxe-table-column>
      <vxe-table-column field="principalMobile" title="考勤记录">
        <template #default="{ row }">
          <el-button v-if="$hasPower('LabourPeopleListAttences')" type="text" @click="toDetail(row.id)"
            >查看考勤</el-button
          >
        </template>
      </vxe-table-column>
      <vxe-table-column field="groupNum" title="工资领取情况">
        <template #default="{ row }">
          <el-button v-if="$hasPower('LabourPeopleListWages')" type="text" @click="getWages(row)">查看工资</el-button>
        </template>
      </vxe-table-column>
      <vxe-table-column field="wxBindStatus" title="微信绑定状态">
        <template #default="{ row }">
          {{ row.wxBindStatus === 1 ? '已绑定' : '未绑定' }}
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="150">
        <template #default="{ row }">
          <el-button v-if="$hasPower('LabourPeopleListEdit')" type="text" @click="getEdit(row)">编辑</el-button>
          <el-button v-if="$hasPower('LabourPeopleListView')" type="text" @click="getView(row)">查看</el-button>
          <el-button v-if="$hasPower('LabourPeopleListRemove')" type="text" @click="getRemove([row])">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <!-- 查看模态框 -->
    <MyDetail :id="companyId" :visible.sync="viewDialogVisible"></MyDetail>
    <!-- 新增修改模态框 -->
    <MyEdit
      v-if="editDialogVisible"
      :id="companyId"
      :selectData="selectDate1"
      :visible.sync="editDialogVisible"
    ></MyEdit>
    <!-- 查看工资模态框 -->
    <WagesDetail :id="companyId" :visible.sync="wagesDialogVisible"></WagesDetail>
    <!-- 查看合同 -->
    <PersonnelAdd v-if="personnelVisible" :visible.sync="personnelVisible" />
  </div>
</template>
<script>
import Api from '../api/labour-api'
import MyEdit from './components/Edit'
import MyDetail from './components/Detail'
import WagesDetail from './components/WagesDetail'
import PersonnelAdd from './components/PersonnelAdd'
import MyWork from './components/Work'

export default {
  name: 'LabourCompanyList',
  components: { MyEdit, MyDetail, WagesDetail, MyWork, PersonnelAdd },
  data() {
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      //当前公司名称id
      companyId: null,
      //弹窗默认隐藏
      editDialogVisible: !!+this.$route.query.showAdd || false, //编辑新增弹窗
      viewDialogVisible: false, //查看弹窗
      wagesDialogVisible: false, //查看工资弹窗
      personnelVisible: false,

      request(body) {
        return Api.getLabourEmployeeList(body)
      },
      //合同状态测试数据
      contractFileType: [
        { name: '已签署', value: 1 },
        { name: '暂无', value: 2 }
      ],
      //所有公司及班组
      labourCompanyId: '', //公司
      groupId: ' ', //班组
      selectDate2: [], //班组动态数据
      selectDate1: [], //公司下拉列表数据

      fileName: '导入人员信息模板'
    }
  },
  beforeCreate() {
    let query = this.$route.query
    if (query.showAdd === '0') {
      this.viewDialogVisible = true
      this.companyId = query.targetId
    }
  },
  created() {
    this.getCompanyAndGroup()
  },
  mounted() {},
  methods: {
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
    async getCompanyAndGroup() {
      let res = await Api.getCompanyAndGroup()
      this.selectDate1 = res.data || []
      //this.$store.commit('selectDate1',this.selectDate1)
    },
    //刷新
    refresh() {
      this.$refs.table.refresh()
    },
    //查看
    getView(row) {
      this.viewDialogVisible = true
      this.companyId = row.id
    },
    //查看工资
    getWages(row) {
      this.wagesDialogVisible = true
      this.companyId = row.id
    },

    //新增
    getAdd() {
      this.editDialogVisible = true
      this.companyId = null
    },
    //编辑
    getEdit(row) {
      this.editDialogVisible = true
      this.companyId = row.id
    },
    //删除
    getRemove(list) {
      this.$remove(
        idList => {
          return Api.deleteLabourEmployee([idList.join(',')])
        },
        list,
        'name'
      ).then(res => this.refresh())
    },
    reset() {
      this.$refs.table.reset()
      this.selectDate2 = []
    },
    //查看考勤详情
    toDetail(id) {
      this.$router.push({
        name: `LabourPeopleListAttences`,
        query: { id }
      })
    },
    getPersonnelAdd() {
      this.personnelVisible = true
    },
    async getPersonnelDown() {
      let res = await Api.getExportTemplateDown()
      saveAs(res.data, this.fileName ? this.fileName : 'download')
    }
  }
}
</script>

<style scoped lang="less"></style>
