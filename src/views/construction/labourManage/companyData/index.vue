<template>
  <div>
    <!-- 工具栏开始 -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="filterForm.content"
            style="width: 300px"
            placeholder="公司名称/公司负责人姓名"
            suffix-icon="el-icon-search"
            @keyup.enter.native="refresh"
          />
        </el-form-item>
        <el-form-item label="企业类型">
          <SelectArg v-model="filterForm.type" arg-group="labourCompanyType"></SelectArg>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('LabourCompanyAdd')" type="primary" icon="el-icon-plus" @click="getAdd(null)"
            >新增劳务公司</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="name" title="公司名称"></vxe-table-column>
      <vxe-table-column
        field="type"
        title="企业类型"
        :formatter="({ cellValue }) => $getLabelFromArg('labourCompanyType', cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="labourEmployeeNum" title="劳务人员数量">
        <template slot-scope="{ row }">
          {{ row.labourEmployeeNum == null ? '-' : row.labourEmployeeNum }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="payoffTime" title="每月工资发放日期">
        <template slot-scope="{ row }"> {{ row.payoffTime || '*' }}日 </template>
      </vxe-table-column>
      <vxe-table-column field="principalName" title="公司负责人">
        <template slot-scope="{ row }">
          {{ row.principalName == null ? '-' : row.principalName }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="principalMobile" title="负责人联系方式">
        <template slot-scope="{ row }">
          {{ row.principalMobile == null ? '-' : row.principalMobile }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="groupList" title="关联班组">
        <template slot-scope="scope">
          <span v-html="formatterBr(scope.row.groupList)"></span>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button v-if="$hasPower('LabourCompanyEdit')" type="text" @click="getEdit(row)">编辑</el-button>
          <el-button v-if="$hasPower('LabourCompanyView')" type="text" @click="getView(row)">查看</el-button>
          <el-button v-if="$hasPower('LabourCompanyRemove')" type="text" @click="getRemove([row])">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <!-- 查看模态框 -->
    <CompanyDetail :id="companyId" :visible.sync="viewDialogVisible"></CompanyDetail>
    <!-- 新增修改模态框 -->
    <CompanyEdit v-if="editDialogVisible" :id="companyId" :visible.sync="editDialogVisible"></CompanyEdit>
  </div>
</template>

<script>
import Api from '../api/labour-api'
import CompanyDetail from './components/Deatil'
import CompanyEdit from './components/Edit'
export default {
  name: 'LabourCompanyList',
  components: { CompanyDetail, CompanyEdit },
  data() {
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      //当前公司名称id
      companyId: null,
      //弹窗默认隐藏
      viewDialogVisible: !!+this.$route.query.showAdd || false,
      removeDialogVisible: false,
      editDialogVisible: false,
      //请求数据
      request(body) {
        return Api.getLabourCompanyList(body)
      },
      optionList: []
    }
  },
  beforeCreate() {
    let query = this.$route.query
    if (query.showAdd === '0') {
      this.viewDialogVisible = true
      this.companyId = query.targetId
    }
  },
  created() {},
  mounted() {},
  methods: {
    formatterBr(cellValue) {
      return (cellValue || '').toString().replace(/\,/g, '</br>')
    },
    refresh() {
      this.$refs.table.refresh()
    },
    //查看
    getView(row) {
      this.viewDialogVisible = true
      this.companyId = row.id
    },
    //编辑
    getEdit(row) {
      this.editDialogVisible = true
      this.companyId = row.id
    },
    //新增
    getAdd() {
      this.editDialogVisible = true
      this.companyId = null
    },
    //删除
    async getRemove(list) {
      this.$remove(
        idList => {
          return Api.deleteLabourCompany([idList.join(',')])
        },
        list,
        'name'
      ).then(res => this.refresh())
    },
    reset() {
      this.$refs.table.reset()
    }
  }
}
</script>

<style scoped lang="less">
/deep/.vxe-table.size--small .vxe-body--column.col--ellipsis > .vxe-cell,
.vxe-table.size--small .vxe-footer--column.col--ellipsis > .vxe-cell,
.vxe-table.size--small .vxe-header--column.col--ellipsis > .vxe-cell {
  max-height: 300px;
  overflow: auto;
}
</style>
