<template>
  <el-dialog class="beauty" title="上传模型" :visible="visible" @close="close">
    <el-form ref="form" label-width="100px">
      <el-form-item label="模型文件">
        <input accept=".zip,.rvt,.skp,.3dm,.fbx,.s3d,.rfa,.ifc,.stl,.m3d" type="file" @change="handleFileChange" />
      </el-form-item>
      <el-form-item label="模型名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button v-promise-btn type="primary" @click="submit">上传</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { createModel } from '@/api/modelo'

export default {
  name: 'AddModelDialog',
  props: ['visible'],
  data() {
    return {
      form: {
        name: '',
        modelId: ''
      },
      file: null
    }
  },
  computed: {
    appToken() {
      return this.$store.state.bim.appToken
    }
  },
  created() {},
  methods: {
    handleFileChange(event) {
      this.file = _.first(event.target.files)
      if (!this.form.name) {
        this.form.name = this.file.name
      }
    },
    //取消
    close() {
      this.$emit('update:visible', false)
    },
    //提交
    async submit() {
      await this.$refs.form.validate()
      const { id: modelId } = await Modelo.Model.upload(this.file)
      await Modelo.Model.update(modelId, this.form.name)
      await createModel({ modelId, name: this.form.name, projectId: localStorage.getItem('projectId') })
      this.close()
      this.$parent.getTreeData()
    }
  }
}
</script>

<style scoped lang="less"></style>
