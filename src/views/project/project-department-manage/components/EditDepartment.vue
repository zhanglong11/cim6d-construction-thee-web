<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="id ? '编辑' : '新建'"
    :visible="visible"
    width="600px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="上级机构名称" disabled>
        <el-input v-model="form.parentName" disabled></el-input>
      </el-form-item>
      <el-form-item v-if="!id" label="类型" prop="organType">
        <el-radio-group v-model="form.organType">
          <el-radio :label="4">机构/子机构</el-radio>
          <el-radio v-if="form.organType !== 4" :label="5">角色</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.organType === 4" label="机构名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item v-else label="角色名称" prop="roleIds">
        <el-select v-model="form.roleIds" style="width: 100%" placeholder="请选择" multiple>
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
      <el-button v-promise-btn type="primary" @click="submit">{{ id ? '保存' : '创建' }}</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { projectApi } from '../../api/project'
import toTree from '@/utils/toTree'
export default {
  name: 'AddDepartment',
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
      form: {
        parentId: '',
        organType: null,
        name: '',
        roleIds: []
      },
      roleGroup: [],
      rules: {
        name: [{ required: true, message: '必填' }],
        roleIds: [{ required: true, message: '必填' }],
        organType: [{ required: true, message: '必填' }]
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
      console.log(444, val)
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
      if (this.form.id) {
        await projectApi.updateOrgan(_.pick(this.form, ['id', 'name']))
        await this.$message.success('修改成功')
      } else {
        await projectApi.addOrganOrRole(_.omit(this.form, ['parentName', 'children']))
        await this.$message.success('添加成功')
      }
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
