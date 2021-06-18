<template>
  <el-dialog :title="(form.id ? '编辑' : '新增') + '巡更计划'" :visible="visible" width="540px" @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="巡更时间" prop="date">
        <el-date-picker
          v-model="form.date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          style="width: 100%"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="巡更路线" prop="patrolRouteId">
        <el-select v-model="form.patrolRouteId" style="width: 100%">
          <el-option
            v-for="(pathItem, index) in patrolPathList"
            :key="index"
            :label="pathItem.routeName"
            :value="pathItem.patrolRouteId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="巡更小组" prop="patrolGroupId">
        <el-select v-model="form.patrolGroupId" style="width: 100%">
          <el-option
            v-for="(pathItem, index) in patrolGroupList"
            :key="index"
            :label="pathItem.groupName"
            :value="pathItem.patrolGroupId"
          />
        </el-select>
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
    },
    patrolPathList: {
      type: Array,
      default: () => []
    },
    patrolGroupList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        patrolId: '',
        date: undefined,
        patrolRouteId: undefined,
        patrolGroupId: undefined
      },
      rules: {
        date: [{ required: true, message: '必选' }],
        patrolRouteId: [{ required: true, message: '必选' }],
        patrolGroupId: [{ required: true, message: '必选' }]
      },
      btnLoading: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.form?.resetFields()
          if (this.item.id) {
            let newItem = _.cloneDeep(this.item)
            this.form = newItem
            this.form.date = [newItem.patrolStartTime, newItem.patrolEndTime]
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
          let params = {
            patrolId: this.form.patrolId,
            patrolEndTime: this.form.date[1],
            patrolGroupId: this.form.patrolGroupId,
            patrolRouteId: this.form.patrolRouteId,
            patrolStartTime: this.form.date[0]
          }
          // console.log(params)
          this.btnLoading = true
          if (params.patrolId) {
            // 修改
            Api.updatePatrolPlan(params).then(
              res => {
                this.$message.success('操作成功')
                this.handleCancel()
                this.$emit('refresh')
                this.btnLoading = false
              },
              err => {
                this.btnLoading = false
              }
            )
          } else {
            // 新增
            Api.addPatrolPlan(params).then(
              res => {
                this.$message.success('操作成功')
                this.handleCancel()
                this.$emit('refresh')
                this.btnLoading = false
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
