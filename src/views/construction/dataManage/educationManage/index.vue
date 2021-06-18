<template>
  <div>
    <!-- 工具栏开始 -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="filterForm.keyword"
            style="width: 300px"
            placeholder="视频名称/创建人"
            suffix-icon="el-icon-search"
            @keyup.enter.native="refresh"
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange :startTime.sync="filterForm.startTime" :endTime.sync="filterForm.endTime"></DateRange>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('EducationAdd')" type="primary" icon="el-icon-plus" @click="getAdd(null)"
            >新建安全教育视频</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="videoName" title="视频名称"></vxe-table-column>
      <vxe-table-column field="defaultFlag" title="是否默认">
        <template #default="{ row }">
          {{ row.defaultFlag === true ? '是' : '否' }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"> </vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"> </vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button v-if="$hasPower('EducationEdit')" type="text" @click="getEdit(row)">编辑</el-button>
          <el-button v-if="$hasPower('EducationDetail')" type="text" @click="getView(row)">详情</el-button>
          <el-button
            v-if="$hasPower('EducationDelete') && row.defaultFlag != true"
            type="text"
            @click="getRemove(row.safetyEducationVideoId)"
            >删除</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>
    <!-- 查看模态框 -->
    <EducationDetail v-if="viewDialogVisible" :id="educationId" :visible.sync="viewDialogVisible"></EducationDetail>
    <!-- 新增修改模态框 -->
    <EducationEdit v-if="editDialogVisible" :id="educationId" :visible.sync="editDialogVisible"></EducationEdit>
  </div>
</template>

<script>
import Api from '../api/index'
import EducationEdit from './Edit'
import EducationDetail from './Deatil'
export default {
  name: 'EducationManage',
  components: { EducationEdit, EducationDetail },
  data() {
    return {
      filterForm: {},
      //弹窗默认隐藏
      viewDialogVisible: !!+this.$route.query.showAdd || false,
      editDialogVisible: false,
      educationId: '',
      //请求数据
      request(body) {
        return Api.getEducationList(body)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    //查看
    getView(row) {
      this.viewDialogVisible = true
      this.educationId = row.safetyEducationVideoId
    },
    //编辑
    getEdit(row) {
      this.editDialogVisible = true
      this.educationId = row.safetyEducationVideoId
    },
    //新增
    getAdd() {
      this.editDialogVisible = true
      this.educationId = ''
    },
    //删除
    async getRemove(id) {
      this.$confirm('确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Api.getEducationDelete(id).then(() => {
            this.$message.success('删除成功')
            this.refresh()
          })
        })
        .catch(() => {})
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
