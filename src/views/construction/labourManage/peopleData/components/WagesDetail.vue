<template>
  <div>
    <el-dialog
      class="beauty"
      title="工资详情"
      :visible="visible"
      width="750px"
      :close-on-click-modal="false"
      @close="close"
    >
      <div class="wages-left">
        <el-row :gutter="4">
          <el-col :span="24" style="text-align: center">
            <div class="avatar-wrap">
              <el-avatar :key="form.headImage" :size="85" :src="form.headImage" />
              <!-- <i id="pick-avatar" class="el-icon-edit-outline" /> -->
            </div>
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
            <span class="desc-label">身份证号:</span>
            <span>{{ form.idCardNum }}</span>
          </el-col>
          <el-col :span="12">
            <span class="desc-label">手机号码:</span>
            <span>{{ form.mobile }}</span>
          </el-col>
          <el-col :span="12">
            <span class="desc-label">在职状态:</span>
            <span>{{ ['在职', '离职'][form.jobStatus - 1] }}</span>
          </el-col>
          <el-col :span="12">
            <span class="desc-label">工种:</span>
            <span>{{ $getLabelFromArg('workType', form.workType) }}</span>
          </el-col>
          <el-col :span="12">
            <span class="desc-label">所属劳务公司及班组:</span>
            <span>{{ form.labourCompanyName + '-' + form.groupName }}</span>
          </el-col>
          <el-col :span="12">
            <span class="desc-label">用工性质:</span>
            <span>{{ $getLabelFromArg('workerProperty', form.staffKind) }}</span>
          </el-col>
          <el-col :span="24">
            <div class="desc-table">
              <div class="tab" style="padding-left: 20px">
                <el-table
                  :data="tableData"
                  border
                  :header-cell-style="{ textAlign: 'center', background: '#fff' }"
                  :cell-style="{ 'text-align': 'center' }"
                  style="width: 100%"
                >
                  <el-table-column prop="seq" label="序号" width="180" type="index"></el-table-column>
                  <el-table-column prop="salaryMonth" label="工资所属月份">
                    <template slot-scope="{ row }">
                      {{ row.salaryMonth == null ? '-' : moment(row.salaryMonth).format('YYYY年MM月 ') }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="updateTime" label="工资领取日期">
                    <template slot-scope="{ row }">
                      {{ row.updateTime == null ? '-' : moment(row.updateTime).format('YYYY年MM月DD日 ') }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <footer slot="footer">
        <el-button v-if="$hasPower('LabourPeopleListWagesDetail')" type="primary" @click="getDown()"
          >下载工资表</el-button
        >
        <el-button @click="close">取消</el-button>
      </footer>
    </el-dialog>
  </div>
</template>
<script>
import AvatarCropper from 'vue-avatar-cropper'
import api from '../../api/labour-api'
export default {
  name: 'WagesDetail',
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
      tableData: [],
      fileName: '工资详情表.xls'
    }
  },
  watch: {
    async visible(val) {
      if (val) {
        if (this.id) {
          this.form = await api.getLabourEmployeeDetails(this.id).then(res => res.data)
          this.tableData = this.form.detailList
        } else {
          this.form = {}
        }
      }
    }
  },
  methods: {
    //下载
    async getDown() {
      if (this.id === '') return
      let res = await api.getExport(this.id)
      saveAs(res.data, this.fileName ? this.fileName : 'download.xls')
    },
    // 关闭弹窗
    close() {
      this.$emit('update:visible', false)
    },
    refresh() {}
  }
}
</script>
<style scoped lang="less">
.el-col {
  margin-bottom: 25px;
  font-size: 16px;
}
.desc-label {
  margin-right: 10px;
}
</style>
