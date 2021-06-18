<template>
  <el-card class="box-card" shadow="never" style="margin: 10px">
    <div slot="header" class="clearfix">
      <span>复查情况</span>
      <el-button style="float: right; padding: 3px 0" type="text"></el-button>
    </div>
    <el-form ref="form" :model="form" :rules="rules" class="form" label-width="120px">
      <el-form-item label="复查结果" prop="reviewResult">
        <el-radio-group v-model="form.reviewResult" class="from-item">
          <el-radio :label="1">合格</el-radio>
          <el-radio :label="0">不合格</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.reviewResult === 0" label="复查意见" prop="reviewOpinion">
        <el-input
          v-model.trim="form.reviewOpinion"
          :autosize="{ minRows: 3, maxRows: 5 }"
          type="textarea"
          placeholder="请输入复查意见"
          class="from-item"
        />
      </el-form-item>
      <el-form-item label="现场照片" prop="reviewFileId">
        <Upload
          v-model="form.reviewFileId"
          accept="jpg,png,gif,bmp,webp"
          isOnlyButton
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
  name: 'ReviewForm',
  components: {},
  props: {},
  data() {
    return {
      form: {},
      rules: {
        reviewResult: [{ required: true, message: '复查结果必选' }],
        reviewOpinion: [{ required: true, message: '复查意见不能为空' }],
        reviewFileId: [{ required: true, message: '图片不能为空' }]
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
