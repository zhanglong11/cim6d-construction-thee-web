<template>
  <div>
    <el-dialog class="beauty" title="查看详情" :visible="visible" width="680px" @close="close">
      <div class="desc-detail">
        <el-row :gutter="4">
          <el-col :span="24">
            <span class="desc-label">工资月份:</span>
            <span>{{ form.salaryMonth }}</span>
          </el-col>
          <el-col :span="24">
            <span class="desc-label">公司名称:</span>
            <span>{{ form.labourCompanyName || '暂无' }}</span>
          </el-col>
          <el-col :span="24">
            <span class="desc-label">每月工资发放日期:</span>
            <span>{{ form.issueDate }}日</span>
          </el-col>
          <el-col :span="24">
            <span class="desc-label">劳务人员数量:</span>
            <span>{{ count }}</span>
          </el-col>
          <el-col :span="24">
            <span class="desc-label">本月已发放工资名单:</span>
            <span>{{ trueSum }}</span>
          </el-col>
          <el-col :span="24">
            <div v-if="employeeList.length != 0" style="width: 650px">
              <p
                v-for="(item, index) in employeeList"
                :key="index"
                style="
                  width: 147px;
                  border: 1px solid #000;
                  display: inline-table;
                  text-align: center;
                  margin: 0px;
                  position: relative;
                "
              >
                <span v-if="item.arrearsOfWage === 1" style="color: red" class="p-span">
                  {{ item.employeeName != null ? item.employeeName : '**' }}
                  {{ moment(item.date).format('MM月DD日') }}
                </span>
                <span v-else style="color: #000" class="p-span">
                  {{ item.employeeName != null ? item.employeeName : '**' }}
                  {{ moment(item.date).format('MM月DD日') }}
                </span>
              </p>
            </div>
            <div v-else>
              <p style="text-align: center">*暂无人员名单信息*</p>
            </div>
          </el-col>
          <el-col :span="24">
            <span class="desc-label" style="color: red">本月未发放工资名单:</span>
            <span style="color: red">{{ badeSum }}</span>
          </el-col>
          <el-col :span="24">
            <div v-if="noEmployeeList.length != 0" style="width: 650px">
              <p
                v-for="(item, index) in noEmployeeList"
                :key="index"
                style="width: 147px; border: 1px solid #000; display: inline-table; text-align: center; margin: 0px"
              >
                {{ item.employeeName != null ? item.employeeName : '**' }}
              </p>
            </div>
            <div v-else>
              <p style="text-align: center">*暂无人员名单信息*</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <footer slot="footer">
        <el-button @click="close">取消</el-button>
      </footer>
    </el-dialog>
  </div>
</template>
<script>
import AvatarCropper from 'vue-avatar-cropper'
import Api from '../api/labour-api'
export default {
  name: 'PlayDetail',
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
      form: {},
      //已发放工资
      trueSum: '',
      employeeList: [],
      //未发放
      badeSum: '',
      noEmployeeList: [],
      count: '',
      tableData: []
    }
  },
  watch: {},
  created() {
    if (this.id) {
      Api.getPeoplePlayDate(this.id).then(res => {
        this.form = res.data || {}
        this.form.employeeList = this.form.employeeList || []
        this.employeeList = this.form.employeeList
        this.trueSum = this.employeeList.length || 0
        this.noEmployeeList = this.form.noEmployeeList || []
        this.badeSum = this.noEmployeeList.length || 0
        this.count = this.trueSum + this.badeSum || 0
      })
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
.p-span {
  display: inline-block;
  width: 146px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
