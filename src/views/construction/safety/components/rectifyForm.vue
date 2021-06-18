<template>
  <el-card class="box-card" shadow="never" style="margin: 10px">
    <div slot="header" class="clearfix">
      <span>问题整改</span>
      <el-button style="float: right; padding: 3px 0" type="text"></el-button>
    </div>
    <el-form ref="form" :model="form" :rules="rules" class="form" label-width="120px">
      <el-form-item label="整改方法" prop="rectifyContent">
        <el-input
          v-model.trim="form.rectifyContent"
          :autosize="{ minRows: 3, maxRows: 5 }"
          type="textarea"
          placeholder="请输入整改方法"
          class="form-item"
        />
      </el-form-item>
      <el-form-item label="现场照片" prop="rectifyFileId">
        <Upload
          v-model="form.rectifyFileId"
          isOnlyButton
          accept="jpg,png,gif,bmp,webp"
          multiple
          class="from-item"
          btnText="上传照片"
        ></Upload>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'RectifyForm',
  components: {},
  props: {},
  data() {
    return {
      form: {},
      rules: {
        rectifyContent: [{ required: true, message: '整改方法不能为空', trigger: 'blur' }],
        rectifyFileId: [{ required: true, message: '现场照片不能为空' }]
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    async validForm() {
      let res = await this.$refs.form.validate().catch(e => false)
      return res ? { ...this.form } : false
    }
  }
}
</script>

<style scoped lang="less">
@import '../index.less';
</style>
