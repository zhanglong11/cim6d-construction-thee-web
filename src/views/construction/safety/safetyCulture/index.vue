<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="filterForm.search" style="width: 360px" placeholder="创建人/整改单位/回复单位" />
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange :startTime.sync="filterForm.startDate" :endTime.sync="filterForm.endDate"></DateRange>
        </el-form-item>
        <el-form-item label="审批状态">
          <Select v-model="filterForm.status" :options="statusType" has-all />
        </el-form-item>
        <el-form-item label="检查日期/覆盖周期：">
          <DateRange
            :startTime.sync="filterForm.checkCoverageStartDate"
            :endTime.sync="filterForm.checkCoverageEndDate"
          ></DateRange>
        </el-form-item>
        <el-form-item label="表单类型：">
          <Select v-model="filterForm.type" :options="formType" has-all />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <div>
          <el-form-item>
            <el-button v-if="$hasPower('PerilAdd')" type="primary" icon="el-icon-plus" @click="addItemOne()"
              >新建《中交天航2a标段安全隐患检查记录》</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button v-if="$hasPower('ReplyAdd')" type="primary" icon="el-icon-plus" @click="addItemTwo()"
              >新建《周安全检查回复表》</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button v-if="$hasPower('CheckAdd')" type="primary" icon="el-icon-plus" @click="addItemTwos()"
              >新建《安全月度联合检查回复表》</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button v-if="$hasPower('RectifyAdd')" type="primary" icon="el-icon-plus" @click="addItemTheres()"
              >新建《质量安全整改回复单》</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="type" title="表单类型">
        <template #default="{ row }">
          {{ $getLabel(formType, row.type) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="rectificationReplyCompany" title="整改/回复单位">
        <template #default="{ row }">
          {{ row.type === 1 ? '-' : row.rectificationReplyCompany }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="checkCoverageDate" title="检查日期/覆盖周期">
        <template #default="{ row }">
          {{
            row.type === 1
              ? moment(row.checkCoverageDate).format('YYYY-MM-DD')
              : row.checkCoverageDate
              ? moment(row.checkCoverageDate.split('~')[0]).format('YYYY-MM-DD') +
                '~' +
                moment(row.checkCoverageDate.split('~')[1]).format('YYYY-MM-DD')
              : row.checkCoverageDate
              ? row.checkCoverageDate
              : '-'
          }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间">
        <template #default="{ row }">
          {{ moment(row.createTime).format('YYYY-MM-DD HH:ss') }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="status" title="审批状态">
        <template #default="{ row }">
          {{ $getLabel(statusType, row.status) }}
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="200" fixed="right">
        <template #default="{ row }">
          <template v-if="row.status === 0 || row.type === 1">
            <!-- 草稿状态 -->
            <el-button type="text" @click="toUpdate(row)">修改</el-button>
            <el-button v-if="$hasPower('SafetyIssueDeletes')" type="text" @click="toDelete(row)">删除</el-button>
          </template>
          <template v-if="row.type === 1">
            <el-button v-if="$hasPower('PerilDetail') || $hasPower('SafetyDetail')" type="text" @click="toDetail(row)"
              >查看详情</el-button
            >
          </template>
          <template v-if="row.status === 1">
            <!-- 审批中 -->
            <el-button
              v-if="
                $hasPower('RectifyDetail') ||
                $hasPower('CheckDetail') ||
                $hasPower('ReplyDetail') ||
                $hasPower('PerilDetail') ||
                $hasPower('SafetyDetail')
              "
              type="text"
              @click="toDetail(row)"
              >查看详情</el-button
            >
          </template>
          <template v-if="row.status === 2">
            <!-- 合格 -->
            <el-button
              v-if="
                $hasPower('RectifyDetail') ||
                $hasPower('CheckDetail') ||
                $hasPower('ReplyDetail') ||
                $hasPower('PerilDetail') ||
                $hasPower('SafetyDetail')
              "
              type="text"
              @click="toDetail(row)"
              >查看详情</el-button
            >
          </template>
          <template v-if="row.status === 3">
            <!-- 不合格 -->
            <el-button
              v-if="
                $hasPower('RectifyDetail') ||
                $hasPower('CheckDetail') ||
                $hasPower('ReplyDetail') ||
                $hasPower('PerilDetail') ||
                $hasPower('SafetyDetail')
              "
              type="text"
              @click="toDetail(row)"
              >查看详情</el-button
            >
            <el-button type="text" @click="toUpdate(row)">再次发起</el-button>
          </template>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import Api from '../api'
import { statusType, formType } from '../lib/safetyStauas'

export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'SafetyCultureList',
  components: {},
  data() {
    // 这里存放数据
    return {
      projectId: localStorage.getItem('projectId'),
      statusType,
      formType,
      filterForm: {
        search: ''
      },
      request(body) {
        return Api.getsafetyHiddenList(body)
      }
    }
  },
  computed: {
    //登录的用户id
    userId() {
      return this.$store.state.user.id
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
    //新建
    addItemOne() {
      this.$router.push({
        name: 'PerilAdd'
      })
    },
    addItemTwo() {
      this.$router.push({
        name: 'ReplyAdd'
      })
    },
    addItemTwos() {
      this.$router.push({
        name: 'CheckAdd'
      })
    },
    addItemTheres() {
      this.$router.push({
        name: 'RectifyAdd'
      })
    },
    //修改
    toUpdate(row) {
      console.log(row)
      //安全隐患检查
      if (row.type === 1) {
        this.$router.push({
          name: 'PerilEdit',
          query: { id: row.safetyProblemId }
        })
      } else if (row.type === 2) {
        //周安全检查回复表
        this.$router.push({
          name: 'ReplyEdit',
          query: { id: row.safetyProblemId, status: row.status }
        })
      } else if (row.type === 3) {
        //安全月度联合检查回复表
        this.$router.push({
          name: 'CheckEdit',
          query: { id: row.safetyProblemId, status: row.status }
        })
      } else if (row.type === 4) {
        //质量安全整改回复单
        this.$router.push({
          name: 'RectifyEdit',
          query: { id: row.safetyProblemId, status: row.status }
        })
      }
    },
    //详情
    toDetail(row) {
      this.$router.push({
        name: 'SafetyDetail',
        query: { id: row.safetyProblemId }
      })
      //安全隐患检查
      // if (row.type === 1) {
      //   this.$router.push({
      //     name: 'PerilDetail',
      //     query: { id: row.safetyProblemId }
      //   })
      // } else if (row.type === 2) {
      //   //周安全检查回复表
      //   this.$router.push({
      //     name: 'ReplyDetail',
      //     query: { id: row.safetyProblemId }
      //   })
      // } else if (row.type === 3) {
      //   //安全月度联合检查回复表
      //   this.$router.push({
      //     name: 'CheckDetail',
      //     query: { id: row.safetyProblemId }
      //   })
      // } else if (row.type === 4) {
      //   //质量安全整改回复单
      //   this.$router.push({
      //     name: 'RectifyDetail',
      //     query: { id: row.safetyProblemId }
      //   })
      // }
    },
    // 删除计划 - 异步
    async toDelete(row) {
      let res = await this.$confirm('是否删除该表单?', '提示', {
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
        await Api.getsafetyHiddenDelete([row.safetyProblemId])
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
