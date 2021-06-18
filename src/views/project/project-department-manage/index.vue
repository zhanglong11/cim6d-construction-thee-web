<template>
  <div class="project-department-manage">
    <el-card header="项目组织架构" class="tree-card">
      <Tree ref="tree" :currentNode.sync="currentNode" />
    </el-card>
    <el-card class="main-content">
      <div class="tooltips">
        <div>
          <el-input v-model="searchRealName" style="width: 300px" placeholder="员工姓名"></el-input>
          <el-button type="primary" @click="attendanceAdd">同步考勤机人员</el-button>
          <el-button
            v-if="currentNode.companyId === companyId && !currentNode.principalFlag"
            type="primary"
            @click="handleAdd"
            >添加人员</el-button
          >
          <el-button
            v-if="currentNode.companyId === companyId && !currentNode.principalFlag"
            type="danger"
            @click="handleRemove(selectedList)"
            >移除人员</el-button
          >
        </div>
      </div>
      <vxe-table
        ref="table"
        row-id="id"
        :checkbox-config="{
          highlight: true,
          range: true
        }"
        :data="computedList"
        @checkbox-change="checkChange"
        @checkbox-all="checkChange"
      >
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column title="姓名" field="realName" width="150"></vxe-table-column>
        <vxe-table-column title="所属公司" field="companyName"></vxe-table-column>
        <vxe-table-column title="联系方式" field="userPhone" width="150"></vxe-table-column>
        <vxe-table-column title="备注" field="remark"></vxe-table-column>
        <vxe-table-column title="操作" width="200">
          <template #default="{ row }">
            <el-button v-if="projectUserCategory === row.projectPrincipalFlag" type="text" @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button
              v-if="projectUserCategory === row.projectPrincipalFlag && !currentNode.principalFlag"
              type="text"
              @click="handleRemove([row])"
              >移除人员</el-button
            >
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-card>
    <EditMasterUser
      :data="activeUser"
      :visible.sync="editMasterUserDialogVisible"
      @change="handleUserListChange"
    ></EditMasterUser>
    <EditSlaveUser
      :data="activeUser"
      :visible.sync="editSlaveUserDialogVisible"
      :currentNode="currentNode"
      @change="handleUserListChange"
    ></EditSlaveUser>
    <AttendanceDetail :visible.sync="attendanceDialogVisible" :data="attendanceUser"></AttendanceDetail>
  </div>
</template>

<script>
import { projectApi } from '../api/project'
import Tree from './components/Tree'
import EditMasterUser from './components/EditMasterUser'
import EditSlaveUser from './components/EditSlaveUser'
import AttendanceDetail from './components/AttendanceDetail'
export default {
  name: 'ProjectDepartmentManage',
  // import引入的组件需要注入到对象中才能使用
  components: { Tree, EditMasterUser, EditSlaveUser, AttendanceDetail },
  data() {
    // 这里存放数据
    return {
      list: [],
      selectedList: [],
      filterForm: {
        id: ''
      },
      searchRealName: '',
      // 左侧树选中的节点
      currentNode: {},
      activeDepartment: {},
      activeUser: {},
      attendanceUser: [],
      editMasterUserDialogVisible: false,
      editSlaveUserDialogVisible: false,
      attendanceDialogVisible: false
    }
  },

  computed: {
    computedList() {
      if (!this.searchRealName.trim()) return this.list
      else
        return this.list.filter(item => item.realName.toLowerCase().includes(this.searchRealName.toLowerCase().trim()))
    },
    companyId() {
      return this.$store.state.user.companyId
    },
    // 1 为主导方 2 为参与方
    projectUserCategory() {
      return this.$store.state.project.projectDetail.projectUserCategory
    }
  },

  watch: {
    currentNode(val) {
      this.filterForm.id = val.id
    },
    'filterForm.id'() {
      this.refresh()
    }
  },

  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  async created() {
    await this.refresh()
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      if (!this.filterForm.id) {
        this.list = []
      } else {
        return projectApi.getProjectOrganUserList(this.filterForm).then(res => {
          this.list = res.data
        })
      }
    },
    handleUserListChange() {
      this.$refs.tree.refresh()
      this.refresh()
    },
    handleEdit(row) {
      if (this.currentNode.participantType === 1) {
        this.editMasterUserDialogVisible = true
      } else {
        this.editSlaveUserDialogVisible = true
      }
      this.activeUser = {
        parent: this.currentNode,
        parentName: row.roleName,
        parentId: row.parentId,
        id: row.memberOrgId,
        remark: row.remark,
        dataUnicode: row.dataUnicode,
        realName: row.realName,
        userName: row.realName,
        userPhone: row.userPhone,
        companyId: row.companyId
      }
    },
    async handleRemove(rows) {
      await this.$tipRemove(rows, 'realName')
      await projectApi.deleteMembers(_.map(rows, 'memberOrgId'))
      await this.$message.success('删除成功')
      this.handleUserListChange()
    },
    checkChange({ records }) {
      const check = this.$refs.table.getCheckboxReserveRecords()
      this.selectedList = [...records, ...check]
    },
    handleAdd() {
      if (this.currentNode.participantType === 1) {
        this.editMasterUserDialogVisible = true
      } else {
        this.editSlaveUserDialogVisible = true
      }
      this.activeUser = {
        parentId: this.currentNode.id,
        parentName: this.currentNode.dataName,
        parent: this.currentNode,
        userName: null,
        userPhone: null
      }
    },
    attendanceAdd() {
      projectApi.getunregisterList().then(res => {
        this.attendanceUser = res.data || []
        this.attendanceDialogVisible = true
      })
      // this.attendanceUser = []
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color';
.project-department-manage {
  display: flex;
  .tree-card {
    width: 400px;
    /deep/ .el-card__body {
      padding: 15px;
    }
  }
  .main-content {
    flex: 1;
    margin-left: 15px;
  }
}
</style>
