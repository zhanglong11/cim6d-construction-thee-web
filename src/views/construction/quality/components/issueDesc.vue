<template>
  <el-dialog
    :append-to-body="appendToBody"
    title="检查详情"
    width="1700px"
    top="20vh"
    :visible="visible"
    @close="$emit('update:visible', false)"
  >
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="实际检查时间" prop="inspectTime">
        <el-date-picker
          v-model="form.inspectTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 400px"
          type="datetime"
          placeholder="选择一个检查日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="检查详情" prop="problemList">
        <el-table :data="form.problemList" stripe border align="center">
          <el-table-column type="index" width="50" label="序号"> </el-table-column>
          <el-table-column prop="problemArea" label="问题部位" min-width="250">
            <template slot-scope="scope">
              <el-form-item
                class="form-item"
                label=""
                :prop="`problemList[${scope.$index}].problemArea`"
                :rules="{ required: true, message: '必填', trigger: 'blur' }"
              >
                <el-input v-model.trim="scope.row.problemArea" placeholder="请输入问题部位"> </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="problemDesc" label="问题描述" min-width="250">
            <template slot-scope="scope">
              <el-form-item
                class="form-item"
                label=""
                :prop="`problemList[${scope.$index}].problemDesc`"
                :rules="{ required: true, message: '必填', trigger: 'blur' }"
              >
                <el-input v-model.trim="scope.row.problemDesc" placeholder="请输入问题描述"> </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="fileId" label="照片" width="160">
            <template slot-scope="scope">
              <el-button type="text" @click="handleUpload(scope)">上传</el-button>
              <span v-if="scope.row.fileId && scope.row.fileId.split(',').length > 0">
                共{{ scope.row.fileId.split(',').length }}个附件
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="rectifyPrincipal" label="整改人" width="250">
            <template slot-scope="scope">
              <el-form-item
                label=""
                :prop="`problemList[${scope.$index}].rectifyPrincipal`"
                :rules="{ required: true, message: '必选', trigger: 'change' }"
                class="form-item"
              >
                <SelectUser
                  v-model="scope.row.rectifyPrincipal"
                  valueFormat="id"
                  :multiple="false"
                  append-to-body
                  class="form-item"
                ></SelectUser>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="rectifyDeadline" label="整改期限" width="300">
            <template slot-scope="scope">
              <el-form-item
                label=""
                class="form-item"
                :prop="`problemList[${scope.$index}].rectifyDeadline`"
                :rules="{ required: true, message: '必选', trigger: 'change' }"
              >
                <el-date-picker
                  v-model="scope.row.rectifyDeadline"
                  value-format="yyyy-MM-dd 23:59:59"
                  type="date"
                  placeholder="选择整改期限"
                  class="form-item"
                >
                </el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="toDelete(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="add-btn" @click="handleAddIssue()"><i class="el-icon-plus"></i>添加</div>
        <AddIssueUpload
          v-if="uploadVisible"
          :visible.sync="uploadVisible"
          :fileIds="selectRowFileIds"
          @submit="handleUploadSubmit"
        ></AddIssueUpload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-promise-btn type="primary" @click="handleSave">保 存</el-button>
      <el-button @click="$emit('update:visible', false)">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
//问题描述
import Api from '../api'
import AddIssueUpload from './addIssueUpload'
export default {
  name: 'IssueDesc',
  components: { AddIssueUpload },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    inspectType: {
      type: [Number, String],
      default: 1 //1,质量;2,安全
    }
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      uploadVisible: false, //添加问题弹窗
      uploadRowIndex: null, //选择上传的行索引
      selectRowFileIds: null, //所选行的附件id字符串
      form: { problemList: [...this.tableData] },
      rules: {
        inspectTime: [{ required: true, message: '实际检查时间不能为空', trigger: 'blur' }]
        //problemList: [{ required: true, message: '问题描述不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {},
  methods: {
    //点击上传按钮
    handleUpload(scope) {
      this.uploadRowIndex = scope.$index
      this.selectRowFileIds = scope.row.fileId || ''
      this.uploadVisible = true
    },
    //点击添加按钮
    handleAddIssue() {
      this.form.problemList.push({ inspectType: this.inspectType, projectId: this.projectId, fileId: '' })
    },
    //点击模态框的确定事件
    handleUploadSubmit(data) {
      this.form.problemList[this.uploadRowIndex].fileId = data
      this.uploadVisible = false
    },
    //删除
    async toDelete(scope) {
      this.form.problemList.splice(scope.$index, 1)
    },
    //保存检查列表数据
    async handleSave() {
      await this.$refs['form'].validate()
      let arrFlag = this.form.problemList.every(
        item => item.problemArea && item.problemDesc && item.rectifyPrincipal && item.rectifyDeadline
      )
      if (!arrFlag) {
        this.$message.error('请正确填写表格数据')
        return
      }
      this.$emit('submit', { ...this.form })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
/deep/ .cell {
  padding-right: 40px;
  .el-form-item {
    margin-bottom: 0;
    .el-form-item__content {
      position: relative;
      .el-form-item__error {
        position: absolute;
        top: 7px;
        min-width: 30px;
        left: calc(100% + 5px);
        //background-color: #00bfff;
      }
    }
  }
  .form-item {
    width: 200px;
  }
}
</style>
