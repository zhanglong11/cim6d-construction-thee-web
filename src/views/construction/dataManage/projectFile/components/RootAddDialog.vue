<template>
  <el-dialog :title="id ? '编辑' : '新建'" width="500px" class="beauty bg-border" :visible="visible" @close="close">
    <div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入" />
        </el-form-item>
      </el-form>
    </div>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button v-promise-btn type="primary" @click="submit">确定</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import Api from '../api'
export default {
  name: 'RootAddDialog',
  // import引入的组件
  components: {},
  props: {
    id: {},
    name: {},
    visible: {},
    type: {}
  },
  data() {
    // 这里存放数据
    return {
      form: {},
      rules: {
        name: [{ required: true, message: '必选' }]
      }
    }
  },
  // 生命周期 - 挂载完成
  created() {
    this.refresh()
  },
  // 方法集合
  methods: {
    refresh() {
      if (!this.id) return
      this.form = {
        name: this.name
      }
    },
    // 关闭弹窗
    close() {
      this.$emit('update:visible', false)
    },
    async submit() {
      await this.$refs.form.validate()
      console.log(this.type)
      if (this.type === 'image') {
        this.id ? await Api.file.imageUpdate({ id: this.id, ...this.form }) : await Api.file.imageAdd(this.form)
      } else {
        this.id ? await Api.file.update({ id: this.id, ...this.form }) : await Api.file.add(this.form)
      }

      this.$message.success('操作成功')
      this.close()
      this.$parent.refresh()
    }
  }
}
</script>

<style scoped lang="less"></style>
