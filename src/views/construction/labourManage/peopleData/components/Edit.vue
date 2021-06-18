<template>
  <div>
    <el-dialog
      class="beauty"
      :title="form.id ? '修改人员信息' : '新增人员信息'"
      :visible="visible"
      width="800px"
      :close-on-click-modal="false"
      @close="close"
    >
      <div class="dialog-content">
        <!-- <h3 class="dia-sp">项目基本情况</h3> -->
        <el-form
          ref="form"
          :model="form"
          style="width: 650px; margin-top: 10px; margin-left: 10px"
          label-width="170px"
          :rules="rules"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="人员卡号" prop="cardNumber">
            <el-input v-model="form.cardNumber" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio v-model="form.gender" :label="1">男</el-radio>
            <el-radio v-model="form.gender" :label="2">女</el-radio>
          </el-form-item>
          <el-form-item label="身份证号" prop="idCardNum">
            <el-input v-model="form.idCardNum" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="照片" prop="headImage">
            <div class="avatar-wrap">
              <el-avatar :key="form.headImage" :size="80" :src="form.headImage" />
              <i id="pick-avatar" class="el-icon-edit-outline" />
            </div>
            <avatar-cropper
              trigger="#pick-avatar"
              :upload-headers="{ 'x-access-token': $store.state.user.token }"
              :upload-url="axios.file.defaults.baseURL + '/file/commonFile/uploadImage'"
              :output-options="{ width: 200, height: 200 }"
              @uploaded="res => $set(form, 'headImage', res.data)"
            />
          </el-form-item>
          <el-form-item label="联系电话" prop="mobile">
            <el-input v-model="form.mobile"></el-input>
          </el-form-item>
          <el-form-item label="紧急联系人" prop="emergencyContactor">
            <el-input v-model="form.emergencyContactor" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="紧急联系人电话" prop="emergencyContactMobile">
            <el-input v-model="form.emergencyContactMobile"></el-input>
          </el-form-item>
          <el-form-item label="所属劳务公司及班组" prop="labourCompanyId">
            <el-select v-model="form.labourCompanyId" placeholder="请选择公司" @change="changeSelect">
              <el-option v-for="item in selectDate1" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="form.groupId" placeholder="请选择班组" prop="groupId">
              <el-option v-for="item in selectDate2" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工种" prop="workType">
            <SelectArg v-model="form.workType" arg-group="workType"></SelectArg>
          </el-form-item>
          <el-form-item label="在职状态" prop="jobStatus">
            <el-select v-model="form.jobStatus">
              <el-option :value="1" label="在职">在职</el-option>
              <el-option :value="2" label="离职">离职</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用工性质" prop="staffKind">
            <SelectArg v-model="form.staffKind" arg-group="workerProperty"></SelectArg>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              placeholder="请输入备注信息"
              type="textarea"
              :autosize="{ minRows: 3 }"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 100%" label="合同文件" prop="labourContractFileId">
            <FileUploads
              v-model="form.labourContractFileId"
              :limit="1"
              isOnlyButton
              btnText="上传合同"
              style="width: 250px"
            ></FileUploads>
          </el-form-item>
        </el-form>
      </div>
      <footer slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="getSubmit">保存</el-button>
      </footer>
    </el-dialog>
  </div>
</template>
<script>
import AvatarCropper from 'vue-avatar-cropper'
import api from '../../api/labour-api'
import FileUploads from './File'
import ruless from '@/utils/regular'
export default {
  name: 'MyEdit',
  components: { AvatarCropper, FileUploads },
  props: {
    // 弹窗是否显示
    visible: {
      default: false,
      type: Boolean
    },
    id: {
      type: String
    },
    //公司班组下拉框数据
    selectData: {
      default() {
        return []
      },
      type: Array
    }
  },
  data() {
    return {
      // 表单数据
      form: {},
      btnLoading: false,
      tableData: [],
      //所有公司及班组
      labourCompanyId: '', //公司
      groupId: ' ', //班组
      selectDate2: [], //班组动态数据
      selectDate1: [], //公司下拉列表数据
      rules: {
        name: [{ required: true, message: '必填' }],
        cardNumber: [{ required: true, message: '必填' }],
        gender: [{ required: true, message: '必填' }],
        idCardNum: [{ required: true, message: '请输入正确身份证格式', pattern: ruless.idCardNo }],
        headImage: [{ required: true, message: '必填' }],
        mobile: [{ required: true, message: '请输入正确手机号格式', pattern: ruless.telephone }],
        emergencyContactor: [{ required: true, message: '必填' }],
        emergencyContactMobile: [{ required: true, message: '请输入正确手机号格式', pattern: ruless.telephone }],
        labourCompanyId: [{ required: true, message: '必填' }],
        workType: [{ required: true, message: '必填' }],
        jobStatus: [{ required: true, message: '必填' }],
        staffKind: [{ required: true, message: '必填' }]
      }
    }
  },
  // computed: {
  //   selectDate2() {
  //     // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  //     return (this.selectDate2 =
  //       this.selectDate1.filter(item => item.id === this.form.labourCompanyId)[0].groupList || [])
  //   }
  // },
  watch: {
    'form.labourCompanyId'(oldval, newval) {
      if (newval !== undefined) {
        this.form.groupId = ''
        this.selectDate2 = this.selectDate1.filter(item => item.id === this.form.labourCompanyId)[0].groupList || []
      }
      this.selectDate2 = this.selectDate1.filter(item => item.id === this.form.labourCompanyId)[0].groupList || []
    }
  },
  created() {
    this.selectDate1 = this.selectData
    if (this.id) {
      api.getLabourEmployeeDetail(this.id).then(res => {
        this.form = res.data || {}
        this.selectDate2 = this.selectDate1.filter(item => item.id === this.form.labourCompanyId)[0].groupList || []
      })
    }
  },
  methods: {
    // 班组数据
    changeSelect(value) {
      if (value !== '') {
        for (var item of this.selectDate1) {
          if (item.id === value) {
            this.selectDate2 = item.groupList
            this.groupId = ''
            break
          } else {
            continue
          }
        }
      } else {
        this.selectDate2 = []
        this.groupId = ''
      }
    },
    // 关闭弹窗
    close() {
      this.$emit('update:visible', false)
      //this.$refs.form.clearValidate()
    },
    //提交
    async getSubmit() {
      try {
        await this.$refs.form.validate()
        this.btnLoading = true
        if (this.form.id) {
          await api.updateLabourEmployee(this.form).then(res => {
            this.btnLoading = false
            this.$message.success('编辑成功')
            this.close()
            this.$parent.refresh()
          })
        } else {
          await api.addLabourEmployee(this.form).then(res => {
            this.btnLoading = false
            this.$message.success('新增成功')
            this.close()
            this.$parent.refresh()
          })
        }
      } catch (e) {
        this.btnLoading = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.avatar-wrap {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  #pick-avatar {
    cursor: pointer;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    height: 25px;
    color: #fff;
    text-align: center;
    line-height: 25px;
  }
}
</style>
