<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="filterForm.search" style="width: 360px" placeholder="创建人/通知单位/联系单位" />
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange :startTime.sync="filterForm.startDate" :endTime.sync="filterForm.endDate"></DateRange>
        </el-form-item>
        <el-form-item label="表单类型">
          <el-select v-model="filterForm.type">
            <el-option
              v-for="(item, index) of formType"
              :key="'ss' + index"
              :value="item.value"
              :label="item.label"
            ></el-option
          ></el-select>
        </el-form-item>
        <el-form-item label="审批状态">
          <el-select v-model="filterForm.status">
            <el-option
              v-for="(item, index) of statusType"
              :key="'ssn' + index"
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
        <div>
          <el-form-item>
            <el-button v-if="$hasPower('QualityAdd')" type="primary" icon="el-icon-plus" @click="addItemQuality(null)"
              >新建《工程质量通知单》</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button v-if="$hasPower('ProjectAdd')" type="primary" icon="el-icon-plus" @click="addItemProject(null)"
              >新建《工程业务联系单》</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button v-if="$hasPower('WorkAdd')" type="primary" icon="el-icon-plus" @click="addItemWork(null)"
              >新建《工作业务联系单》</el-button
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
      <vxe-table-column field="noticeContactCompany" title="通知/联系单位"></vxe-table-column>
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
      <vxe-table-column title="操作" width="300" fixed="right">
        <template #default="{ row }">
          <template v-if="row.status === 0">
            <!-- 草稿状态 -->
            <el-button type="text" @click="toUpdate(row)">修改</el-button>
            <el-button v-if="$hasPower('QualityIssueDeletes')" type="text" @click="toDelete(row)">删除</el-button>
          </template>
          <template v-if="row.status === 1">
            <!-- 审批中 -->
            <el-button
              v-if="
                $hasPower('QualityDetail') ||
                $hasPower('ProjectDetail') ||
                $hasPower('WorkDetail') ||
                $hasPower('ProblemDetail')
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
                $hasPower('QualityDetail') ||
                $hasPower('ProjectDetail') ||
                $hasPower('WorkDetail') ||
                $hasPower('ProblemDetail')
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
                $hasPower('QualityDetail') ||
                $hasPower('ProjectDetail') ||
                $hasPower('WorkDetail') ||
                $hasPower('ProblemDetail')
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
import { statusType, formType } from '../lib/issueStatusList'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'QualityProblem',
  components: {},
  data() {
    // 这里存放数据
    return {
      formType,
      statusType,
      addVisible: !!+this.$route.query.showAdd || false, //添加弹窗
      rowId: '', //点击的行id
      rowTableData: [], //点击编辑时传递的默认数据
      filterForm: {
        search: ''
      },
      request(body) {
        return Api.getQualityProblem(body)
      }
    }
  },
  computed: {
    //登录的用户id
    userId() {
      return this.$store.state.user.id
    }
  },
  beforeCreate() {
    let query = this.$route.query
    if (!+this.$route.query.showAdd && !!+this.$route.query.isDetail) {
      this.$router.replace({
        name: 'QualityDetail',
        query: { id: query.targetId, isCheck: query.isCheck }
      })
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    //新建
    addItemQuality() {
      this.$router.push({
        name: 'QualityAdd'
      })
    },
    addItemProject() {
      this.$router.push({
        name: 'ProjectAdd'
      })
    },
    addItemWork() {
      this.$router.push({
        name: 'WorkAdd'
      })
    },
    //修改
    toUpdate(row) {
      console.log(row)
      //工程质量通知
      if (row.type === 1) {
        this.$router.push({
          name: 'QualityEdit',
          query: { id: row.qualityProblemId, status: row.status }
        })
      } else if (row.type === 2) {
        //工程业务联系单
        this.$router.push({
          name: 'ProjectEdit',
          query: { id: row.qualityProblemId, status: row.status }
        })
      } else if (row.type === 3) {
        //工作业务联系
        this.$router.push({
          name: 'WorkEdit',
          query: { id: row.qualityProblemId, status: row.status }
        })
      }
    },
    //详情
    toDetail(row) {
      this.$router.push({
        name: 'ProblemDetail',
        query: { id: row.qualityProblemId, type: row.type }
      })
      //工程质量通知
      // if (row.type === 1) {
      //   this.$router.push({
      //     name: 'QualityDetail',
      //     query: { id: row.qualityProblemId }
      //   })
      // } else if (row.type === 2) {
      //   //工程业务联系单
      //   this.$router.push({
      //     name: 'ProjectDetail',
      //     query: { id: row.qualityProblemId }
      //   })
      // } else if (row.type === 3) {
      //   //工作业务联系
      //   this.$router.push({
      //     name: 'WorkDetail',
      //     query: { id: row.qualityProblemId }
      //   })
      // }
    },
    //刷新数据
    refresh() {
      this.$refs.table.refresh()
    },
    //重置搜索
    reset() {
      this.$refs.table.reset()
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
        await Api.getQualityProblemDelete([row.qualityProblemId])
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
