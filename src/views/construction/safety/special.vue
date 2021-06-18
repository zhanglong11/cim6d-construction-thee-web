<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="filterForm.content" style="width: 360px" placeholder="创建人/施工负责人" />
        </el-form-item>
        <el-form-item label="工种">
          <el-select v-model="filterForm.workType">
            <el-option
              v-for="(item, index) of workTypeList"
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
        <el-form-item>
          <el-button v-if="$hasPower('SafetySpecialAdd')" type="primary" icon="el-icon-plus" @click="addItem()"
            >新建</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="workType" title="工种" width="150">
        <template #default="{ row }">
          {{ $getLabel(workTypeList, row.workType) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="constructionArea" title="施工部位" min-width="150"></vxe-table-column>
      <vxe-table-column field="taskContentType" title="作业类型/内容" min-width="150"></vxe-table-column>
      <vxe-table-column field="constructionMangerName" title="施工负责人" min-width="120"></vxe-table-column>
      <vxe-table-column field="name" title="计划起始日期" width="200">
        <template #default="{ row }"> {{ row.planStartDate | ymd }}~{{ row.planEndDate | ymd }} </template>
      </vxe-table-column>
      <vxe-table-column field="safetyPrecautions" title="安全防护措施" min-width="200"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人" width="120"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间" width="150"></vxe-table-column>
      <vxe-table-column field="status" title="状态" width="150">
        <template #default="{ row }">
          {{ $getLabel(statusList, row.status - 0) }}
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="160" fixed="right">
        <template #default="{ row }">
          <template v-if="row.status - 0 === 0">
            <el-button v-if="$hasPower('SafetySpecialEdit')" type="text" @click="addItem(row.id)">编辑</el-button>
            <el-button v-if="$hasPower('SafetySpecialDelete')" type="text" @click="toDelete(row)">删除</el-button>
          </template>
          <el-button v-if="$hasPower('SafetySpecialDetail')" type="text" @click="toDetail(row)">查看</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <AddSpecial v-if="addVisible" :id="rowId" :visible.sync="addVisible" @submit="handleSubmit"></AddSpecial>
    <SpecialDetail v-if="detailVisible" :id="rowId" :visible.sync="detailVisible"></SpecialDetail>
  </div>
</template>

<script>
import Api from './api'
import statusList from './lib/auditStatus'
import AddSpecial from './components/addSpecial' //添加/编辑弹窗
import SpecialDetail from './components/specialDetail' //详情
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'SpecialList',
  components: { AddSpecial, SpecialDetail },
  data() {
    // 这里存放数据
    return {
      projectId: localStorage.getItem('projectId'),
      statusList,
      addVisible: !!+this.$route.query.showAdd || false, //添加弹窗
      detailVisible: false, //详情弹窗
      rowId: '', //点击的行id
      filterForm: {
        // 查询条件
        content: ''
      },
      request(body) {
        body.projectId = this.projectId
        return Api.getSpecialList(body)
      }
    }
  },
  computed: {
    //工种类型
    workTypeList() {
      return this.$getArgList('workType') || [{ value: 1, label: '架子工' }]
    }
  },
  beforeCreate() {
    let query = this.$route.query
    if (!+this.$route.query.showAdd && !!+this.$route.query.isDetail) {
      this.$router.replace({
        name: 'SafetySpecialDetail',
        query: { id: query.targetId, isCheck: query.isCheck }
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
    toDetail(row) {
      this.$router.push({
        name: 'SafetySpecialDetail',
        query: {
          id: row.id,
          isCheck: false
        }
      })
    },
    // 新建/编辑
    addItem(id = '') {
      this.rowId = id
      this.addVisible = true
    },
    //新建或编辑提交
    async handleSubmit(isSubmit, data) {
      let params = { ...data, projectId: this.projectId }
      let res = isSubmit ? await Api.submitSpecial(params) : await Api.addSpecial(params)
      if (res.code === 200) {
        this.addVisible = false
        await this.refresh()
      }
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
        await Api.deleteSpecialById([row.id])
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
