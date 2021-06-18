<template>
  <div>
    <div class="tree-wrap">
      <el-input
        v-model="treeFilterText"
        placeholder="搜索"
        style="margin-bottom: 10px"
        suffix-icon="el-icon-search"
      ></el-input>
      <LiquorTree
        ref="tree"
        class="tree"
        :filter="treeFilterText"
        :data="treeData"
        node-key="id"
        :options="treeOptions"
      >
        <template #default="{ node }">
          <p class="custom-tree-node">
            <span>
              <TreeNodeIcon class="left-icon" :node="node"></TreeNodeIcon>
              <span>{{ node.data.dataName }} ({{ node.data.userNumber }})</span>
            </span>
            <!--主办方 start-->
            <!--主办方企业 start-->
            <template v-if="projectUserCategory === 1">
              <template v-if="node.data.participantType === 1">
                <span class="actions" @click.stop>
                  <template v-if="node.data.organType === 2">
                    <i></i>
                    <i class="el-icon-remove-outline" @click="removeTreeNode(node.data)"></i>
                    <i class="el-icon-circle-plus-outline" @click="handleAddCompany(node.data)"></i>
                  </template>
                  <template v-if="node.data.organType === 3">
                    <i></i>
                    <i></i>
                    <i class="el-icon-circle-plus-outline" @click="handleAddDepartment(node.data)"></i>
                  </template>
                  <template v-if="node.data.organType === 4">
                    <i class="el-icon-edit" @click="handleEditDepartment(node.data)"></i>
                    <i class="el-icon-remove-outline" @click="removeTreeNode(node.data)"></i>
                    <i class="el-icon-circle-plus-outline" @click="handleAddDepartment(node.data)"></i>
                  </template>
                  <template v-if="node.data.organType === 5 && !node.data.principalFlag">
                    <i class="el-icon-edit" @click="handleEditRole(node.data)"></i>
                    <i class="el-icon-remove-outline" @click="removeTreeNode(node.data)"></i>
                    <i></i>
                  </template>
                </span>
              </template>
              <!--主办方企业 end-->
              <!--参与方企业 start-->
              <template v-else-if="node.data.participantType === 2">
                <span class="actions" @click.stop>
                  <template v-if="node.data.organType === 1">
                    <i></i>
                    <i></i>
                    <i class="el-icon-circle-plus-outline" @click="handleAddParticipantType(node.data)"></i>
                  </template>
                  <template v-if="node.data.organType === 2">
                    <i></i>
                    <i class="el-icon-remove-outline" @click="removeTreeNode(node.data)"></i>
                    <i class="el-icon-circle-plus-outline" @click="handleAddCompany(node.data)"></i>
                  </template>
                  <template v-if="node.data.organType === 3">
                    <i></i>
                    <i class="el-icon-remove-outline" @click="removeTreeNode(node.data)"></i>
                    <i></i>
                  </template>
                  <template v-if="node.data.organType === 5 && node.data.principalFlag">
                    <i class="el-icon-edit" @click="handleEditRole(node.data)"></i>
                    <i></i>
                    <i></i>
                  </template>
                </span>
              </template>
              <!--参与方企业 end-->
            </template>
            <!--主办方 end-->

            <!--参与方 start-->
            <template v-else-if="projectUserCategory === node.data.projectPrincipalFlag">
              <span class="actions" @click.stop>
                <template v-if="node.data.organType === 3">
                  <i></i>
                  <i></i>
                  <i class="el-icon-circle-plus-outline" @click="handleAddDepartment(node.data)"></i>
                </template>
                <template v-if="node.data.organType === 4">
                  <i class="el-icon-edit" @click="handleEditDepartment(node.data)"></i>
                  <i class="el-icon-remove-outline" @click="removeTreeNode(node.data)"></i>
                  <i class="el-icon-circle-plus-outline" @click="handleAddDepartment(node.data)"></i>
                </template>
                <template v-if="node.data.organType === 5">
                  <i class="el-icon-edit" @click="handleEditRole(node.data)"></i>
                  <i class="el-icon-remove-outline" @click="removeTreeNode(node.data)"></i>
                  <i></i>
                </template>
              </span>
            </template>
            <!--参与方 end-->
          </p>
        </template>
      </LiquorTree>
      <p>
        <i class="el-icon-star-on"></i>
        <span>项目负责人</span>
      </p>
    </div>
    <EditDepartment
      :visible.sync="editDepartmentDialogVisible"
      :data="activeDepartment"
      @change="refresh"
    ></EditDepartment>
    <EditRole :visible.sync="editRoleDialogVisible" :data="activeRole" @change="refresh"> </EditRole>
    <AddParticipantType
      :visible.sync="addParticipantTypeDialogVisible"
      :existsParticipantTypes="existsParticipantTypes"
      :parentId="participantNodeId"
      @change="refresh"
    ></AddParticipantType>
    <AddCompany :participant="activeParticipant" :visible.sync="addCompanyDialogVisible" @change="refresh"></AddCompany>
  </div>
</template>
<script>
import { projectApi } from '@/views/project/api/project'
import toFlat from '@/utils/toFlat'
import EditDepartment from './EditDepartment'
import EditRole from './EditRole'
import AddParticipantType from './AddParticipantType'
import AddCompany from './AddCompany'
import treeFind from '@/utils/treeFind'
import LiquorTree from 'liquor-tree'
import treeForEach from '@/utils/treeForEach'
import TreeNodeIcon from './TreeNodeIcon'

export default {
  name: 'Tree',
  components: { EditDepartment, EditRole, AddParticipantType, AddCompany, LiquorTree, TreeNodeIcon },
  props: {
    currentNode: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      treeFilterText: '',
      treeData: [],
      flatTreeData: [],

      activeDepartment: {},
      editDepartmentDialogVisible: false,

      activeRole: {},
      editRoleDialogVisible: false,

      addParticipantTypeDialogVisible: false,
      participantNodeId: null,

      addCompanyDialogVisible: false,
      activeParticipant: {},

      treeOptions: {
        parentSelect: true,
        nodeIndent: 16,
        filter: {
          matcher(query, node) {
            return node.data.dataName.includes(query)
          },
          emptyText: '什么也没有搜到 ^_^'
        }
      }
    }
  },
  computed: {
    // 已经存在的参与方性质
    existsParticipantTypes() {
      return (_.get(this.treeData, '[0].children[1].children', []) || []).map(item => item.dataUnicode)
    },
    // 1 为主导方 2 为参与方
    projectUserCategory() {
      return this.$store.state.project.projectDetail.projectUserCategory
    },
    // 项目类型
    projectType() {
      return this.$store.state.project.projectType
    }
  },
  watch: {
    treeFilterText(val) {
      this.$refs.tree.findAll(val)
    }
  },
  mounted() {
    this.refresh()
    this.$refs.tree.$on('node:selected', node => {
      this.handleTreeCurrentChange(node.data)
    })
  },
  methods: {
    refresh() {
      return projectApi.getProjectOrganList().then(res => {
        let datas = res.data || []
        this.flatTreeData = toFlat(datas, 'parentId')
        treeForEach(datas, (item, parent) => {
          if (item.organType === 2) {
            item.dataName = this.$getLabelFromArg(`${this.projectType}_participantType`, item.dataUnicode)
          }
          if (item.organType === 3) {
            item.companyId = item.dataUnicode
          }
          if (parent && parent.companyId) {
            item.companyId = parent.companyId
          }
          item.text = item.dataName
          item.state = {
            selectable: item.organType === 5,
            selected: item.id === this.currentNode.id,
            expanded: true
          }
          item.data = item
        })
        this.treeData = datas
        this.$refs.tree.setModel(datas)
        if (!this.currentNode.id) {
          const firstDepartmentThatHaveUser = treeFind(datas, item => {
            return item.organType === 5 && item.userNumber > 0
          })
          if (firstDepartmentThatHaveUser) {
            this.$emit('update:currentNode', firstDepartmentThatHaveUser)
          }
        } else {
          if (!_.find(this.flatTreeData, { id: this.currentNode.id })) {
            this.$emit('update:currentNode', {})
          }
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.dataName.includes(value)
    },
    handleTreeCurrentChange(data) {
      this.$emit('update:currentNode', data)
    },
    async removeTreeNode(node) {
      await this.$tipRemove([node], 'dataName')
      await projectApi.removeOrganNodeById(node.id)
      await this.$message.success('删除成功')
      this.refresh()
      if (this.filterForm.id === node.id) {
        this.$emit('update:currentNode', _.get(this.treeData, '[0]'))
        this.refresh()
      }
    },
    handleAddDepartment(data) {
      this.editDepartmentDialogVisible = true
      this.activeDepartment = {
        parentId: data.id,
        parentName: data.dataName,
        organType: data.organType === 4 ? 5 : 4,
        children: data.children
      }
    },
    handleEditDepartment(data) {
      this.editDepartmentDialogVisible = true
      this.activeDepartment = {
        id: data.id,
        parentName: _.find(this.flatTreeData, { id: data.parentId })?.dataName,
        organType: data.organType,
        name: data.dataName
      }
    },
    handleEditRole(data) {
      this.editRoleDialogVisible = true
      this.activeRole = {
        id: data.id,
        dataUnicode: data.dataUnicode
      }
    },
    handleAddParticipantType(data) {
      this.participantNodeId = data.id
      this.addParticipantTypeDialogVisible = true
    },
    handleAddCompany(data) {
      this.activeParticipant = data
      this.addCompanyDialogVisible = true
    }
  }
}
</script>
<style scoped lang="less">
@import '~@/styles/color';
.tree-wrap {
  height: calc(100vh - 221px);
  display: flex;
  flex-direction: column;

  .tree {
    height: calc(100% - 60px);
    /deep/ .el-tree-node__content {
      overflow: hidden;
    }

    /deep/ .tree-arrow {
      height: 20px;
    }

    /deep/ .tree-anchor {
      padding-top: 0;
      padding-bottom: 0;
    }
    font-size: 14px;
    line-height: 18px;
  }
}

.el-icon-star-on {
  color: @primary-color;
  font-size: 16px;
}

.custom-tree-node {
  width: 0;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > span:first-child {
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    > span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    img.left-icon {
      height: 15px;
    }
    .left-icon {
      margin-right: 6px;
      line-height: 24px;
      font-size: 18px;
    }
  }
  .actions {
    width: 65px;
    flex-shrink: 0;
    display: flex;
    > i {
      padding: 3px;
      width: 22px;
      min-height: 1px;
    }
  }
}
</style>
