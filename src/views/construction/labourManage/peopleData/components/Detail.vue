<template>
  <div>
    <el-dialog
      class="beauty"
      title="查看详情"
      :visible="visible"
      width="620px"
      :close-on-click-modal="false"
      @close="close"
    >
      <div class="desc">
        <el-row :gutter="4">
          <el-col :span="24" style="text-align: center">
            <div class="avatar-wrap">
              <el-avatar :key="form.headImage" :size="85" :src="form.headImage" />
              <!-- <i id="pick-avatar" class="el-icon-edit-outline" /> -->
            </div>
            <avatar-cropper
              trigger="#pick-avatar"
              :upload-headers="{ 'x-access-token': $store.state.user.token }"
              :upload-url="axios.file.defaults.baseURL + '/file/commonFile/uploadImage'"
              :output-options="{ width: 200, height: 200 }"
              @uploaded="res => (form.headImage = res.data)"
            />
          </el-col>
          <el-col :span="12">
            <span class="desc-label">姓名:</span>
            <span>{{ form.name }}</span>
          </el-col>
          <el-col :span="12">
            <span class="desc-label">卡号:</span>
            <span>{{ form.cardNumber }}</span>
          </el-col>
          <el-col :span="12">
            <span class="desc-label">性别:</span>
            <span>{{ ['男', '女'][form.gender - 1] }}</span>
          </el-col>
          <el-col :span="12">
            <span class="desc-label">手机号码:</span>
            <span>{{ form.mobile }}</span>
          </el-col>
          <el-col :span="12">
            <span class="desc-label">身份证号:</span>
            <span>{{ form.idCardNum }}</span>
          </el-col>

          <el-col :span="12">
            <span class="desc-label">紧急联系人电话:</span>
            <span>{{ form.emergencyContactMobile }}</span>
          </el-col>
          <el-col :span="12">
            <span class="desc-label">紧急联系人:</span>
            <span>{{ form.emergencyContactor }}</span>
          </el-col>
          <el-col :span="12">
            <span class="desc-label">工种:</span>
            <span>{{ $getLabelFromArg('workType', form.workType) }}</span>
          </el-col>
          <el-col :span="12">
            <span class="desc-label">在职状态:</span>
            <span>{{ ['在职', '离职'][form.jobStatus - 1] }}</span>
          </el-col>
          <el-col :span="12">
            <span class="desc-label">用工性质:</span>
            <span>{{ $getLabelFromArg('workerProperty', form.staffKind) }}</span>
          </el-col>
          <el-col :span="24">
            <span class="desc-label">所属劳务公司及班组:</span>
            <span>{{ form.labourCompanyName + '-' + form.groupName }}</span>
          </el-col>
          <el-col :span="24">
            <span class="desc-label">备注:</span>
            <span>{{ form.remark }}</span>
          </el-col>
        </el-row>
      </div>
      <footer slot="footer">
        <el-button type="primary" @click="close">取消</el-button>
      </footer>
    </el-dialog>
  </div>
</template>
<script>
import AvatarCropper from 'vue-avatar-cropper'
import api from '../../api/labour-api'
export default {
  name: 'MyDetail',
  components: {},
  props: {
    // 弹窗是否显示
    visible: {
      default: false,
      type: Boolean
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      // 表单数据
      form: {}
    }
  },
  watch: {
    async visible(val) {
      if (val) {
        if (this.id) {
          this.form = await api.getLabourEmployeeDetail(this.id).then(res => res.data)
        } else {
          this.form = {}
        }
      }
    }
  },
  methods: {
    // 关闭弹窗
    close() {
      this.$emit('update:visible', false)
    },
    refresh() {}
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
.el-col {
  margin-bottom: 25px;
  font-size: 16px;
}
.desc-label {
  margin-right: 10px;
}
</style>
