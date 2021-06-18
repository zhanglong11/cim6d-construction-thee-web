<template>
  <el-dialog
    :title="id ? '修改' : '新建'"
    width="1600px"
    top="10vh"
    :visible="visible"
    :close-on-click-modal="false"
    @close="$emit('update:visible', false)"
  >
    <div class="body-container">
      <el-form ref="form" :model="form" label-width="90px" :rules="rules">
        <el-form-item label="检查详情" prop="list">
          <el-table :data="form.list" stripe border align="center">
            <el-table-column type="index" width="50" label="序号"> </el-table-column>
            <el-table-column prop="problemArea" label="问题部位" min-width="250">
              <template slot-scope="scope">
                <el-form-item
                  class="form-item"
                  label=""
                  :prop="`list[${scope.$index}].problemArea`"
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
                  :prop="`list[${scope.$index}].problemDesc`"
                  :rules="{ required: true, message: '必填', trigger: 'blur' }"
                >
                  <el-input v-model.trim="scope.row.problemDesc" placeholder="请输入问题描述"> </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="照片" width="160">
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
                  :prop="`list[${scope.$index}].rectifyPrincipal`"
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
            <el-table-column prop="rectifyDeadline" label="整改期限" width="250">
              <template slot-scope="scope">
                <el-form-item
                  label=""
                  :prop="`list[${scope.$index}].rectifyDeadline`"
                  :rules="{ required: true, message: '必选', trigger: 'change' }"
                  class="form-item"
                >
                  <el-date-picker
                    v-model="scope.row.rectifyDeadline"
                    value-format="yyyy-MM-dd 00:00:00"
                    type="date"
                    placeholder="选择整改期限"
                    class="form-item"
                  >
                  </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column v-if="!id" prop="address" label="操作" width="80">
              <template slot-scope="scope">
                <el-button type="text" @click="toDelete(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="!id" class="add-btn" @click="handleAddIssue()"><i class="el-icon-plus"></i>添加</div>
          <AddIssueUpload
            v-if="uploadVisible"
            :visible.sync="uploadVisible"
            :fileIds="selectRowFileIds"
            @submit="handleUploadSubmit"
          ></AddIssueUpload>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button v-promise-btn type="primary" @click="handleSave(true)">保 存</el-button>
      <el-button v-promise-btn type="primary" @click="handleSave(false)">保存并下达</el-button>
    </span>
  </el-dialog>
</template>

<script>
import AddIssueUpload from './addIssueUpload'
export default {
  name: 'AddIssue',
  components: { AddIssueUpload },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    tableData: {
      type: Array,
      default: () => []
    },
    type: {
      type: [Number, String],
      default: 1 //1,质量;2,安全
    }
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      form: { list: [...this.tableData] },
      rules: { list: [{ required: true, message: '请填写列表数据', trigger: 'blur' }] },
      uploadVisible: false, //添加问题弹窗
      uploadRowIndex: null, //选择上传的行索引
      selectRowFileIds: null //所选行的附件id字符串
    }
  },
  created() {
    if (this.id) {
      // this.getDetail()
    }
  },
  methods: {
    //点击添加
    handleAddIssue() {
      this.form.list.push({ projectId: this.projectId, fileId: '', inspectType: this.type, id: this.id })
    },
    //点击上传按钮
    handleUpload(scope) {
      this.uploadRowIndex = scope.$index
      this.selectRowFileIds = scope.row.fileId || ''
      this.uploadVisible = true
    },
    //点击模态框的确定事件
    handleUploadSubmit(data) {
      this.form.list[this.uploadRowIndex].fileId = data
      this.uploadVisible = false
    },
    //删除
    async toDelete(scope) {
      this.form.list.splice(scope.$index, 1)
    },
    //点击确定
    async handleSave(isSave = true) {
      await this.$refs['form'].validate()
      let arrFlag = this.form.list.every(
        item => item.problemArea && item.problemDesc && item.rectifyPrincipal && item.rectifyDeadline
      )
      if (!arrFlag) {
        this.$message.error('请正确填写表格数据')
        return
      }
      this.$emit('submit', isSave, this.form.list)
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
