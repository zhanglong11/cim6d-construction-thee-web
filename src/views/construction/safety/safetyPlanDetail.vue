<template>
  <div class="detail-container">
    <el-card class="box-card" shadow="never" style="margin: 10px">
      <div slot="header" class="clearfix">
        <span>安全检查计划详情</span>
        <el-button style="float: right; padding: 3px 0" type="text"></el-button>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="检查计划编号" :value="info.planNum"></DetailItem>
          </el-col>
          <el-col :span="12">
            <DetailItem label="计划起止时间"> {{ info.planStartTime | ymd }}~{{ info.planEndTime | ymd }} </DetailItem>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="检查要求" :value="info.inspectRequirements"></DetailItem>
          </el-col>
          <el-col :span="12">
            <DetailItem label="检查周期(天)" :value="info.inspectDuration"></DetailItem>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="检查日期" :value="info.inspectTime"></DetailItem>
          </el-col>
          <el-col :span="12">
            <DetailItem label="检查人" :value="info.inspectPrincipalName"></DetailItem>
          </el-col>
        </el-row>
        <!--附件-->
        <el-row :gutter="20">
          <el-col :span="12">
            <DetailItem label="附件"><FileTable :ids="info.fileId"></FileTable></DetailItem>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="12">
            <DetailItem label="创建人" :value="info.creatorName"></DetailItem>
          </el-col>
          <el-col :span="12">
            <DetailItem label="创建日期" :value="info.createTime"></DetailItem>
          </el-col>
        </el-row>
        <el-card class="box-card" shadow="never" style="margin: 10px">
          <div slot="header" class="clearfix">
            <span>检查执行概况</span>
            <el-button style="float: right; padding: 3px 0" type="text"></el-button>
          </div>
          <el-table :data="info.implementationList">
            <el-table-column type="index" width="50" label="序号"> </el-table-column>
            <el-table-column
              prop="inspectDate"
              label="检查日期"
              width="180"
              :formatter="(row, column, cellValue) => moment(cellValue).format('YYYY-MM-DD')"
            >
            </el-table-column>
            <el-table-column prop="inspectTime" label="实际检查时间" width="180"> </el-table-column>
            <el-table-column prop="problemNum" label="发现问题（条）" width="180"> </el-table-column>
            <el-table-column prop="address" label="整改完成度" width="150">
              <template slot-scope="scope">
                {{ scope.row.rectifyFinishNum ? `${scope.row.rectifyFinishNum}/${scope.row.problemNum}` : '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="text" @click="getIssueData(scope.row.implementationId)">查看</el-button>
                <el-button
                  v-if="isChecker && !scope.row.inspectTime"
                  type="text"
                  @click="handleCheckClick(scope.row.implementationId)"
                >
                  检查
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px">
            <!--点击查看 start-->
            <RectifyTable
              append-to-body
              :visible.sync="rectifyTableDetailVisible"
              :tableData="issueData"
            ></RectifyTable>
            <!--点击查看 end-->
            <!--点击检查 start-->
            <IssueDesc
              v-if="rectifyAddTableDetailVisible"
              ref="desc"
              :visible.sync="rectifyAddTableDetailVisible"
              :tableData="[]"
              appendToBody
              :inspectType="2"
              @submit="handleRectifySubmit"
            ></IssueDesc>
            <!--点击检查 end-->
          </div>
        </el-card>
      </div>
    </el-card>
    <div class="footer-btn">
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from './api'
import DetailItem from '@/views/construction/quality/components/detailItem'
import FileTable from '@/views/construction/quality/components/fileTable' //附件
import IssueDesc from '@/views/construction/quality/components/issueDesc' //问题描述
import RectifyTable from '@/views/construction/quality/components/rectifyTable' //点击查看弹窗
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'SafetyPlanDetail',
  components: { DetailItem, FileTable, IssueDesc, RectifyTable },
  data() {
    // 这里存放数据
    return {
      projectId: localStorage.getItem('projectId'),
      id: this.$route.query.id || '',
      isChecker: this.$route.query.isChecker === 'true',
      info: {
        implementationList: []
      },
      rectifyTableDetailVisible: false, //点击检查执行情况查看弹窗
      issueData: [], //问题列表
      selectImplementationId: '', //要检查的检查执行情况id
      rectifyAddTableDetailVisible: false, //点击检查弹窗
      rectifyAddTableData: [] //点击检查时的列表//问题列表
    }
  },
  computed: {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  created() {
    this.getDetail()
  },
  // 方法集合
  methods: {
    //获取详情
    async getDetail() {
      let res = await Api.getPlanDetail(this.id)
      this.info = res.data
    },
    //获取问题详细列表
    async getIssueData(id) {
      let res = await Api.getIssueListByInspectId(id)
      this.issueData = res.data
      this.rectifyTableDetailVisible = true // 点击检查执行情况查看弹窗
    },
    //检查
    async handleCheckClick(id) {
      this.selectImplementationId = id
      //let res = await Api.getIssueListByInspectId(id)
      // this.rectifyAddTableData = res.data
      this.rectifyAddTableDetailVisible = true
    },
    //检查表格提交事件
    async handleRectifySubmit(data) {
      await Api.addIssueInspectList({ ...data, id: this.selectImplementationId })
      this.rectifyAddTableDetailVisible = false
      await this.getDetail()
    },
    //返回
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
