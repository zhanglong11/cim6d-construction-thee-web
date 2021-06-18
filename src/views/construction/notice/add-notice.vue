<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ id ? '编辑公告' : '新建公告' }}</span>
      </div>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="150px" class="form-con">
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="所属项目" prop="projectId">
              <el-select v-model="formData.projectId" disabled placeholder="请选择" class="form-input">
                <el-option v-for="item in projectList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="公告标题" prop="title">
              <el-input v-model="formData.title" placeholder="请输入公告标题" class="form-input" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="公告类型" prop="type">
              <el-select v-model="formData.cateogry" clearable placeholder="请选择" class="form-input">
                <el-option v-for="item in typeList" :key="item.value" :label="item.desc" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="正文" prop="content">
              <el-input
                v-model="formData.content"
                class="form-input"
                type="textarea"
                :rows="8"
                placeholder="请输入正文"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="附件" prop="contentFileIds">
              <FileEdit v-model="formData.contentFileIds" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button type="primary" size="lg" :loading="isLoading" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import { noticeApi } from './api/notice'

export default {
  name: 'AddNotice',
  components: {},
  data() {
    // 这里存放数据
    return {
      // 公告类型下拉框数据
      typeList: this.$enum.getValueDescList('NOTICE_TYPE'),
      id: this.$route.query.id || '',
      projectList: [], // 所属项目
      isLoading: false,
      formData: {
        classification: 2,
        companyId: this.$store.state.user.companyId,
        receiverId: this.$store.state.user.id,
        content: '',
        projectId: this.$store.state.project.projectId,
        title: '',
        cateogry: '',
        status: 1
      },
      formRules: {
        projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
        title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
        cateogry: [{ required: true, message: '请选择公告类型', trigger: 'change' }],
        content: [{ required: true, message: '请输入正文', trigger: 'blur' }]
      }
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.queryProjectList()
    this.getDetailsMessage()
  },
  // 方法集合
  methods: {
    // 获取项目列表
    async queryProjectList() {
      const result = await noticeApi.queryProjectList({ page: 1, rows: 999 })
      const datas = (result.data && result.data.records) || []
      const list = []
      datas.map(item => {
        list.push({
          label: item.name,
          value: item.id
        })
      })
      this.projectList = list
    },
    // 获取消息详情
    async getDetailsMessage() {
      if (!this.id) {
        return
      }
      const result = await noticeApi.getDetailsNotice(this.id)
      const datas = result.data
      this.formData = Object.assign({}, datas)
    },
    // 保存并提交
    save() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.saveSuccess()
        } else {
          this.$message({
            type: 'error',
            message: '请完善表单!'
          })
          return false
        }
      })
    },
    // 保存 - 异步
    async saveSuccess() {
      try {
        this.isLoading = true
        if (this.id) {
          await noticeApi.updateNotice(this.formData)
        } else {
          await noticeApi.addNotice(this.formData)
        }
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.goBack()
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
      }
    },
    // 返回
    goBack() {
      this.$router.push({
        path: '/notice'
      })
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
</style>
