<template>
  <el-dialog
    :title="id ? '修改' : '新建'"
    width="800px"
    top="10vh"
    :visible="visible"
    @close="$emit('update:visible', false)"
  >
    <div class="body-container">
      <el-form ref="form" label-width="150px" :model="form" :rules="formRules">
        <!-- <el-form-item label="检查计划编号" prop="keyword">
          <el-input v-model="form.code" placeholder="编号" class="from-item"> </el-input>
        </el-form-item>-->
        <el-form-item label="计划起止时间" prop="planDate">
          <el-date-picker
            v-model="form.planDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 400px"
            @change="handlePickerChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检查要求">
          <el-input v-model.trim="form.inspectRequirements" class="from-item" placeholder="请输入检查要求"> </el-input>
        </el-form-item>
        <el-form-item label="检查周期" prop="inspectDuration">
          <el-input v-model="form.inspectDuration" disabled class="from-item" placeholder="请选择检查周期"> </el-input>
        </el-form-item>
        <el-form-item label="检查日期" prop="inspectTimeArr">
          <el-date-picker
            v-model="form.inspectTimeArr"
            value-format="yyyy-MM-dd"
            class="from-item"
            type="dates"
            placeholder="选择一个或多个日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检查人" prop="inspectPrincipal">
          <SelectUser
            v-model="form.inspectPrincipal"
            valueFormat="id"
            :multiple="false"
            append-to-body
            class="from-item"
          ></SelectUser>
        </el-form-item>
        <el-form-item label="附件" prop="fileId">
          <Upload v-model="form.fileId" isOnlyButton multiple class="from-item"></Upload>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button v-promise-btn type="primary" @click="handleSave(true)">保 存</el-button>
      <el-button v-promise-btn type="primary" @click="handleSave(false)">保存并启用</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api'
export default {
  name: 'AddPlanModal',
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
      form: { planDate: [], inspectTimeArr: [] },
      formRules: {
        planDate: [{ required: true, message: '计划起始日期不能为空', trigger: 'change' }],
        inspectDuration: [{ required: true, message: '周期不能为空', trigger: 'blur' }],
        inspectTimeArr: [{ required: true, message: '检查日期不能为空', trigger: 'change' }],
        inspectPrincipal: [{ required: true, message: '检查人不能为空', trigger: 'change' }]
      },
      pickerOptions: { disabledDate: null }
    }
  },
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    //时间范围改变
    handlePickerChange(n, clearArr = true) {
      if (!n) {
        this.form.inspectDuration = 0
        this.form.planDate = []
      }
      if (n && n.length && n.length > 0) {
        this.form.planStartTime = this.moment(n[0]).format('YYYY-MM-DD 00:00:00')
        this.form.planEndTime = this.moment(n[1]).format('YYYY-MM-DD 23:59:59')
        this.form.inspectDuration = this.moment(n[1]).diff(n[0], 'days')
      }
      this.pickerOptions = { disabledDate: this.dateRange }
      if (clearArr) {
        this.form.inspectTimeArr = []
      }
    },
    //获取详情
    async getDetail() {
      let res = await Api.getPlanDetail(this.id)
      this.form = {
        ...res.data,
        planDate: [res.data.planStartTime, res.data.planEndTime],
        inspectTimeArr: res.data.inspectTime.split(',')
      }
      this.handlePickerChange(this.form.planDate, false)
    },
    //检查日期范围确定
    dateRange(e) {
      if (!this.form.planDate) {
        return true
      }
      if (this.form.planDate && this.form.planDate.length === 0) {
        return true
      } else {
        return !this.moment(e).isBetween(
          this.moment(this.form.planDate[0]),
          this.moment(this.form.planDate[1]),
          'day',
          '[]'
        )
      }
    },
    //点击确定
    async handleSave(isSave = true) {
      await this.$refs['form'].validate()
      let data = { ...this.form, inspectTime: this.form.inspectTimeArr.join(',') }
      delete data.inspectTimeArr
      delete data.planDate
      this.$emit('submit', isSave, data)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
</style>
