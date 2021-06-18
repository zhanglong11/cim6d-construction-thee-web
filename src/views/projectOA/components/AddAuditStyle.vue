<template>
  <el-dialog
    :title="id ? '修改' : '新建'"
    width="1600px"
    top="10px"
    :visible="visible"
    :close-on-click-modal="false"
    @close="$emit('update:visible', false)"
  >
    <div class="body-container">
      <WorkFlow
        ref="workFlowRef"
        :urlSuffix="$urlSuffix"
        :token="token"
        :hasBasic="false"
        :hasProcess="false"
        :isFlagDelete="false"
        isAdminFlag
        isApprover
        :flag="config.flag"
        :styleId="id"
      >
        <div slot="header" class="work-header">
          <el-form ref="formRef" inline :model="form" :rules="formRules">
            <el-form-item label="审批样式名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入审批样式名称" style="width: 300px"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer"></div>
      </WorkFlow>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button v-promise-btn type="primary" @click="handleSubmit(1)">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import formMakingConfig from '@/views/company/form/config/form-making-config'
import Api from '../api'
export default {
  name: 'AddAuditStyle',
  components: {},
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
      config: {
        flag: 2
      },
      form: {
        id: this.id || '',
        name: '',
        template: '',
        type: 1
      },
      formRules: {
        name: [{ required: true, message: '名称必填', trigger: 'blur' }],
        template: [{ required: true, message: '模板不能为空' }]
      }
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token
    }
  },
  created() {
    if (this.id) {
      this.getAuditStyleDyId()
    }
  },
  methods: {
    async getAuditStyleDyId() {
      let res = await Api.getAuditStyleDetail(this.id)
      this.form = res.data
    },
    async handleSubmit(type) {
      await this.$refs['formRef'].validate()
      this.$refs['workFlowRef'].getFormData((formData, subFormData) => {
        console.log(333, formData, subFormData)
        this.form.template = subFormData.template
        if (!this.form.template) {
          this.$message.error('表单内容不能为空')
          return false
        }

        if (!_.map(formData.formData.list, 'el').includes('flag')) {
          this.$message({
            type: 'error',
            message: '表单内容缺少审批结果!'
          })
          return
        }
        this.$emit('submit', { ...this.form, type })
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .approver-main {
  .container {
    .fm2-main {
      min-height: 600px;
    }
  }
}
</style>
