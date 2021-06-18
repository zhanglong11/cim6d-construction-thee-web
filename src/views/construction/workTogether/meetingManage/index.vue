<template>
  <div class="container">
    <div class="tooltips">
      <el-form ref="form" inline :model="filterForm">
        <el-form-item>
          <el-input
            v-model="filterForm.keyword"
            style="width: 320px"
            placeholder="会议主题/创建人/参与人/发起人/会议记录上传人"
          />
        </el-form-item>
        <el-form-item label="会议类型">
          <SelectList v-model="filterForm.meetingType" :self-list="meetingType" :has-all-option="false" />
        </el-form-item>
        <el-form-item label="会议状态">
          <SelectList v-model="filterForm.status" :self-list="statusList" :has-all-option="false" />
        </el-form-item>
        <el-form-item label="会议开始时间">
          <DateRange :startTime.sync="filterForm.startTime" :endTime.sync="filterForm.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-form-item v-if="$hasPower('meetingManageAdd')">
          <el-button type="primary" icon="el-icon-plus" @click="showAdd(null, 'add')">新建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="meetingSubject" title="会议主题" minWidth="200" />
      <vxe-table-column
        field="meetingType"
        title="会议类型"
        width="150"
        :formatter="({ cellValue }) => $getLabelFromArg('workMeetingType', cellValue)"
      />
      <vxe-table-column field="initiatorName" title="发起人" width="200" />
      <vxe-table-column field="participantName" title="参与人" width="200" />
      <vxe-table-column field="startTime" title="会议开始时间" width="200" />
      <vxe-table-column field="endTime" title="会议结束时间" width="200" />
      <vxe-table-column field="meetingAddress" title="会议地址" width="200" />
      <vxe-table-column field="creatorName" title="会议创建人" width="200" />
      <vxe-table-column field="createTime" title="会议创建时间" width="200" />
      <vxe-table-column
        field="status"
        title="会议状态"
        width="200"
        :formatter="({ cellValue }) => $getLabel(statusList, cellValue)"
      />
      <vxe-table-column field="recorderName" title="会议记录上传人" width="200" />
      <vxe-table-column title="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="$hasPower('meetingManageEdit') && row.status === 0 && currentId === row.creator"
            type="text"
            @click="showAdd(row.id, 'edit')"
            >编辑</el-button
          >
          <el-button
            v-if="$hasPower('meetingManageCancel') && row.status === 0 && currentId === row.creator"
            type="text"
            @click="showAdd(row.id, 'cancel')"
            >取消</el-button
          >
          <el-button
            v-if="$hasPower('meetingManageUpload') && row.status === 2 && !row.meetingFileId"
            type="text"
            @click="showAdd(row.id, 'upload')"
            >上传会议记录</el-button
          >
          <el-button
            v-if="row.status === 2 && row.meetingFileId && currentId === row.recorderId"
            type="text"
            @click="showAdd(row.id, 'repeat')"
            >替换会议记录</el-button
          >
          <el-button v-if="row.status === 2 && row.meetingFileId" type="text" @click="showFile(row.meetingFileId)"
            >查看会议记录</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>
    <AddDialog v-if="visible" :visible.sync="visible" :addForm.sync="addForm" :type="type" :activeId="activeId" />
    <RepeatDialog
      v-if="repeatVisible"
      :visible.sync="repeatVisible"
      :addVisible.sync="visible"
      :repeat-data.sync="repeatData"
      :active-key.sync="activeKey"
    />
    <FileDialog v-if="fileVisible" :visible.sync="fileVisible" :fileId="fileId" />
  </div>
</template>

<script>
import Api from './api'
import AddDialog from './components/addDialog'
import RepeatDialog from './components/repeatDialog'
import FileDialog from './components/fileDialog'
export default {
  name: 'MeetingManage',
  components: {
    AddDialog,
    RepeatDialog,
    FileDialog
  },
  data() {
    return {
      filterForm: {},
      visible: !!+this.$route.query.showAdd || false,
      addForm: {},
      repeatVisible: false,
      fileVisible: false,
      request: body => Api.list(body),
      repeatData: [],
      activeId: this.$route.query.id || null,
      activeKey: 0,
      type: 'add',
      fileId: null,
      currentId: localStorage.getItem('id'),
      statusList: [
        {
          label: '未开始',
          value: 0
        },
        {
          label: '进行中',
          value: 1
        },
        {
          label: '已完成',
          value: 2
        }
      ]
    }
  },
  computed: {
    meetingType() {
      return this.$getArgList('workMeetingType') || []
    }
  },
  mounted() {
    this.init()
  },
  beforeCreate() {
    let query = this.$route.query
    if (query.showAdd === '0') {
      this.showAdd(query.targetId, 'details')
    }
  },
  methods: {
    // 初始化
    init() {
      if (this.activeId) {
        this.showAdd(this.activeId, 'details')
      }
    },
    //刷新数据
    refresh() {
      this.$refs.table.refresh()
    },
    //重置搜索
    reset() {
      this.$refs.table.reset()
    },
    //添加模态框
    showAdd(id, type = 'add') {
      this.activeId = id
      this.type = type
      this.visible = true
    },
    async save(isAdd = false) {
      if (!isAdd) {
        let res = []
        res = this.type === 'add' ? await Api.add(this.addForm) : await Api.update(this.addForm)
        if (res.data && res.data.length) {
          this.repeatData = res.data
          this.repeatVisible = true
          return
        }
        this.visible = false
        this.$message.success('操作成功')
        this.refresh()
        return
      }
      let cloneData = { ...this.addForm, ...{ hardAdd: true } }
      this.type === 'add' ? Api.add(cloneData) : Api.update(cloneData)
      this.visible = false
      this.$message.success('操作成功')
      this.refresh()
    },
    showFile(fileId) {
      this.fileId = fileId
      this.fileVisible = true
    }
  }
}
</script>
<style lang="less" scoped></style>
