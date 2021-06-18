<template>
  <el-dialog :close-on-click-modal="false" title="编辑角色" :visible="visible" width="500px" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="roleIds">
        <el-select v-model="form.dataUnicode" style="width: 100%" placeholder="请选择">
          <el-option-group v-for="group in roleGroup" :key="group.name" :label="group.name">
            <el-option
              v-for="item in group.children"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="!!item.directorFlag || !!_.find(form.children, { dataUnicode: item.id })"
            >
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button v-promise-btn type="primary" @click="submit">保存</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { projectApi } from '../../api/project'
import toTree from '@/utils/toTree'
export default {
  name: 'EditRole',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    // 这里存放数据
    return {
      form: {},
      roleGroup: [],
      rules: {
        dataUnicode: [{ required: true, message: '必填' }]
      }
    }
  },
  computed: {
    id() {
      return this.form.id
    }
  },
  watch: {
    async data(val) {
      this.form = _.cloneDeep(val)
      await this.$nextTick()
      this.$refs.form.clearValidate()
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
    this.getRoleTree()
  },
  // 方法集合
  methods: {
    getRoleTree() {
      projectApi.queryListAllProjectRole({}).then(res => {
        this.roleGroup = toTree(res.data, 'parentId')
      })
    },
    //提交表单
    async submit() {
      await this.$refs.form.validate()
      await projectApi.replaceRole(_.pick(this.form, ['id', 'dataUnicode']))
      await this.$message.success('修改成功')
      this.$emit('change')
      this.close()
    },
    //关闭弹窗
    close() {
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
</style>
