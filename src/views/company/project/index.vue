<template>
  <el-card>
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="filterForm.name" placeholder="搜索项目名称" @keyup.enter.prevent></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="$hasPower('CompanyProjectAdd')"
            type="primary"
            @click="$store.commit('setAddProjectDialog', true)"
            >新建项目</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <Grid ref="table" auto-search page-use-query :filter-form.sync="filterForm" :request="request">
      <vxe-table-column title="项目名称" field="name">
        <template #default="{ row }">
          <span
            v-if="row.projectUserCategory === 1"
            class="el-icon-star-on"
            style="color: green; font-size: 18px; margin-right: 5px"
          />
          <span>{{ row.name }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="companyName" min-width="150" title="所属企业"></vxe-table-column>
      <vxe-table-column field="principalName" title="项目负责人" width="100px"></vxe-table-column>
      <vxe-table-column field="telephone" title="联系电话" width="100px"></vxe-table-column>
      <vxe-table-column field="projectStatus" title="项目状态" width="80">
        <template slot-scope="scope">{{ $getLabelFromArg('projectStatus', scope.row.projectStatus) }}</template>
      </vxe-table-column>
      <vxe-table-column title="创建时间" field="createTime"></vxe-table-column>
      <vxe-table-column title="位置">
        <template #default="{ row }"> {{ row.province }} - {{ row.city }} - {{ row.county }} </template>
      </vxe-table-column>
      <vxe-table-column v-if="$hasPower('CompanyProjectEdit')" title="操作" width="150">
        <template #default="{ row }">
          <el-button v-if="row.projectUserCategory === 1" type="text" @click="$router.push(`project/${row.id}/edit/`)"
            >编辑</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>
  </el-card>
</template>

<script>
import Api from '@/api'
export default {
  name: 'CompanyProject',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      list: [],
      filterForm: {},
      request(body) {
        return Api.getCompanyProjectList(body)
      }
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {
    this.$event.on('projectListChange', this.refresh)
  },
  beforeDestroy() {
    this.$event.off('projectListChange', this.refresh)
  },
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color';
</style>
