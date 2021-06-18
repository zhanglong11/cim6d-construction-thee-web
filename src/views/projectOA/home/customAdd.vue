<template>
  <div class="is-Footer white">
    <div class="content">
      <div class="infoWrapper">
        <h4 class="title">{{ name }}</h4>
        <el-row class="rowLine">
          <el-col :span="16">
            <WorkFlow
              ref="workFlowRef"
              :urlSuffix="$urlSuffix"
              :token="token"
              :flag="config.flag"
              :addFormData="addFormData"
              :viewFormData="viewFormData"
              :formId="id"
              :projectType="projectType"
              :projectTypeList="projectTypeList"
              :hasProcess="false"
              :hasForm="true"
              :companyList="companyList"
              :projectId="projectId"
              @close="changeWorkFork"
              @change="changeWorkFork"
            />
          </el-col>
        </el-row>
        <div>
          <!--          <div>{{JSON.stringify(detailInfo)}}</div>-->
        </div>
      </div>
    </div>
    <div class="footer-btn">
      <el-button @click="cancelEvent">返回</el-button>
      <el-button type="primary" @click="saveSubmit()">提交</el-button>
    </div>
  </div>
</template>

<script>
import Api from '../api'
export default {
  name: 'ProjectOACustomFormAdd',
  data() {
    return {
      config: {
        flag: 1
      },
      addFormData: true,
      viewFormData: false,
      id: this.$route.query.id || '',
      projectId: this.$store.state.project.projectId,
      name: this.$route.query.name,
      projectTypeList: this.$getArgList('projectType'),
      formType: this.$route.query.formType
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
  methods: {
    async saveSubmit() {
      let formData = await this.$refs.workFlowRef.getJSON()
      console.log(1111, formData)
      await Api.getFormFillSave({ formData: formData, formName: this.name, formId: this.id }).then(res => {
        this.$message.success('保存成功')
        this.cancelEvent()
      })
    },
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
.title {
  margin: 10px;
}
</style>
