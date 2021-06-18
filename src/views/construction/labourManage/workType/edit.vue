<template>
  <div style="background-color: unset; width: 1130px; margin: 0 auto">
    <el-card>
      <div slot="header" class="card-header">
        <span>{{ $route.meta.title }}</span>
      </div>
      <el-form
        ref="form"
        :model="form"
        style="width: 650px; margin-left: 100px"
        :rules="rules"
        label-width="90px"
        @submit.native.prevent
      >
        <el-form-item label="工种名称" prop="argText">
          <el-input v-model="form.argText"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 6 }"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="footer-divide">
      <el-button size="medium" @click="$router.back()">取消</el-button>
      <el-button size="medium" type="primary" :loading="btnSaveLoading" @click="submit">{{
        id ? '保存' : '创建'
      }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Edit',
  data() {
    return {
      form: {
        argGroup: 'workType',
        module: 'construction',
        argFlag: 0
      },
      rules: {
        argText: [{ required: true, message: '必填' }]
      },
      btnSaveLoading: false
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  created() {
    if (this.id) {
      this.$api.getArgById(this.id).then(res => {
        this.form = res.data
      })
    }
  },
  methods: {
    async submit() {
      await this.$refs.form.validate()
      this.btnSaveLoading = true
      if (this.id) {
        await this.$api.updateArg(this.form)
        this.$message.success('编辑成功')
      } else {
        await this.$api.addArg(this.form)
        this.$message.success('新建成功')
      }
      this.btnSaveLoading = false
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less"></style>
