<template>
  <el-dialog
    title="选择附件"
    width="800px"
    top="10vh"
    :visible="visible"
    append-to-body
    @close="$emit('update:visible', false)"
  >
    <div class="body-container">
      <el-form ref="form" label-width="150px" :model="form" :rules="formRules">
        <el-form-item label="照片" prop="keyword">
          <Upload
            v-model="copyFileIds"
            isOnlyButton
            multiple
            accept="jpg,png,gif,bmp,webp"
            listType="picture-card"
            class="from-item"
            btnText="上传图片"
          ></Upload>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button v-promise-btn type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'UploadFileId',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    fileIds: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {},
      formRules: {},
      copyFileIds: this.fileIds
    }
  },
  created() {},
  methods: {
    //点击确定
    async handleSubmit() {
      this.$emit('submit', this.copyFileIds)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
</style>
