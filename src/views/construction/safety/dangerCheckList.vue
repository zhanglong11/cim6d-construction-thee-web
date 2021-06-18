<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="filterForm.search"
            style="width: 360px"
            placeholder="危险源名称/创建人/责任人/检查人/复检人"
          />
        </el-form-item>
        <el-form-item label="伤害类型">
          <el-select v-model="filterForm.harmCategory">
            <el-option
              v-for="(item, index) of harmTypeList"
              :key="'ss' + index"
              :value="item.value"
              :label="item.label"
            ></el-option
          ></el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status">
            <el-option
              v-for="(item, index) of statusList"
              :key="'ss' + index"
              :value="item.value"
              :label="item.label"
            ></el-option
          ></el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item v-if="$hasPower('SafetyDangerAroundInspect')">
          <el-button type="primary" @click="handleDangerAroundInspect">危险源巡查</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column field="dangerSource" title="危险源名称" min-width="150"></vxe-table-column>
      <vxe-table-column field="harmCategory" title="伤害类型" width="150">
        <template #default="{ row }">
          {{ $getLabel(harmTypeList, row.harmCategory) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="precautionaryMeasure" title="防范措施" min-width="200"></vxe-table-column>
      <vxe-table-column field="dangerSourcePlaceName" title="所在位置" width="200"></vxe-table-column>
      <vxe-table-column field="timelinessTime" title="危险源时效性" width="200">
        <template #default="{ row }"> {{ row.timelinessStartTime | ymd }}~{{ row.timelinessEndTime | ymd }} </template>
      </vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人" width="120"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间" width="150"></vxe-table-column>
      <vxe-table-column field="inspectorName" title="检查人" width="120"></vxe-table-column>
      <vxe-table-column field="inspectTime" title="检查时间" width="150"></vxe-table-column>
      <vxe-table-column field="reviewerName" title="复查人" width="120"></vxe-table-column>
      <vxe-table-column field="reviewTime" title="复查时间" width="150"> </vxe-table-column>
      <vxe-table-column field="principalName" title="责任人" width="120"></vxe-table-column>
      <vxe-table-column field="status" title="状态" width="150">
        <template #default="{ row }">
          {{ $getLabel(statusList, row.status - 0) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="remark" title="备注" min-width="150"></vxe-table-column>
      <vxe-table-column title="操作" width="200" fixed="right">
        <template #default="{ row }">
          <template v-if="$hasPower('SafetyDangerCheckRectifyRectify') && row.status === 1 && row.principal == userId">
            <el-button type="text" @click="toDetail(row.id, 'rectify')">整改</el-button>
          </template>
          <template v-if="$hasPower('SafetyDangerCheckRectifyReview') && row.status === 2">
            <el-button type="text" @click="toDetail(row.id, 'review')">复查</el-button>
          </template>
          <el-button v-if="$hasPower('SafetyDangerCheckRectifyDetail')" type="text" @click="toDetail(row.id)"
            >查看</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>
    <DangerInspectDetail
      v-if="detailVisible"
      :id="rowId"
      :visible.sync="detailVisible"
      :viewType="viewType"
      @submit="handleSubmit"
    ></DangerInspectDetail>
    <!--巡查弹窗 start-->
    <DangerCheckDetailForm v-if="detailFormVisible" :visible.sync="detailFormVisible"></DangerCheckDetailForm>
    <!--巡查弹窗 end -->
  </div>
</template>

<script>
import Api from './api'
import DangerCheckDetailForm from './components/dangerCheckDetailForm' //巡查弹窗
import DangerInspectDetail from './components/dangerInspectDetail' //详情
import statusList from './lib/problemStatusList'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'DangerCheckList',
  components: { DangerCheckDetailForm, DangerInspectDetail },
  data() {
    // 这里存放数据
    return {
      projectId: localStorage.getItem('projectId'),
      statusList, //检查状态
      detailVisible: false, //详情弹窗
      detailFormVisible: false, //巡查弹窗
      rowId: '', //点击的行id
      viewType: '', //rectify:整改,review:复查
      filterForm: {
        // 查询条件
        search: ''
      },
      request(body) {
        body.projectId = this.projectId
        return Api.getDangerInspectList(body)
      }
    }
  },
  computed: {
    //伤害类型
    harmTypeList() {
      return this.$getArgList('harmType') || []
    },
    //登录的用户id
    userId() {
      return this.$store.state.user.id
    }
  },
  beforeCreate() {
    let query = this.$route.query
    if (query.showAdd === '0') {
      this.$router.push({
        name: 'SafetyDangerCheckRectifyDetail',
        query: { id: query.targetId }
      })
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    //刷新数据
    refresh() {
      this.$refs.table.refresh()
    },
    //重置搜索
    reset() {
      this.$refs.table.reset()
    },
    // 查看详情
    toDetail(id, type) {
      this.$router.push({
        name: 'SafetyDangerCheckRectifyDetail',
        query: { id, viewType: type }
      })
    },
    //危险源巡查按钮(路由)
    handleDangerAroundInspect() {
      this.$router.push({
        name: 'SafetyDangerAroundInspect'
      })
    },
    //新建或编辑提交
    handleSubmit(data) {
      this.addVisible = false
    }
  }
}
</script>
<style lang="less" scoped></style>
