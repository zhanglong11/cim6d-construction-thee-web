<template>
  <div class="work-flow">
    <WorkFlow
      ref="workFlowRef"
      :urlSuffix="$urlSuffix"
      :token="token"
      :flag="config.flag"
      :formId="id"
      :isCopy="isCopy"
      :projectType="projectType"
      :projectTypeList="projectTypeList"
      :hasProcess="hasProcess"
      :companyList="companyList"
      :projectId="projectId"
      :formType="formType"
      :basicSetting="config.basicSetting"
      @close="changeWorkFork"
      @change="changeWorkFork"
    />
  </div>
</template>

<script>
import Api from '../api'
export default {
  name: 'ProjectOACustomFormAdd',
  // 这里存放数据
  data() {
    return {
      config: {
        flag: 1,
        basicSetting: {
          powerKey: 'FormMange',
          pcRouteUrl: 'ProjectOACustomFormDetail',
          appRouteUrl: '/pages/projectOA/customFormDetail'
        }
      },
      formData: {
        id: '',
        name: '',
        template: '',
        type: 1
      },
      formType: this.$route.query.formType,
      hasProcess: true,
      id: '',
      projectId: this.$store.state.project.projectId,
      isCopy: this.$route.query.isCopy === true || this.$route.query.isCopy === 'true',
      projectTypeList: this.$getArgList('projectType'),
      btnSaveLoading: false
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
  // 生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    this.id = this.$route.query.id
  },
  // 方法集合
  methods: {
    // 取消
    cancelEvent() {
      this.$router.go(-1)
    },
    // 操作成功
    changeWorkFork() {
      this.cancelEvent()
    }
  }
}
</script>

<style lang="less" scoped>
.work-flow {
  display: flex;
  height: calc(100vh - 90px);
  /deep/.approver-main {
    flex: 1;
  }
}
</style>
