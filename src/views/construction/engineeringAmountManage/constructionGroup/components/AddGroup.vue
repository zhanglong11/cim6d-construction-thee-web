<template>
  <el-dialog
    :title="_.isEmpty(info) ? '新建班组' : '修改班组'"
    width="600px"
    class="middle-v"
    :visible="visible"
    :close-on-click-modal="false"
    @close="$emit('update:visible', false)"
  >
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="施工班组名称" prop="name">
        <el-input v-model="form.name" class="from-item" placeholder="请输入施工班组名称" />
      </el-form-item>
      <el-form-item label="所属公司" prop="belongCompanyId">
        <el-input v-model="form.belongCompanyId" class="from-item" placeholder="请输入所属公司" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" class="from-item" type="textarea" :rows="3" placeholder="请输入备注" />
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
  name: 'AddGroup',
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
      rules: {
        name: [{ required: true, message: '必填' }],
        belongCompanyId: [{ required: true, message: '必填' }],
        unit: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {},
  methods: {
    //点击确定
    async handleSave() {
      await this.$refs['form'].validate()
      this.$emit('submit', { ...this.form })
    }
  }
}
</script>

<style lang="less" scoped>
.from-item {
  width: 400px;
}
</style>
