<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="班组名称">
          <SelectGroup v-model="name" valueField="name" @update:name="handlefilter"></SelectGroup>
        </el-form-item>
        <el-form-item style="margin-left: 30px">
          <el-input
            v-model="filterForm.content"
            style="width: 300px"
            placeholder="公司编号/公司名称/班组名称/负责人"
            suffix-icon="el-icon-search"
            @keyup.enter.native="refresh"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button
          v-if="$hasPower('LabourGroupAdd')"
          type="primary"
          icon="el-icon-plus"
          @click="$router.push('group/new')"
          >新建班组</el-button
        >
      </div>
    </div>

    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="labourCompanyName" title="公司名称"></vxe-table-column>
      <vxe-table-column field="name" title="班组名称"></vxe-table-column>
      <vxe-table-column field="principalName" title="负责人"></vxe-table-column>
      <vxe-table-column field="principalMobile" title="班组负责人联系方式"></vxe-table-column>
      <vxe-table-column field="employeeNum" title="班组人数"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button v-if="$hasPower('LabourGroupEdit')" type="text" @click="$router.push('group/' + row.id)"
            >编辑</el-button
          >
          <el-button v-if="$hasPower('LabourGroupDelete')" type="text" @click="remove([row])">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import SelectGroup from '../components/SelectGroup'
import Api from '../api/labour-api'
export default {
  name: 'Group',
  components: { SelectGroup },
  data() {
    return {
      name: '',
      filterForm: {
        projectId: localStorage.getItem('projectId'),
        name: ''
      },
      request(body) {
        return Api.getLabourGroupList(body)
      }
    }
  },
  mounted() {},
  methods: {
    handlefilter(val) {
      this.filterForm.name = val
    },
    refresh() {
      this.$refs.table.refresh()
    },
    remove(list) {
      this.$remove(idList => {
        return Api.deleteLabourGroup(idList.join(','))
      }, list).then(res => this.refresh())
    },
    reset() {
      this.$refs.table.reset()
      this.name = ''
    }
  }
}
</script>

<style scoped lang="less"></style>
