<template>
  <el-dialog :visible="visible" title="编辑产品信息" width="520px" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="产品名称" prop="name"><el-input v-model="form.name"></el-input></el-form-item>
      <el-form-item label="所属品类">
        <p>{{ form.templateName }}</p>
      </el-form-item>
      <el-form-item label="节点类型">
        <p>{{ $getLabel(productTypeList, form.type) }}</p>
      </el-form-item>
      <el-form-item label="产品描述" prop="description">
        <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }"></el-input>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">{{ id ? '保存' : '创建' }}</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import productTypeList from '../../lib/productTypeList'
import Api from '../../api/iot-api'
export default {
  name: 'Edit',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      form: {
        projectId: localStorage.getItem('projectId')
      },
      rules: {
        name: [{ required: true, message: '必填' }]
      },
      productTypeList
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  watch: {
    visible() {
      if (this.visible && this.id) {
        Api.getIotProductDetail(this.id).then(res => {
          this.form = res.data
        })
      }
    }
  },
  created() {
    this.initForm = _.cloneDeep(this.form)
  },
  mounted() {},
  methods: {
    async submit() {
      await this.$refs.form.validate()
      await Api.updateIotProduct(this.form).then(res => {
        this.$message.success('修改成功')
      })
      this.$parent.refresh()
      this.close()
    },
    async close() {
      this.form = _.cloneDeep(this.initForm)
      await this.$nextTick()
      this.$refs.form.clearValidate()
      console.log(1)
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less"></style>
