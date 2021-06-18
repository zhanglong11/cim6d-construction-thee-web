<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ id ? '修改行业资料' : '添加行业资料' }}</span>
      </div>
      <el-form ref="formRef" :model="form" label-width="150px" class="form-con" :rules="formRules">
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="资料名称" prop="name">
              <el-input v-model="form.name" class="form-input" placeholder="请输入资料名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="行业类型" prop="industryCategory">
              <el-select v-model="form.industryCategory" class="form-input" clearable placeholder="请选择行业类型">
                <el-option
                  v-for="item in industryCategoryList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <!--            <AddArg style="float: right;margin-right: -50px;margin-top: -50px;" group="industryCategory"></AddArg>-->
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="资料类型" prop="industryInfomationType">
              <el-select
                v-model="form.industryInfomationType"
                class="form-input"
                clearable
                placeholder="请选择资料类型"
              >
                <el-option
                  v-for="item in industryInfomationTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <!--            <AddArg style="float: right;margin-right: -50px;margin-top: -50px;" group="industryInfomationType"></AddArg>-->
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
        <el-button style="float: right" type="primary" size="small" @click="handleUpload">上传资料</el-button>
      </div>
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
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button type="primary" size="lg" :loading="btnSaveLoading" @click="handleSubmit()">保存</el-button>
    </div>
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
  name: 'IndustryDataAdd',
  components: {
    UploadDialog
  },
  data() {
    // 这里存放数据
    return {
      // 单位类型
      id: this.$route.params.id || '',
      form: {
        categoryType: 2,
        name: '',
        industryCategory: '',
        industryInfomationType: '',
        desp: '',
        remark: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入资料名称', trigger: 'blur' }],
        industryCategory: [{ required: true, message: '请选择行业分类', trigger: 'change' }],
        industryInfomationType: [{ required: true, message: '请选择行业资料分类', trigger: 'change' }]
      },
      uploadVisible: false,
      tableData: [],
      btnSaveLoading: false
    }
  },
  computed: {
    //行业分类
    industryCategoryList() {
      return this.$getArgList('industryCategory') || []
    },
    //行业资料分类
    industryInfomationTypeList() {
      return this.$getArgList('industryInfomationType') || []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    if (this.id) {
      Api.getDataDetail(this.id).then(res => {
        this.form = {
          ...res.data,
          industryCategory: res.data.industryCategory + '',
          industryInfomationType: res.data.industryInfomationType + ''
        }
        this.tableData = res.data.fileList
      })
    }
  },
  // 方法集合
  methods: {
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
    //提交|修改行业资料
    handleSubmit() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.btnSaveLoading = true
          if (this.id) {
            Api.updateData({ ...this.form, fileList: this.tableData }).then(res => {
              this.btnSaveLoading = false
              if (res.code === 200) {
                this.$router.back()
              }
            })
          } else {
            Api.addData({ ...this.form, fileList: this.tableData, ...{ inPublic: 1 } }).then(res => {
              this.btnSaveLoading = false
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
//@import url(); 引入公共css类
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
