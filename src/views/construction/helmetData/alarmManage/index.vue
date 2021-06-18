<template>
  <div>
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="filterForm.keyWord"
            suffix-icon="el-icon-search"
            placeholder="姓名/设备编号"
            style="width: 206px"
          ></el-input>
        </el-form-item>
        <el-form-item label="报警时间">
          <DateRange :startTime.sync="filterForm.startDate" :endTime.sync="filterForm.endDate"></DateRange>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="staffName" title="姓名"></vxe-table-column>
      <vxe-table-column field="deviceNum" title="设备编号"> </vxe-table-column>
      <vxe-table-column field="adminName" title="创建人"> </vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"> </vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button v-if="$hasPower('AppraisalDetail')" type="text" @click="handleDetail(row)">详情</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import Api from '../api'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'AlarmManageList',
  components: {},
  data() {
    // 这里存放数据
    return {
      filterForm: {
        keyWord: '',
        projectId: localStorage.getItem('projectId')
      },
      //请求数据
      request(body) {
        return Api.getSafeCapDeviceList(body)
      }
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    // 查询
    refresh() {
      this.$refs.table.refresh()
    },
    // 重置
    reset() {
      this.$refs.table.reset()
    },
    // 查看
    handleDetail(row) {
      this.$router.push({
        name: 'AlarmManageDetail',
        query: { id: row.deviceNum }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
