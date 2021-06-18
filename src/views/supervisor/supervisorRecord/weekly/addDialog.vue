<template>
  <el-dialog :title="id ? '修改' : '新建' + '监理周报基本信息'" :visible="visible" width="1024px" @close="handleCancel">
    <el-form ref="form" :model="form" :rules="formRules" label-width="150px">
      <el-row>
        <el-col :md="12">
          <el-form-item label="单位工程名称" prop="engineeringName">
            <el-input v-model="form.engineeringName" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="时间" prop="reportStartDate">
            <el-date-picker
              v-model="reportDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 325px"
              value-format="yyyy-MM-dd"
              @input="getReportDate"
            >
            </el-date-picker>
            <!--            <DateRange-->
            <!--              v-model="reportDate"-->
            <!--              :startTime.sync="form.reportStartDate"-->
            <!--              :endTime.sync="form.reportEndDate"-->
            <!--            ></DateRange>-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="12">
          <el-form-item label="签阅人" prop="signPersonId" class="select-author">
            <SelectUser
              :id.sync="form.signPersonId"
              :multiple="false"
              :value="form.signPersonId ? { id: form.signPersonId, label: form.signPersonName } : null"
              :name.sync="form.signPersonName"
              @input="validateAuthor('signPersonId')"
            />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="周报填写人" prop="creatorName">
            <el-input v-model="form.creatorName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="24">
          <!--         <h5>本周工程进度</h5>-->
          <el-form-item label="本周工程进度" required>
            <el-table :data="form.thisWeekList" stripe border align="center">
              <el-table-column type="index" width="50" label="序号"> </el-table-column>
              <el-table-column prop="workContent" label="工作内容名称">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.workContent" placeholder="请输入"> </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="finishSituation" label="完成情况(%)">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.finishSituation" placeholder="请输入"> </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="unfinishedReason" label="未完成原因">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.unfinishedReason" placeholder="请输入"> </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="principal" label="负责人">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.principal" placeholder="请输入"> </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark" placeholder="请输入"> </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="操作" width="80">
                <template slot-scope="scope">
                  <el-button type="text" @click="toDelete(scope)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="add-btn" @click="handleAddRows()"><i class="el-icon-plus"></i>添加</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="24">
          <el-form-item label="下周工程安排">
            <el-table :data="form.nextWeekList" stripe border align="center">
              <el-table-column type="index" width="50" label="序号"> </el-table-column>
              <el-table-column prop="workContent" label="工作内容名称">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.workContent" placeholder="请输入"> </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark" placeholder="请输入"> </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="操作" width="80">
                <template slot-scope="scope">
                  <el-button type="text" @click="toDeleteNext(scope)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="add-btn" @click="handleAddRowsNext()"><i class="el-icon-plus"></i>添加</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="24">
          <el-form-item label="本周现场大事记">
            <el-input v-model="form.breakingNews" type="textarea" :rows="2" placeholder="请输入" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="12">
          <el-form-item label="本周质量问题反馈">
            <el-input v-model="form.qualityIssueFeedback" type="textarea" :rows="2" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="本周安全问题反馈">
            <el-input v-model="form.safetyIssueFeedback" type="textarea" :row="2" placeolder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="14">
          <el-form-item label="本周工程照片上传">
            <FileEdit v-model="form.engineeringImgIds" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="14">
          <el-form-item label="监理周报附件">
            <FileEdit v-model="form.fileIds" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="btnSaveLoading" @click="handleSave">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'AddLogDialog',
  props: {
    visible: Boolean,
    id: String
  },
  // 这里存放数据
  data() {
    return {
      form: {
        projectId: this.$store.state.project.projectId,
        creatorName: this.$store.state.user.name,
        creator: this.$store.state.user.id,
        engineeringName: '',
        thisWeekList: [],
        nextWeekList: [],
        reportEndDate: '',
        reportStartDate: ''
      },
      formRules: {
        engineeringName: [{ required: true, message: '必填' }],
        creatorName: [{ required: true, message: '必填' }],
        reportStartDate: [{ required: true, message: '必选' }],
        signPersonId: [{ required: true, message: '必选' }]
      },
      btnSaveLoading: false,
      reportDate: []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  // 方法集合
  methods: {
    // 编制人校验
    validateAuthor(signPersonId) {
      this.$nextTick(() => {
        this.$refs.form.validateField(signPersonId)
      })
    },
    // 取消
    handleCancel() {
      this.$emit('update:visible', false)
    },
    // 保存
    async handleSave() {
      try {
        await this.$refs.form.validate()
        if (!this.form.thisWeekList.length) {
          this.$message.info('请先填写本周工程进度')
          return
        }
        this.btnSaveLoading = true
        await Api.getWeeklyAdd(this.form).then(res => {
          if (res.code === 200) {
            this.btnSaveLoading = false
            this.$message.success('保存成功')
            this.handleCancel()
            this.$parent.refresh()
          } else {
            this.$message.success('保存失败')
          }
        })
      } catch (e) {
        this.btnSaveLoading = false
      }
    },
    // 获取详情
    getDetail() {
      Api.getWeeklyInfo(this.id).then(res => {
        this.form = res.data || {}
        let { reportEndDate, reportStartDate } = this.form
        this.reportDate = [reportStartDate, reportEndDate]
      })
    },
    //本周工程进度点击添加
    handleAddRows() {
      this.form.thisWeekList.push({
        finishSituation: '',
        id: '',
        principal: '',
        remark: '',
        unfinishedReason: '',
        workContent: ''
      })
    },
    //本周工程进度删除
    toDelete(scope) {
      this.form.thisWeekList.splice(scope.$index, 1)
    },
    //下周工程安排添加
    handleAddRowsNext() {
      this.form.nextWeekList.push({
        id: '',
        remark: '',
        workContent: ''
      })
    },
    //下周工程安排删除
    toDeleteNext(scope) {
      this.form.nextWeekList.splice(scope.$index, 1)
    },
    //获取时间
    getReportDate(e) {
      this.form.reportStartDate = e[0]
      this.form.reportEndDate = e[1]
      console.log(111, this.form)
    }
  }
}
</script>

<style lang="less" scoped>
.select-author.is-error {
  /deep/ .vue-treeselect__control {
    border-color: #f56c6c;
  }
  /deep/ .vue-treeselect__control:hover {
    border-color: #f56c6c;
  }
}
.add-btn {
  text-align: center;
  border-radius: 4px;
  height: 30px;
  border: 1px #999 dashed;
  line-height: 30px;
}
.el-form-item__content {
  line-height: 30px;
}
</style>
