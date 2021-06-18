<template>
  <div class="is-Footer white">
    <div class="content">
      <div class="infoWrapper">
        <h4 class="title">{{ name }}</h4>
        <el-row class="rowLine">
          <el-col :span="16">
            <WorkFlow
              v-if="companyList.length > 0"
              ref="workFlowRef"
              :urlSuffix="$urlSuffix"
              :token="token"
              :flag="config.flag"
              :viewFormData="viewFormData"
              :formId="id"
              :projectType="projectType"
              :projectTypeList="projectTypeList"
              :hasProcess="false"
              :hasForm="true"
              :companyList="companyList"
              :projectId="projectId"
              :configApi="configApi"
              @close="changeWorkFork"
              @change="changeWorkFork"
            />
          </el-col>
        </el-row>
      </div>
    </div>
    <CommonCheckFlow :id="id" ref="checkCard"></CommonCheckFlow>
    <div class="footer-btn">
      <el-button v-if="processDetails.flag === 1 && isCheck" v-promise-btn type="primary" @click="handleAudit"
        >审核</el-button
      >
      <el-button @click="cancelEvent">返回</el-button>
    </div>
  </div>
</template>

<script>
let urlSuffix = process.env.VUE_APP_BASE_API
import Api from '../api'
export default {
  name: 'ProjectOACustomFormDetail',
  data() {
    return {
      config: {
        flag: 1
      },
      addFormData: false,
      viewFormData: true,
      id: this.$route.query.id || '',
      projectId: this.$store.state.project.projectId,
      isCheck: this.$route.query.isCheck || false,
      name: this.$route.query.name,
      projectTypeList: this.$getArgList('projectType'),
      formType: this.$route.query.formType,
      configApi: {
        getFormDetails: `/cim6d-process${urlSuffix}/oa/form/data/get/` // 获取表单详情
      },
      processDetails: {}
    }
  },
  computed: {
    companyId() {
      return this.$store.getters.companyId
    },
    token() {
      return this.$store.state.user.token
    },
    projectType() {
      return this.$store.state.project.projectType
    },
    companyList() {
      return this.$store.state.userPower.organizationTree
    }
  },
  created() {
    this.getFormProcess()
    // this.$router.currentRoute.meta.title = `${this.name}详情`
  },
  methods: {
    // 获取审批数据
    async getFormProcess() {
      if (!this.id) {
        return
      }
      let result = await Api.getFormProcess(this.id)
      let datas = result.data
      if (!datas) {
        return
      }
      this.processDetails = datas
    },
    // 取消
    cancelEvent() {
      this.$router.go(-1)
    },
    // 操作成功
    changeWorkFork() {
      this.cancelEvent()
    },
    //提交审核
    handleAudit() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  margin: 10px;
}
</style>
