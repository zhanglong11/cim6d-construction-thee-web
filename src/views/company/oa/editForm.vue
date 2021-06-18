<template>
  <WorkFlow
    ref="workFlowRef"
    :urlSuffix="$urlSuffix"
    :token="token"
    :flag="config.flag"
    isCompanyFlag
    :isCopy="isCopy"
    :formId="id"
    :projectType="projectType"
    :projectTypeList="projectTypeList"
    :hasProcess="hasProcess"
    :formType="formType"
    :companyList="companyList"
    :userType="2"
    :basicSetting="config.basicSetting"
    @close="changeWorkFork"
    @change="changeWorkFork"
  />
</template>

<script>
import { OaApi } from './api'
export default {
  name: 'AddFormStyle',
  data() {
    return {
      config: {
        flag: 1,
        projectType: '',
        basicSetting: {
          powerKey: 'FormMange',
          pcRouteUrl: 'ProjectOACustomFormDetail',
          appRouteUrl: '/pages/projectOA/customFormDetail'
        }
      },
      formType: this.$route.query.formType,
      hasProcess: true,
      id: this.$route.query.id || '',
      isCopy: this.$route.query.isCopy,
      projectTypeList: this.$getArgList('projectType'),
      formData: {
        id: '',
        name: '',
        template: '',
        type: 1
      },
      formDataRules: {
        name: [
          {
            required: true,
            message: '请输入审批样式名称',
            trigger: 'blur'
          }
        ]
      },
      btnLoading: false,
      companyList: []
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token
    },
    projectType() {
      return this.$store.state.project.projectType
    }
  },
  mounted() {
    this.queryOrganizationTree()
  },
  methods: {
    // 企业组织架构树
    async queryOrganizationTree() {
      let result = await OaApi.queryOrganizationTree({})
      let datas = result.data || []
      const formatArray = array => {
        array.map(e => {
          e.name = e.dataName
          e.type = e.organType
          e.targetId = e.dataUnicode
          e.label = e.dataName
          e.value = e.dataUnicode
          if (e.children) {
            formatArray(e.children)
          }
        })
      }
      formatArray(datas)
      this.companyList = datas
      console.log('企业组织架构树', datas)
    },
    // 取消
    cancelEvent() {
      this.$router.push({
        name: 'CompanyOa',
        query: {
          type: 'form'
        }
      })
    },
    // 操作成功
    changeWorkFork() {
      this.cancelEvent()
    }
  }
}
</script>
