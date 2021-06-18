<template>
  <el-dialog :title="(form.id ? '编辑' : '新增') + '巡更小组'" :visible="visible" width="500px" @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="小组名称" prop="groupName">
        <el-input v-model="form.groupName" placeholder="请输入小组名称" />
      </el-form-item>
      <el-form-item label="选择组长" prop="groupLeaderId">
        <SelectUser
          :id.sync="form.groupLeaderId"
          :mobile.sync="groupLeaderMobile"
          :value="
            form.patrolGroupId
              ? {
                  id: form.groupLeaderId,
                  label: form.groupLeaderName
                }
              : null
          "
          :multiple="false"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item v-if="groupLeaderMobile" label="手机号">
        {{ groupLeaderMobile }}
      </el-form-item>
      <el-form-item label="选择组员" prop="groupMemberId">
        <SelectUser
          :id.sync="form.groupMemberId"
          :value="form.groupMemberId ? form.groupMemberId.split(',').map(id => ({ id })) : []"
        />
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="handleEnter">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Api from '../api'
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
      groupLeaderMobile: '',
      form: {
        patrolGroupId: '',
        groupName: '',
        groupLeaderId: undefined,
        groupLeaderName: '',
        groupMemberId: undefined
      },
      rules: {
        groupName: [{ required: true, message: '必填' }],
        groupLeaderId: [{ required: true, message: '必选' }],
        groupMemberId: [{ required: true, message: '必选' }]
      },
      btnLoading: false
    }
  },
  mounted() {
    if (this.item.id) {
      this.form = _.cloneDeep(this.item)
      this.groupLeaderMobile = this.form.groupLeaderPhone
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
          let groupLeaderId = this.form.groupLeaderId
          let groupMemberId = this.form.groupMemberId
          if (groupMemberId.indexOf(groupLeaderId) !== -1) {
            this.$message.error('组员不能与组长重复，请重新选择')
            return
          }
          let params = {
            patrolGroupId: this.form.patrolGroupId ? this.form.patrolGroupId : '',
            groupName: this.form.groupName,
            groupLeaderId: groupLeaderId,
            groupMemberId: groupMemberId
          }
          this.btnLoading = true
          if (params.patrolGroupId) {
            // 修改
            Api.updatePatrolGroup(params).then(
              res => {
                this.$message.success('操作成功')
                this.btnLoading = false
                this.handleCancel()
                this.$emit('refresh')
              },
              err => {
                this.btnLoading = false
              }
            )
          } else {
            // 新增
            Api.addPatrolGroup(params).then(
              res => {
                this.$message.success('操作成功')
                this.btnLoading = false
                this.handleCancel()
                this.$emit('refresh')
              },
              err => {
                this.btnLoading = false
              }
            )
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
