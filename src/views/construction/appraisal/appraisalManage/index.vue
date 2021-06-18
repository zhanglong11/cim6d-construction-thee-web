<template>
  <div>
    <!-- 工具栏开始 -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="filterForm.keyword"
            style="width: 300px"
            placeholder="考勤组名称/考勤负责人"
            suffix-icon="el-icon-search"
            @keyup.enter.native="refresh"
          />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('AppraisalAdd')" type="primary" icon="el-icon-plus" @click="getAdd(null)"
            >新建考勤组</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="attendanceGroupName" title="考勤组名称"></vxe-table-column>
      <vxe-table-column field="attendanceGroupPrincipalName" title="考勤负责人"> </vxe-table-column>
      <vxe-table-column field="attendanceGroupUserTotal" title="人数"> </vxe-table-column>
      <vxe-table-column field="locationName" title="地点"> </vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button v-if="$hasPower('AppraisalEdit')" type="text" @click="getEdit(row.attendanceGroupId)"
            >编辑</el-button
          >
          <el-button v-if="$hasPower('AppraisalDetail')" type="text" @click="getView(row.attendanceGroupId)"
            >详情</el-button
          >
          <el-button v-if="$hasPower('AppraisalDelete')" type="text" @click="getRemove(row.attendanceGroupId)"
            >删除</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import Api from '../api'

export default {
  name: 'AppraisalManage',
  components: {},
  data() {
    return {
      filterForm: {
        keyword: ''
      },
      //当前公司名称id
      companyId: null,
      //弹窗默认隐藏
      viewDialogVisible: !!+this.$route.query.showAdd || false,
      removeDialogVisible: false,
      editDialogVisible: false,
      //请求数据
      request(body) {
        return Api.getAttendanceClockInList(body)
      },
      optionList: []
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    //查看
    getView(id) {
      this.$router.push({
        name: `AppraisalDetail`,
        params: { id }
      })
    },
    //编辑
    getEdit(id) {
      this.$router.push({
        name: `AppraisalEdit`,
        params: { id }
      })
    },
    //新增
    getAdd() {
      this.$router.push({
        name: `AppraisalAdd`
      })
    },
    //删除
    async getRemove(id) {
      this.$confirm('确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Api.getAttendanceClockInDelete(id).then(res => {
            if (res.code === 200) {
              this.$message.info('删除成功')
              this.refresh()
            } else {
              this.$message.error('未知错误,请重试')
            }
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
