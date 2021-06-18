<template>
  <el-dialog :close-on-click-modal="false" title="新建" width="550px" :visible="visible" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="参与方性质" prop="participantsNatures">
        <SelectArg
          v-model="participant.dataUnicode"
          disabled
          style="width: 100%"
          :arg-group="`${projectType}_participantType`"
        ></SelectArg>
      </el-form-item>
      <el-form-item
        :label="$getLabelFromArg(`${projectType}_participantType`, participant.dataUnicode)"
        prop="selectCompanyId"
      >
        <el-select v-model="form.selectCompanyId" style="width: 100%">
          <el-option
            v-for="item in computedCompanyList"
            :key="item.companyId"
            :value="item.companyId"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责人手机号" prop="directorPhone">
        <el-input v-model="form.directorPhone" :disabled="!form.selectCompanyId"></el-input>
      </el-form-item>
      <el-form-item label="负责人姓名" prop="directorName">
        <el-input
          v-model="form.directorName"
          :disabled="!form.selectCompanyId || isMobileMatchedUser || !isMobileValid"
        ></el-input>
      </el-form-item>
      <el-form-item label="负责人角色" prop="directorRoleId">
        <el-select v-model="form.directorRoleId" style="width: 100%" placeholder="请选择">
          <el-option-group v-for="group in roleGroup" :key="group.name" :label="group.name">
            <el-option v-for="item in group.children" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button v-promise-btn type="primary" @click="submit">创建</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { projectApi } from '../../api/project'
import companyApi from '../../../company/api/company'
import toTree from '@/utils/toTree'
import anyRule from '@/lib/anyRule'
import anyRules from '@/lib/anyRule'

export default {
  name: 'AddCompany',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    participant: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    // 这里存放数据
    return {
      companyList: [],
      roleGroup: [],
      form: {
        selectCompanyId: null,
        directorPhone: null,
        directorName: null,
        directorRoleId: null
      },
      isMobileValid: false,
      isMobileMatchedUser: false,
      rules: {
        selectCompanyId: [{ required: true, message: '必填' }],
        directorName: [
          { required: true, message: '必填' },
          { pattern: anyRules.realName, message: '真实姓名格式不对' }
        ],
        directorPhone: [
          { required: true, message: '必填' },
          { pattern: anyRule.mobile, message: '请输入合法的手机号' }
        ],
        directorRoleId: [{ required: true, message: '必填' }]
      }
    }
  },
  computed: {
    computedCompanyList() {
      return this.companyList.filter(item => !this.existsParticipantCompanyIds.includes(item.companyId))
    },
    // 当前参与方性质下已经存在的公司
    existsParticipantCompanyIds() {
      return (this.participant.children || []).map(item => item.dataUnicode)
    },
    projectType() {
      return this.$store.state.project.projectType
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getCompanyList()
        this.getRoleTree()
      }
    },
    'form.directorPhone'(val) {
      if (anyRule.mobile.test(val)) {
        this.isMobileValid = true
        projectApi.queryUserByPhone(this.form.selectCompanyId, val).then(res => {
          if (res.data) {
            this.isMobileMatchedUser = true
            this.form.directorName = res.data.realName
          } else {
            this.isMobileMatchedUser = false
            this.form.directorName = null
          }
        })
      } else {
        this.isMobileValid = false
      }
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    getCompanyList() {
      companyApi.getCompanyListAll({}).then(res => {
        this.companyList = res.data
      })
    },
    getRoleTree() {
      projectApi.queryListAllProjectRole({}).then(res => {
        this.roleGroup = toTree(res.data, 'parentId').filter(e => e.directorFlag !== 1)
      })
    },
    //提交表单
    async submit() {
      await this.$refs.form.validate()
      await projectApi.addParticipants({ ...this.form, parentId: this.participant.id })
      await this.close()
      this.$emit('change')
      this.$message.success('添加成功')
    },
    //关闭弹窗
    close() {
      this.$refs.form.resetFields()
      this.isMobileMatchedUser = false
      this.isMobileValid = false
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
</style>
