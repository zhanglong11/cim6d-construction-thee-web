<template>
  <el-dialog
    :title="_.isEmpty(info) ? '新建结构' : '修改结构'"
    width="600px"
    class="middle-v"
    :visible="visible"
    :close-on-click-modal="false"
    @close="$emit('update:visible', false)"
  >
    <el-form ref="form" :model="form" label-width="90px" :rules="rules">
      <el-form-item label="结构名称" prop="name">
        <el-input v-model="form.name" class="from-item" placeholder="请输入结构名称" />
      </el-form-item>
      <el-form-item label="所属工程" prop="pid">
        <el-select v-model="form.pid" class="from-item">
          <el-option
            v-for="(item, index) of engineerList"
            :key="'EL' + index"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
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
  name: 'AddStructure',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    },
    engineerList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: { ...this.info },
      rules: {
        name: [{ required: true, message: '必填' }],
        pid: [{ required: true, message: '必选' }]
      }
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
