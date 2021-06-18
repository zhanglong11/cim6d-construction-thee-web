<template>
  <el-dialog
    :title="(item.patrolPointName ? '编辑' : '新增') + '巡更点'"
    :visible="visible"
    width="600px"
    @close="handleCancel"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="巡更点名称" prop="patrolPointName">
        <el-input v-model="form.patrolPointName" placeholder="请输入巡更点名称" />
      </el-form-item>
      <el-form-item label="绑定类型" prop="bindType">
        <el-radio-group v-model="form.bindType">
          <el-radio :label="1">巡更设备</el-radio>
          <el-radio :label="2">巡更二维码</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.bindType === 1" label="选择巡更设备" prop="deviceId">
        <el-select v-model="form.deviceId">
          <el-option
            v-for="(deviceItem, index) in deviceList"
            :key="index"
            :label="deviceItem.label"
            :value="deviceItem.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.bindType === 2" label="选择巡更二维码" prop="deviceId">
        <el-select v-model="form.deviceId">
          <el-option
            v-for="(deviceItem, index) in codeList"
            :key="index"
            :label="deviceItem.label"
            :value="deviceItem.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleEnter">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import deviceList from './lib/deviceList' // 巡更设备假数据
import codeList from './lib/codeList' // 巡更二维码假数据
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      deviceList,
      codeList,
      form: {
        patrolPointName: '',
        bindType: 1,
        deviceId: undefined
      },
      rules: {
        patrolPointName: [{ required: true, message: '必填' }],
        bindType: [{ required: true, message: '必选' }],
        deviceId: [{ required: true, message: '必选' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.form?.resetFields()
          if (this.item.patrolPointName) {
            this.form = _.cloneDeep(this.item)
          }
        })
      }
    }
  },
  methods: {
    // 取消
    handleCancel() {
      this.$emit('update:visible', false)
    },
    // 确定
    handleEnter() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.handleCancel()
          this.$emit('operationSuccess', _.cloneDeep(this.form))
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
