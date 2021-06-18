<template>
  <div class="container no-footer">
    <div class="wrapper">
      <div class="column engineer">
        <header>工程列表</header>
        <div class="body">
          <div
            v-for="(item, index) of engineerList"
            :key="'el' + index"
            class="item"
            :class="{ active: item.id === selectEngineer.id }"
            @click="handleSelectEngineer(item)"
          >
            <div class="name">{{ item.name }}</div>
            <el-button
              v-if="$hasPower('EngineeringSettingEngineerEdit')"
              class="edit"
              type="text"
              @click="handleChangeEngineer(item)"
              >修改</el-button
            >
            <el-button
              v-if="$hasPower('EngineeringSettingEngineerDelete')"
              class="delete"
              type="text"
              @click.stop="handleDeleteEngineer(item)"
              >删除</el-button
            >
          </div>
          <div v-if="$hasPower('EngineeringSettingEngineerAdd')" class="add-btn" @click="addEngineer">
            <i class="el-icon-plus"></i>新增工程
          </div>
        </div>
      </div>
      <div class="arrow"></div>
      <div class="column structure">
        <header>结构列表</header>
        <div class="body">
          <div
            v-for="(item, index) of structureList"
            :key="'el' + index"
            class="item"
            :class="{ active: item.id === selectStructure.id }"
            @click="handleSelectStructure(item)"
          >
            <div class="name">{{ item.name }}</div>
            <el-button
              v-if="$hasPower('EngineeringSettingStructureEdit')"
              class="edit"
              type="text"
              @click="handleChangeStructure(item)"
              >修改</el-button
            >
            <el-button
              v-if="$hasPower('EngineeringSettingStructureDelete')"
              class="delete"
              type="text"
              @click.stop="handleDeleteStructure(item)"
              >删除</el-button
            >
          </div>
          <div v-if="$hasPower('EngineeringSettingStructureAdd')" class="add-btn" @click="addStructure">
            <i class="el-icon-plus"></i>新增结构
          </div>
        </div>
      </div>
      <div class="arrow"></div>
      <div class="column table-flex">
        <header>分项工程列表</header>
        <div class="body">
          <vxe-table ref="xTable" :data="tableData">
            <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
            <vxe-table-column field="name" title="分项工程名称" />
            <vxe-table-column field="features" title="分项工程特征" />
            <vxe-table-column field="unit" title="单位"></vxe-table-column>
            <vxe-table-column field="constructionTeamNames" title="施工班组"></vxe-table-column>
            <vxe-table-column title="操作" fixed="right" align="center">
              <template #default="{ row }">
                <el-button
                  v-if="$hasPower('EngineeringSettingSubEngineerEdit')"
                  type="text"
                  @click="editSubEngineer(row)"
                  >修改</el-button
                >
                <el-button
                  v-if="$hasPower('EngineeringSettingSubEngineerDelete')"
                  type="text"
                  @click.stop="deleteSubEngineer(row)"
                  >删除</el-button
                >
              </template>
            </vxe-table-column>
          </vxe-table>
          <div v-if="$hasPower('EngineeringSettingSubEngineerAdd')" class="add-btn" @click="addSubEngineer">
            <i class="el-icon-plus"></i>新增分项工程
          </div>
        </div>
      </div>
    </div>
    <AddEngineer
      v-if="addEngineerVisible"
      :visible.sync="addEngineerVisible"
      :info="selectEngineer"
      @submit="handleEngineerSubmit"
    ></AddEngineer>
    <AddStructure
      v-if="addStructureVisible"
      :visible.sync="addStructureVisible"
      :info="selectStructure"
      :engineerList="engineerList"
      @submit="handleStructureSubmit"
    ></AddStructure>
    <AddSubEngineer
      v-if="addSubEngineerVisible"
      :visible.sync="addSubEngineerVisible"
      :info="selectSubEngineer"
      :engineerList="engineerList"
      :defaultStructureList="structureList"
      :selectEngineer="selectEngineer"
      :selectStructure="selectStructure"
      @submit="handleSubEngineerSubmit"
    ></AddSubEngineer>
  </div>
</template>

<script>
import Api from '@/views/construction/engineeringAmountManage/api'
import AddEngineer from './components/AddEngineer'
import AddStructure from './components/AddStructure'
import AddSubEngineer from './components/AddSubEngineer'

export default {
  name: 'EngineeringSetting',
  components: { AddEngineer, AddStructure, AddSubEngineer },
  data() {
    return {
      engineerList: [],
      structureList: [],
      tableData: [],
      addEngineerVisible: false,
      selectEngineer: {},
      addStructureVisible: false,
      selectStructure: {},
      addSubEngineerVisible: false,
      selectSubEngineer: {}
    }
  },
  watch: {
    selectEngineer: {
      immediate: false,
      deep: true,
      handler() {
        this.getStructureList()
      }
    },
    selectStructure: {
      immediate: false,
      deep: true,
      handler() {
        this.getSubEngineerList()
      }
    }
  },
  created() {
    this.getEngineerList()
  },
  methods: {
    //获取工程列表
    async getEngineerList() {
      let res = await Api.getESSList(0)
      this.engineerList = res.data || []
    },
    //获取结构列表
    async getStructureList() {
      let res = await Api.getESSList(this.selectEngineer.id)
      this.structureList = res.data || []
    },
    //获取分项工程列表
    async getSubEngineerList() {
      let res = await Api.getESSList(this.selectStructure.id)
      this.tableData = res.data || []
    },
    handleSelectEngineer(item) {
      this.selectEngineer = item
    },
    addEngineer() {
      this.selectEngineer = {}
      this.addEngineerVisible = true
    },
    handleChangeEngineer(row) {
      this.selectEngineer = row
      this.addEngineerVisible = true
    },
    //添加/修改工程
    async handleEngineerSubmit(row) {
      let params = { ...row, type: 1 }
      params.id ? await Api.updateESS(params) : await Api.addESS(params)
      this.$message.success(`${params.id ? '修改' : '添加'}成功`)
      this.addEngineerVisible = false
      await this.getEngineerList()
    },
    //删除工程
    async handleDeleteEngineer(row) {
      let res = await this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message.info('操作已取消')
      })
      if (res) {
        await Api.deleteESSById([row.id])
        this.$message.success('操作成功!')
        await this.getEngineerList()
      }
    },
    addStructure() {
      this.selectStructure = { pid: this.selectEngineer.id }
      this.addStructureVisible = true
    },
    handleChangeStructure(row) {
      this.selectStructure = row
      this.addStructureVisible = true
    },
    handleSelectStructure(item) {
      this.selectStructure = item
    },
    //添加/修改结构
    async handleStructureSubmit(row) {
      let params = { ...row, type: 2 }
      params.id ? await Api.updateESS(params) : await Api.addESS(params)
      this.$message.success(`${params.id ? '修改' : '添加'}成功`)
      this.addStructureVisible = false
      await this.getStructureList()
    },
    //删除结构
    async handleDeleteStructure(row) {
      let res = await this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message.info('操作已取消')
      })
      if (res) {
        await Api.deleteESSById([row.id])
        this.$message.success('操作成功!')
        await this.getStructureList()
      }
    },
    //添加分项工程
    addSubEngineer() {
      this.selectSubEngineer = {}
      this.addSubEngineerVisible = true
    },
    //修改分项工程
    editSubEngineer(row) {
      this.selectSubEngineer = row
      this.addSubEngineerVisible = true
    },
    //添加/修改分项工程
    async handleSubEngineerSubmit(row) {
      let params = { ...row, type: 3 }
      params.id ? await Api.updateESS(params) : await Api.addESS(params)
      this.$message.success(`${row.id ? '修改' : '添加'}成功`)
      this.addSubEngineerVisible = false
      await this.getSubEngineerList()
    },
    async deleteSubEngineer(row) {
      let res = await this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message.info('操作已取消')
      })
      if (res) {
        await Api.deleteESSById([row.id])
        this.$message.success('操作成功!')
        await this.getSubEngineerList()
      }
    }
  }
}
</script>

<style scoped lang="less">
@import url('~@/styles/common.less');
@border-color: #000;
.wrapper {
  display: flex;
  height: 100%;
  .arrow {
    height: 40px;
    width: 40px;
    align-self: center;
    /*background: #dc9e9e;*/
    background: url('~@/assets/images/arrow-right.png') no-repeat center;
    background-size: cover;
    margin: 0 10px;
  }
  .column {
    height: 100%;
    overflow: hidden;
    border: 1px @border-color solid;
    display: flex;
    flex-direction: column;
    header {
      text-align: center;
      font-weight: bold;
      padding: 5px 0;
      border-bottom: 1px @border-color solid;
    }
    .body {
      flex: 1;
      overflow: auto;
      padding: 10px;
    }
    &.engineer,
    &.structure {
      flex: 0 0 300px;
      .item {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 5px 0;
        padding: 5px;
        .name {
          flex: 1;
          border: 1px @border-color solid;
          padding: 10px;
          margin-right: 5px;
          .ellipsis;
        }
        .delete {
          color: red;
        }
        &.active {
          background-color: #74f665;
        }
      }
    }
    &.table-flex {
      flex: 1;
    }
    .add-btn {
      padding: 5px 10px;
      background-color: #4b9cff;
      color: #fff;
      text-align: center;
      margin: 10px 0;
    }
  }
}
</style>
