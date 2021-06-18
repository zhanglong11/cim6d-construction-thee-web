<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ id ? '修改集团资料' : '添加集团资料' }}</span>
      </div>
      <el-form ref="formRef" label-width="150px" :model="form" class="form-con" :rules="formRules">
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="资料名称" prop="name">
              <el-input v-model="form.name" class="form-input" placeholder="请输入资料名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="单位类型" prop="corpCategory">
              <el-select v-model="form.corpCategory" class="form-input" clearable placeholder="请选择类型">
                <el-option v-for="item in corpCategoryList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!--            <AddArg style="float: right;margin-right: -50px;margin-top: -50px;" group="corpCategory"></AddArg>-->
            <!-- <a style="float: right;margin-right: -50px;margin-top: -50px;" @click="handleAdd">添加</a>-->
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="资料描述" prop="desp">
              <el-input v-model="form.desp" class="form-input" placeholder="请输入资料描述" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="16">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" class="form-input" type="textarea" :rows="4" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>资料目录</span>
        <!--<el-upload
          style="float: right;"
          class="upload-demo"
          action="aaa"
          :show-file-list="false"
          :http-request="uploadSectionFile"
        >
          <el-button type="primary" size="small">上传资料</el-button>
        </el-upload>-->
        <el-button style="float: right" type="primary" size="small" @click="handleUpload">上传资料</el-button>
      </div>
      <!-- <el-table :data="tableData" border stripe size="small">
        <el-table-column type="index" label="序号" />
        <el-table-column prop="name" label="文件名称" />
        <el-table-column prop="uploadDate" label="上传时间" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>-->
      <vxe-table ref="xTable" :data="tableData" :edit-config="{ trigger: 'click', mode: 'row' }">
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="fileName" title="文件名称" />
        <vxe-table-column field="createTime" title="上传时间" />
        <vxe-table-column
          prop="remark"
          title="备注"
          :edit-render="{
            name: 'input',
            attrs: { type: 'text' }
          }"
        ></vxe-table-column>
        <vxe-table-column title="操作" width="400" fixed="right" align="center">
          <template #default="{ row, $rowIndex }">
            <PreviewByFileId :fileId="row.fileId" :fileName="row.fileName"></PreviewByFileId>
            <DownloadByFileId :fileId="row.fileId" :fileName="row.fileName" title="下载" />
            <template v-if="$refs.xTable.isActiveByRow(row)">
              <vxe-button title="保存" type="text" @click="saveRowEvent(row, $rowIndex)">保存</vxe-button>
            </template>
            <template v-else>
              <vxe-button title="编辑" type="text" @click="editRowEvent(row, $rowIndex)">编辑</vxe-button>
            </template>
            <vxe-button title="删除" type="text" @click="handleDelete(row)">删除</vxe-button>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-card>
    <div class="footer-btn">
      <el-button size="lg" @click="goBack">返回</el-button>
      <el-button type="primary" size="lg" @click="handleSubmit">保存</el-button>
    </div>
    <el-dialog title="添加单位类型" :visible="addVisible" width="600px" top="10vh" @close="addVisible = false">
      <div>
        <el-form ref="addForm" :inline="true" :model="addForm">
          <el-form-item
            label="单位类型名称"
            label-width="120"
            prop="name"
            style="margin-right: 20px"
            :rules="[{ required: true, message: '单位类型名称不能为空', trigger: 'blur' }]"
          >
            <el-input v-model="addForm.name" placeholder="请输入单位类型名称" style="width: 260px"> </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnSaveLoading" @click="handleAddSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <UploadDialog
      v-if="uploadVisible"
      :visible="uploadVisible"
      @close="uploadVisible = false"
      @submit="handleUploadEmit"
    ></UploadDialog>
  </div>
</template>

<script>
import Api from '../api/work-bench'
import UploadDialog from '../components/UploadDialog' // 上传组件
export default {
  name: 'GroupDataAdd',
  components: {
    UploadDialog
  },
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id || '',
      form: {
        categoryType: 1,
        corpCategory: '',
        name: '',
        desp: '',
        remark: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入资料名称', trigger: 'blur' }],
        corpCategory: [{ required: true, message: '请选择单位类型', trigger: 'change' }]
      },
      addForm: { name: '' },
      //添加类型的状态
      addVisible: false,
      uploadVisible: false,
      tableData: [],
      btnSaveLoading: false
    }
  },
  computed: {
    corpCategoryList() {
      return this.$getArgList('corpCategory') || []
    }
  },

  created() {
    if (this.id) {
      Api.getDataDetail(this.id).then(res => {
        this.form = { ...res.data, corpCategory: res.data.corpCategory + '' }
        this.tableData = res.data.fileList
      })
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    /*if (this.id) {
      Api.getGroupDataDetail({ id: this.id }).then(res => {
        this.form = res.data
        this.tableData=res.data.list
      })
    }*/
  },
  // 方法集合
  methods: {
    //点击添加按钮
    handleAdd() {
      this.addVisible = true
    },

    async handleAddSubmit() {
      this.$refs['addForm'].validate(async valid => {
        if (valid) {
          this.btnSaveLoading = true
          let res
          try {
            res = await Api.addType(this.addForm)
          } catch (e) {
            this.$message.info('未知错误,请重试')
            this.btnSaveLoading = false
            return false
          }
          if (res.code === 200) {
            this.$store.dispatch('dataManage/getCompanyTypeList')
            this.addVisible = false
            this.btnSaveLoading = false
          } else {
            this.$message.info('未知错误,请重试')
            this.btnSaveLoading = false
            return false
          }
        } else {
          this.$message.info('请正确填写')
          return false
        }
      })
    },
    //上传文件弹窗
    handleUpload() {
      this.uploadVisible = true
    },

    //上传文件提交
    async handleUploadEmit(data) {
      this.uploadVisible = false
      this.tableData.push({
        fileId: data.fileIds[0],
        //createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        fileName: data.fileName,
        remark: data.remark
      })
      /* let res=await Api.uploadGroupData(data)
     if(res.code===200){
       this.uploadVisible = false
       this.tableData.push({ id: 1, name: '测试而已', remark: '1234556' })
     }*/
    },
    //点击上传文件
    uploadSectionFile(params) {
      const file = params.file
      const formData = new FormData()
      formData.append('file', file)
      /*Api.uploadGroupData(formData).then(res => {
        if (res.code === 200) {
          this.$message.success('上传成功')
        } else {
          this.$message.error('未知错误,请重试')
        }
      })*/
      this.tableData.push({ id: 1, name: '测试而已' })
    },
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    saveRowEvent(row, $rowIndex) {
      this.$refs.xTable.clearActived()
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    async handleDelete(row) {
      if (row.id) {
        await Api.deleteData(row.id)
      }
      this.$message.success('删除成功')
      this.tableData = this.tableData.filter(item => item._XID !== row._XID)
    },
    //提交|修改集团资料
    handleSubmit() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          if (this.id) {
            Api.updateData({ ...this.form, fileList: this.tableData }).then(res => {
              if (res.code === 200) {
                this.$router.back()
              }
            })
          } else {
            Api.addData({ ...this.form, fileList: this.tableData }).then(res => {
              if (res.code === 200) {
                this.$router.back()
              }
            })
          }
        } else {
          this.$message.info('请正确填写')
          return false
        }
      })
    },
    // 返回
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.form-con {
  padding-right: 15%;
}
.form-input {
  width: 100%;
}
.inline-input {
  width: 30%;
  display: inline-block;
}
/deep/ .vxe-button {
  color: #409eff;
}
</style>
