<template>
  <div class="no-padding">
    <el-card class="box-card">
      <el-form ref="form" :model="form" :rules="formRules" label-width="140px">
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="资料名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="资料分类" prop="informationType">
              <el-select v-model="form.informationType" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in informationTypeList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="16">
            <!--<el-button v-if="$hasPower('ProjectDataAddDataGroup')" type="text" @click="handleAdd">添加</el-button>-->
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="资料描述" prop="desp">
              <el-input v-model="form.desp" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="资料备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">资料目录</span>
        <el-button type="primary" size="mini" @click="handleUpload">上传资料</el-button>
      </div>
      <vxe-table
        ref="xTable"
        auto-resize
        keep-source
        :data="tableData"
        :edit-config="{ trigger: 'click', mode: 'row', autoClear: false }"
      >
        <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
        <vxe-table-column field="fileName" title="文件名称" />
        <!--<vxe-table-column field="createTime" title="创建时间" />-->
        <vxe-table-column
          title="备注"
          field="remark"
          :edit-render="{
            name: 'input',
            attrs: { type: 'text' }
          }"
        ></vxe-table-column>
        <vxe-table-column title="操作" width="400" fixed="right" align="center">
          <template #default="{ row, $rowIndex }">
            <PreviewByFileId :fileId="row.fileId" :fileName="row.fileName"></PreviewByFileId>
            <DownloadByFileId :fileId="row.fileId" :fileName="row.fileName" title="下载" class="file-download" />
            <template v-if="$refs.xTable.isActiveByRow(row)">
              <el-button type="text" @click="saveRowEvent(row, $rowIndex)">保存</el-button>
              <el-button type="text" @click="cancelRowEvent(row)">取消</el-button>
            </template>
            <template v-else>
              <el-button type="text" @click="editRowEvent(row, $rowIndex)">编辑</el-button>
              <el-button type="text" @click="handleDelete(row)">删除</el-button>
            </template>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="handleCancel()">取消</el-button>
      <el-button size="lg" type="primary" :loading="btnSaveLoading" @click="handleSave()">保存</el-button>
    </div>

    <!-- 上传资料模态框 start -->
    <UploadProjectDataDialog
      :visible.sync="uploadProjectDataVisible"
      :limit="1"
      @uploadProjectDataCallback="uploadProjectDataCallback"
    />
    <!-- 上传资料模态框 end -->

    <!-- 添加资料分类模态框 start -->
    <DictDialog :visible.sync="dictVisible" @dictCallback="dictCallback" />
    <!-- 添加资料分类模态框 end -->
  </div>
</template>

<script>
import Api from '../api/index'
import UploadProjectDataDialog from './uploadProjectDataDialog'
import DictDialog from './dictDialog'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'ProjectDataAdd',
  components: { UploadProjectDataDialog, DictDialog },
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id || '',
      form: {
        name: '',
        informationType: undefined,
        desp: '',
        remark: ''
      },
      formRules: {
        name: [{ required: true, message: '必填' }],
        informationType: [{ required: true, message: '必填' }]
      },
      tableData: [],
      uploadProjectDataVisible: false,
      dictVisible: false,
      btnSaveLoading: false
    }
  },
  computed: {
    informationTypeList() {
      return this.$getArgList('informationType') || []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    if (this.id) {
      this.getProjectDataDetail(this.id)
    }
  },
  // 方法集合
  methods: {
    // 添加资料分类
    handleAdd() {
      this.dictVisible = true
    },
    // 上传资料
    handleUpload() {
      this.uploadProjectDataVisible = true
    },
    // 资料目录保存
    saveRowEvent(row, $rowIndex) {
      this.$refs.xTable.clearActived()
    },
    // 编辑
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    // 资料目录表格操作列取消
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    // 删除
    async handleDelete(row) {
      this.tableData = this.tableData.filter(item => item._XID !== row._XID)
    },
    // 页面取消
    handleCancel() {
      this.$router.push({ name: 'ProjectDataList' })
    },
    // 页面保存
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let flag = true
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.$refs.xTable.isActiveByRow(this.tableData[i])) {
              flag = false
            }
          }
          if (flag) {
            this.btnSaveLoading = true
            Api.saveProjectData({
              ...this.form,
              fileList: this.tableData,
              projectId: localStorage.getItem('projectId')
            })
              .then(res => {
                // console.log(res)
                this.$message.success('保存成功')
                this.$router.back()
              })
              .finally(() => {
                this.btnSaveLoading = false
              })
            // console.log(this.form)
            // console.log(this.tableData)
          } else {
            this.$message.error('请先保存资料目录，再做该操作')
          }
        }
      })
    },
    // 上传项目资料回调
    uploadProjectDataCallback(info) {
      this.uploadProjectDataVisible = false
      this.tableData.push(info)
    },
    // 添加资料分类回调
    dictCallback(info) {
      this.$store.dispatch('setSystemConfigStorage').then(() => {
        let group = this.$getArgList(info.argGroup)
        let matchItem = _.find(group, { label: info.argText }) || {}
        this.form.informationType = matchItem.value
      })
    },
    // 获取项目资料详情
    getProjectDataDetail(id) {
      Api.getProjectDataDetail(id).then(res => {
        this.form = res.data
        this.tableData = res.data.fileList
      })
    }
  }
}
</script>

<style lang="less" scoped>
.file-download {
  margin-right: 10px;
}
</style>
