<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="filterForm.keyword" style="width: 360px" placeholder="危险源名称/创建人" />
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
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item v-if="$hasPower('SafetyDangerAdd')">
          <el-button type="primary" icon="el-icon-plus" @click="addItem()">添加危险源</el-button>
        </el-form-item>
        <el-form-item v-if="$hasPower('SafetyDangerAroundInspect')">
          <el-button type="primary" @click="handleDangerAroundInspect">危险源巡查</el-button>
        </el-form-item>
        <el-form-item v-if="$hasPower('SafetyDangerCheckRectifyListList')">
          <el-button type="primary" @click="toDangerInspectList()">危险源检查及整改记录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="dangerSource" title="危险源名称" min-width="150"></vxe-table-column>
      <vxe-table-column field="harmCategory" title="伤害类型" width="150">
        <template #default="{ row }">
          {{ $getLabel(harmTypeList, row.harmCategory) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="precautionaryMeasure" title="防范措施" min-width="200"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人" width="120"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间" width="150"></vxe-table-column>
      <vxe-table-column field="remark" title="备注" min-width="150"></vxe-table-column>
      <vxe-table-column title="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button v-if="$hasPower('SafetyDangerEdit')" type="text" @click="addItem(row.id)">编辑</el-button>
          <el-button v-if="$hasPower('SafetyDangerDelete')" type="text" @click="toDelete(row)">删除</el-button>
          <el-button v-if="$hasPower('SafetyDangerDetail')" type="text" @click="toDetail(row)">查看</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <AddDanger v-if="addVisible" :id="rowId" :visible.sync="addVisible" @submit="handleSubmit"></AddDanger>
    <DangerDetail v-if="detailVisible" :id="rowId" :visible.sync="detailVisible"></DangerDetail>
    <!--巡查弹窗 start-->
    <DangerCheckDetailForm v-if="detailFormVisible" :visible.sync="detailFormVisible"></DangerCheckDetailForm>
    <!--巡查弹窗 end -->
  </div>
</template>

<script>
import Api from './api'
import AddDanger from './components/addDanger' //添加/编辑弹窗
import DangerDetail from './components/dangerDetail' //详情
import DangerCheckDetailForm from './components/dangerCheckDetailForm' //巡查弹窗
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'DangerList',
  components: { AddDanger, DangerDetail, DangerCheckDetailForm },
  data() {
    // 这里存放数据
    return {
      projectId: localStorage.getItem('projectId'),
      addVisible: !!+this.$route.query.showAdd || false, //添加弹窗
      detailVisible: false, //详情弹窗
      detailFormVisible: false, //巡查窗口
      rowId: '', //点击的行id
      filterForm: {
        // 查询条件
        keyword: ''
      },
      request(body) {
        body.projectId = this.projectId
        return Api.getDangerList(body)
      }
    }
  },
  computed: {
    //伤害类型
    harmTypeList() {
      return this.$getArgList('harmType') || []
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
    toDetail(row) {
      this.$router.push({
        name: 'SafetyDangerDetail',
        query: {
          id: row.id
        }
      })
    },
    // 新建/编辑
    addItem(id = '') {
      this.rowId = id
      this.addVisible = true
    },
    //危险源巡查
    handleDangerInspect() {
      this.detailFormVisible = true
    },
    //危险源巡查按钮(路由)
    handleDangerAroundInspect() {
      this.$router.push({
        name: 'SafetyDangerAroundInspect'
      })
    },
    //跳转到整改列表
    toDangerInspectList() {
      this.$router.push({
        name: 'SafetyDangerCheckRectifyList'
      })
    },
    //新建或编辑提交
    async handleSubmit(data) {
      this.rowId ? await Api.updateDanger(data) : await Api.addDanger(data)
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      await this.refresh()
      this.addVisible = false
    },
    // 删除计划 - 异步
    async toDelete(row) {
      let res = await this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作已取消'
        })
      })
      if (res) {
        await Api.deleteDanger([row.id])
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        await this.refresh()
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
