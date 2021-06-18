<template>
  <el-dialog
    :title="_.isEmpty(info) ? '新建工程' : '修改工程'"
    width="600px"
    class="middle-v"
    :visible="visible"
    :close-on-click-modal="false"
    @close="$emit('update:visible', false)"
  >
    <el-form ref="form" :model="form" label-width="90px" :rules="rules">
      <el-form-item label="工程名称" prop="name">
        <el-input v-model="form.name" class="from-item" placeholder="请输入工程名称" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button v-promise-btn type="primary" @click="handleSave">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddEngineer',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: { ...this.info },
      rules: { name: [{ required: true, message: '必填' }] }
    }
  },
  created() {},
  methods: {
    //点击确定
    async handleSave() {
      await this.$refs['form'].validate()
      this.$emit('submit', this.form)
    }
  }
}
</script>

<style lang="less" scoped>
.from-item {
  width: 400px;
}
</style>
