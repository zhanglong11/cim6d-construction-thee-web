<template>
  <el-dialog
    :title="id ? '编辑' : '新建' + '安全帽'"
    :visible="visible"
    width="600px"
    :close-on-click-modal="false"
    @close="handleCancel"
  >
    <el-form ref="form" :model="form" :rules="formRules" label-width="140px">
      <el-form-item label="设备编号:" prop="deviceNum">
        <el-input v-model="form.deviceNum" placeholder="请输入" />
      </el-form-item>
      <!-- <el-form-item label="用户ID:" prop="">
        <el-input placeholder="请输入" disabled />
      </el-form-item> -->
      <el-form-item label="人员类型" prop="staffType">
        <el-radio-group v-model="form.staffType" @change="changeHandler">
          <el-radio label="1" :value="1">管理人员</el-radio>
          <el-radio label="2" :value="2">劳务人员</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择人员:" prop="staffId">
        <span v-if="staffType === '1'">
          <SelectUser
            :id.sync="form.staffId"
            v-model="form.staffId"
            value-format="id"
            :multiple="false"
            :name.sync="form.staffName"
            placeholder="请选择"
            @update:mobile="handmobile"
          ></SelectUser>
        </span>
        <span v-else-if="staffType === '2'">
          <SelectLabourWorker
            :id.sync="form.staffId"
            v-model="form.staffId"
            value-format="id"
            :multiple="false"
            :name.sync="form.staffName"
            @update:mobile="handmobile"
          />
        </span>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="上传附件" prop="fileId">
        <FileEdit v-model="form.fileId" />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="btnSaveLoading" @click="handleSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api/index'
import norm from '../lib/norm'
import SelectLabourWorker from '@/components/SelectLabourWorker'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'AddAcceptanceDialog',
  components: {
    SelectLabourWorker
  },
  props: {
    visible: Boolean,
    id: String
  },
  // 这里存放数据
  data() {
    return {
      norm,
      form: {
        staffType: '1',
        projectId: localStorage.getItem('projectId')
      },
      staffType: '1',
      formRules: {
        deviceNum: [{ required: true, message: '必填' }],
        staffId: [{ required: true, message: '必填' }],
        category: [{ required: true, message: '必选' }]
      },
      btnSaveLoading: false
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    if (this.id) {
      this.getSafeCapDeviceDetail()
    }
  },
  // 方法集合
  methods: {
    handmobile(val) {
      this.form.mobile = val
    },
    // 取消
    handleCancel() {
      this.$emit('update:visible', false)
    },
    // 确定
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnSaveLoading = true
          if (this.id) {
            Api.getSafeCapDeviceUpdate(this.form)
              .then(res => {
                this.$message.success('编辑成功')
                this.$emit('update:visible', false)
                this.$emit('refresh')
              })
              .finally(() => {
                this.btnSaveLoading = false
              })
          } else {
            Api.getSafeCapDeviceAdd(this.form)
              .then(res => {
                this.$message.success('添加成功')
                this.$emit('update:visible', false)
                this.$emit('refresh')
              })
              .finally(() => {
                this.btnSaveLoading = false
              })
          }
        }
      })
    },
    changeHandler(value) {
      if (this.staffType === value) {
        this.staffType = value
      } else {
        this.staffType = value
        this.form.staffId = null
      }
    },
    // 获取验收规范详情
    getSafeCapDeviceDetail() {
      Api.getSafeCapDeviceDetail(this.id).then(res => {
        this.form = res.data
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
