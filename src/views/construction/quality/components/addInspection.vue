<template>
  <el-dialog
    :title="id ? '修改' : '新建'"
    width="800px"
    top="10vh"
    :visible="visible"
    :close-on-click-modal="false"
    @close="$emit('update:visible', false)"
  >
    <div class="body-container">
      <el-form ref="form" label-width="150px" :model="form" :rules="formRules">
        <el-form-item label="验收名称" prop="acceptanceName">
          <el-input v-model="form.acceptanceName" style="width: 400px" @input="changeVal">
            <el-button slot="append" icon="el-icon-plus" @click="showTargetDialog">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="计划验收时间" prop="acceptanceDate">
          <el-date-picker
            v-model="form.acceptanceDate"
            class="from-item"
            type="date"
            value-format="yyyy-MM-dd 00:00:00"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="施工负责人" prop="constructionDirectorId">
          <SelectUser
            :id.sync="form.constructionDirectorId"
            :value="form.constructionDirector"
            :name.sync="form.constructionDirectorName"
            class="from-item"
            append-to-body
            :multiple="false"
          ></SelectUser>
        </el-form-item>
        <el-form-item label="附件">
          <Upload v-model="form.fileIds" isOnlyButton multiple class="from-item"></Upload>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" style="width: 400px" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button v-promise-btn type="primary" @click="handleSubmit(0)">保存</el-button>
      <el-button v-promise-btn type="primary" @click="handleSubmit(1)">保存并提交</el-button>
    </span>
    <!--选择工序-->
    <SelectSchedule :visible.sync="targetVisible" @getTarget="getTargetProcess" />
  </el-dialog>
</template>

<script>
import Api from '../api'
import SelectSchedule from './selectSchedule'
export default {
  name: 'AddInspectionModal',
  components: {
    SelectSchedule
  },
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
      form: {
        planUnicode: '',
        taskUniqueId: '',
        acceptanceName: ''
      },
      formRules: {
        acceptanceName: [{ required: true, message: '必填', trigger: 'blur' }],
        acceptanceDate: [{ required: true, message: '必填', trigger: 'change' }],
        constructionDirectorId: [{ required: true, message: '必填', trigger: 'change' }]
      },
      targetVisible: false
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  // watch: {
  //   ' form.acceptanceName': {
  //     deep: true,
  //     handler(e) {
  //       console.log(1111, e)
  //     }
  //   }
  // },
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    //获取详情
    async getDetail() {
      let res = await Api.getInspectionInfo(this.id)
      this.form = res.data
      this.form.constructionDirector = {
        id: res.data.constructionDirectorId,
        name: res.data.constructionDirectorName
      }
    },
    //点击确定
    async handleSubmit(type) {
      if (!this.form.acceptanceName) {
        this.$message.info('验收名称必填')
        return
      }
      await this.$refs.form.validate()

      let res = type
        ? await Api.getInspectionSaveAndSubmit({ ...this.form, projectId: this.projectId, id: this.id })
        : await Api.getInspectionSave({ ...this.form, projectId: this.projectId, id: this.id })
      if (res.code === 200) {
        this.close()
      }
    },
    changeVal(e) {
      this.form.acceptanceName = ''
      this.form.acceptanceName = e
    },
    //关闭弹窗
    close() {
      this.$emit('update:visible', false)
      this.$parent.refresh()
    },
    //选择进度弹窗
    showTargetDialog() {
      this.targetVisible = true
    },
    //选择进度回传
    getTargetProcess(e) {
      this.form.planUnicode = e.planUnicode
      this.form.taskUniqueId = e.taskUniqueId
      this.form.acceptanceName = e.name
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
</style>
