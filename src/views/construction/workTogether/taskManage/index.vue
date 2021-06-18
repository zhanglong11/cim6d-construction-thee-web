<template>
  <div class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="我是执行人" name="initiator" />
      <el-tab-pane label="我是发起人" name="executor" />
    </el-tabs>
    <div class="tooltips">
      <el-form ref="form" inline :model="filterForm">
        <el-form-item>
          <el-input v-model="filterForm.taskContent" placeholder="任务内容" :has-all-option="false" />
        </el-form-item>
        <el-form-item v-if="activeName === 'executor'" label="任务类型">
          <SelectList v-model="filterForm.taskType" :self-list="typeList" :has-all-option="false" />
        </el-form-item>
        <el-form-item label="任务重要性">
          <SelectList v-model="filterForm.taskLevel" :self-list="importList" :has-all-option="false" />
        </el-form-item>
        <el-form-item v-if="activeName === 'initiator'" label="任务发起人">
          <SelectUser v-model="filterForm.initiator" :multiple="false" value-format="id" append-to-body />
        </el-form-item>
        <el-form-item v-if="activeName === 'executor'" label="任务接收人">
          <SelectUser v-model="filterForm.executor" :multiple="false" value-format="id" append-to-body />
        </el-form-item>
        <el-form-item label="任务状态">
          <SelectList v-model="filterForm.status" :self-list="statusList" :has-all-option="false" />
        </el-form-item>
        <el-form-item label="任务截止时间">
          <DateRange :startTime.sync="filterForm.startTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-form-item v-if="activeName === 'executor' && $hasPower('taskManageAdd')">
          <el-button type="primary" icon="el-icon-plus" @click="showAdd(null, 'add')">新建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <Grid v-if="activeName === 'initiator'" key="1" ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="taskContent" title="任务内容" minWidth="200" />
      <!--      <vxe-table-column-->
      <!--        field="taskLevel"-->
      <!--        title="任务重要性"-->
      <!--        width="200"-->
      <!--        :formatter="({ cellValue }) => $getLabelFromArg('taskLevel', cellValue)"-->
      <!--      />-->
      <vxe-table-column
        field="taskLevel"
        title="任务重要性"
        width="140"
        :formatter="({ cellValue }) => $getLabel(importList, cellValue)"
      />
      <vxe-table-column field="initiatorStr" title="任务发起人" width="100" />
      <vxe-table-column field="taskEndTime" title="任务截止时间" width="200" />
      <vxe-table-column
        field="status"
        title="任务状态"
        width="120"
        :formatter="({ cellValue }) => $getLabel(statusList, cellValue)"
      />
      <vxe-table-column title="操作" width="300" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="activeName === 'executor' && row.status !== 1 && $hasPower('taskManageEdit')"
            type="text"
            @click="showAdd(row.id, 'edit')"
            >编辑</el-button
          >
          <el-button
            v-if="activeName === 'executor' && row.status !== 1 && $hasPower('taskManageCancel')"
            type="text"
            @click="showAdd(row.id, 'cancel')"
            >取消</el-button
          >
          <el-button
            v-if="activeName === 'executor' && row.status !== 1 && $hasPower('taskManageUrge')"
            type="text"
            @click="showAdd(row.id, 'urge')"
            >催办</el-button
          >
          <el-button v-if="activeName === 'executor'" type="text" @click="toDetail(row.id)">查看详情</el-button>

          <el-button v-if="activeName !== 'executor' && row.status !== 1" type="text" @click="showAdd(row.id, 'result')"
            >结果填报</el-button
          >
          <el-button
            v-if="activeName !== 'executor' && row.status === 1"
            type="text"
            @click="showAdd(row.id, 'resultDetail')"
            >查看结果填报</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>
    <Grid v-else ref="table" key="2" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="taskContent" title="任务内容" minWidth="200" />
      <vxe-table-column
        field="taskType"
        title="任务分类"
        width="120"
        :formatter="({ cellValue }) => (cellValue ? '多任务' : '单一任务')"
      />
      <!--      <vxe-table-column-->
      <!--        field="taskLevel"-->
      <!--        title="任务重要性"-->
      <!--        width="200"-->
      <!--        :formatter="({ cellValue }) => $getLabelFromArg('taskLevel', cellValue)"-->
      <!--      />-->
      <vxe-table-column
        field="taskLevel"
        title="任务重要性"
        width="140"
        :formatter="({ cellValue }) => $getLabel(importList, cellValue)"
      />
      <vxe-table-column field="executorStr" title="任务执行人" width="200" />
      <vxe-table-column field="taskEndTime" title="任务截止时间" width="200" />
      <vxe-table-column
        field="status"
        title="任务状态"
        width="120"
        :formatter="({ cellValue }) => $getLabel(statusList, cellValue)"
      />
      <vxe-table-column title="操作" width="300" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="activeName === 'executor' && row.status !== 1 && $hasPower('taskManageEdit')"
            type="text"
            @click="showAdd(row.id, 'edit')"
            >编辑</el-button
          >
          <el-button
            v-if="activeName === 'executor' && row.status !== 1 && $hasPower('taskManageCancel')"
            type="text"
            @click="showAdd(row.id, 'cancel')"
            >取消</el-button
          >
          <el-button
            v-if="activeName === 'executor' && row.status !== 1 && $hasPower('taskManageUrge')"
            type="text"
            @click="showAdd(row.id, 'urge')"
            >催办</el-button
          >
          <el-button v-if="activeName === 'executor'" type="text" @click="toDetail(row.id)">查看详情</el-button>

          <el-button
            v-if="activeName !== 'executor' && row.status !== 1 && $hasPower('taskManageResultWrite')"
            type="text"
            @click="showAdd(row.id, 'result')"
            >结果填报</el-button
          >
          <el-button
            v-if="activeName !== 'executor' && row.status === 1 && $hasPower('taskManageResultWatch')"
            type="text"
            @click="showAdd(row.id, 'resultDetail')"
            >查看结果填报</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>
    <AddDialog v-if="visible" :visible.sync="visible" :type="type" :activeId="activeId" :taskType="taskType" />
  </div>
</template>

<script>
import Api from './api'
import AddDialog from './components/addDialog'
import typeList from './lib/typeList'
import importList from './lib/importList'
import statusList from './lib/statusList'
export default {
  name: 'TaskManage',
  components: {
    AddDialog
  },
  data() {
    return {
      activeName: this.$route.query?.activeName || 'initiator',
      filterForm: {
        executeFlag: false
      },
      visible: !!+this.$route.query.showAdd || false,
      request: body => Api.list(body),
      activeId: this.$route.query.id || null,
      type: 'add',
      taskType: this.$route.query.taskType || 0, //0,单任务,1:多任务
      typeList,
      statusList,
      importList,
      currentId: localStorage.getItem('id')
    }
  },
  computed: {
    taskLevel() {
      return this.$getArgList('workMeetingType') || []
    }
  },
  watch: {
    activeName(v) {
      this.$router.replace({ query: { activeName: v } })
      this.filterForm = {
        executeFlag: v === 'executor'
      }
    },
    filterForm: {
      handler: function () {
        this.$nextTick(() => {
          this.refresh()
        })
      },
      deep: true
    }
  },
  beforeCreate() {
    let query = this.$route.query
    if (query.showAdd === '0') {
      this.toDetail(query.targetId)
    }
  },

  mounted() {
    this.filterForm = {
      executeFlag: this.activeName === 'executor'
    }
    this.init()
  },
  methods: {
    // 初始化
    init() {
      if (this.activeId) {
        this.showAdd(this.activeId, 'result')
      }
    },
    //刷新数据
    refresh() {
      this.$refs.table.refresh()
    },
    //重置搜索
    reset() {
      this.$refs.table.reset()
      this.filterForm = {
        ...this.filterForm,
        ...{ executeFlag: this.activeName === 'executor' }
      }
    },
    showAdd(id, type = 'add') {
      this.activeId = id
      this.type = type
      this.visible = true
    },
    toDetail(id) {
      this.$router.push({ name: `TaskManageDetail`, query: { id } })
    }
  }
}
</script>
<style lang="less" scoped></style>
