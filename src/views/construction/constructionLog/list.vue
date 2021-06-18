<template>
  <div class="container">
    <!-- 工具栏 start -->
    <el-form ref="form" :model="formData" inline>
      <el-form-item>
        <el-input v-model="formData.search" style="width: 240px" placeholder="日志编号/项目负责人" />
      </el-form-item>
      <el-form-item label="创建时间">
        <DateRange :startTime.sync="formData.createbeginTime" :endTime.sync="formData.createEndTime" />
      </el-form-item>
      <el-form-item label="编制日期">
        <DateRange :startTime.sync="formData.diaryDatebeginTime" :endTime.sync="formData.diaryDateEndTime" />
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
          <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item>
        <el-button v-if="$hasPower('ConstructionLogAdd')" type="primary" icon="el-icon-plus" @click="toEdit"
          >新建</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 工具栏 end -->

    <Grid ref="tableRef" :request="request" :filter-form.sync="formData">
      <vxe-table-column type="seq" title="序号" width="80"></vxe-table-column>
      <vxe-table-column field="code" title="日志编号" minWidth="100"></vxe-table-column>
      <vxe-table-column field="chargePersonName" title="项目负责人" minWidth="100"></vxe-table-column>
      <vxe-table-column field="todayWeather" title="今日天气" minWidth="100"></vxe-table-column>
      <vxe-table-column field="constructionPersonCount" title="施工人数" minWidth="100"></vxe-table-column>
      <vxe-table-column field="remark" title="备注" minWidth="100"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人" minWidth="100"></vxe-table-column>
      <vxe-table-column field="diaryDate" title="编制日期" minWidth="100">
        <template #default="{ row }">{{ row.diaryDate | formatData }}</template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button v-if="$hasPower('ConstructionLogDetail')" type="text" @click="toDetail(row.id)">查看</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import Api from './api/constructionLog'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'ConstructionLogList',
  components: {},
  data() {
    return {
      createTime: null,
      logDate: null,
      searchLoading: false,
      tableLoading: false,
      formData: {
        search: '',
        createEndTime: '',
        createbeginTime: '',
        diaryDateEndTime: '',
        diaryDatebeginTime: '',
        companyId: '',
        projectId: ''
      },
      logList: [],
      request(body) {
        body.projectId = this.projectId
        body.companyId = this.$store.getters.companyId
        return Api.getLogList(body)
      }
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  beforeCreate() {
    let query = this.$route.query
    if (query.showAdd === '0') {
      this.toDetail(query.targetId)
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.formData.projectId = this.projectId
    this.formData.companyId = this.$store.getters.companyId
  },
  // 方法集合
  methods: {
    //刷新数据
    refresh() {
      this.$refs.tableRef.refresh()
    },
    //重置搜索
    reset() {
      this.$refs.tableRef.reset()
    },
    // 编辑
    toEdit() {
      this.$router.push({
        name: `ConstructionLogAdd`
      })
    },
    // 跳转详情
    toDetail(id) {
      this.$router.push({
        name: 'ConstructionLogDetail',
        query: {
          id
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
