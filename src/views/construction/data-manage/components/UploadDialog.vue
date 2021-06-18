<template>
  <el-dialog title="上传" :visible="visible" width="600px" top="10vh" @close="$emit('close')">
    <div class="formWrapper">
      <el-form ref="form" :inline="true" :model="form">
        <div>
          <el-form-item label="备注" label-width="100" prop="remark" style="margin-right: 20px">
            <el-input v-model="form.remark" placeholder="备注" style="width: 260px"> </el-input>
          </el-form-item>
          <el-form-item label="上传" label-width="100">
            <FileUploadWithImg
              v-model="form.fileIds"
              :multiple="false"
              :limit="1"
              :fileRecover="fileUrlList"
              :accept="['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png', 'excel', 'ppt']"
              @fileName="e => (form.fileName = e)"
            ></FileUploadWithImg>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import FileUploadWithImg from '@/components/FileUploadWithImg'
export default {
  name: 'UploadDialog',
  components: { FileUploadWithImg },
  props: ['visible'],

  data() {
    return {
      form: {
        remark: '',
        fileIds: [],
        fileName: ''
      },
      fileUrlList: []
    }
  },
  created() {},
  methods: {
    handleSubmit() {
      if (!this.form.fileIds.length) {
        this.$message.info('请选择上传文件')
      } else {
        this.$emit('submit', this.form)
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
