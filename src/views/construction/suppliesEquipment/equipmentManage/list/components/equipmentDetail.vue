<template>
  <el-dialog title="详情" width="1200px" top="10vh" :visible="visible" @close="$emit('update:visible', false)">
    <div class="body-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <DetailItem label="验收类型" :value="info.code"></DetailItem>
        </el-col>
        <el-col :span="12">
          <DetailItem label="验收名称" :value="info.code"></DetailItem>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <DetailItem label="计划验收时间" :value="info.code"></DetailItem>
        </el-col>
        <el-col :span="12">
          <DetailItem label="施工负责人" :value="info.code"></DetailItem>
        </el-col>
      </el-row>
      <!--附件-->
      <FileTable :ids="info.fileIds"></FileTable>
      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="12">
          <DetailItem label="创建人" :value="info.code"></DetailItem>
        </el-col>
        <el-col :span="12">
          <DetailItem label="创建日期" :value="info.code"></DetailItem>
        </el-col>
      </el-row>
    </div>
    <!-- 流程图 start -->
    <ViewFlow :id="id" :info="info" @setAccessoryInfo="setAccessoryInfo" />
    <!-- 流程图 end -->
    <span slot="footer" class="dialog-footer">
      <!--      <template v-if="true">-->
      <!--        <el-button @click="$emit('update:visible', false)">取 消</el-button>-->
      <!--        <el-button type="primary" @click="handleSave">保 存</el-button>-->
      <!--      </template>-->

      <el-button @click="$emit('update:visible', false)">返 回</el-button>
      <el-button v-if="isCheck" type="primary" :loading="btnApprovalLoading" @click="approval()">确定</el-button>
      <Archive
        v-if="$hasPower('qualityAcceptApplyArchive')"
        :id="id"
        name="验收申请"
        module="pigeonhole_3"
        :flag.sync="info.filedFlag"
        :file-ids="info.fileIds"
      />
    </span>
    <!-- 审批组件 start -->
    <CheckCard v-if="isCheck" :id="id" ref="checkCard"></CheckCard>
    <!-- 审批组件 end -->
  </el-dialog>
</template>

<script>
import Api from '../api'
import DetailItem from './detailItem'
import FileTable from './fileTable' //附件
export default {
  name: 'AddPlanModal',
  components: { DetailItem, FileTable },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isCheck: this.$route.params.isCheck,
      info: {
        code: 111,
        fileIds: '1,2,3',
        tableData: [
          { id: 1, name: '111' },
          { id: 2, name: '222' }
        ]
      },
      issueData: [] //问题列表
    }
  },
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    //获取详情
    async getDetail() {
      //let res = await Api.getPlanDetail(this.id)
      //this.info = res
    },
    //获取问题详细列表
    async getIssueData(id) {
      /*let res=await Api.getPlanDetail(id)
      this.issueData = res.data*/
      this.issueData = [{ id: 1, name: '11' }]
    },
    async handleSave() {
      this.$emit('update:visible', false)
    },
    setAccessoryInfo() {
      let flag = true
      let approveContent = this.detailInfo.approveContent
      for (let i = 0; i < approveContent.length; i++) {
        if (approveContent[i].tableKey === '附件') {
          flag = false
          break
        }
      }
      if (flag) {
        this.detailInfo.approveContent.push({ tableKey: '附件', tableValue: this.getAccessoryInfo() })
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-dialog__header {
  border: 1px #999 solid;
}
.body-container {
  max-height: 60vh;
  overflow: auto;
  padding: 10px 40px;
}
.from-item {
  width: 400px;
}
</style>
