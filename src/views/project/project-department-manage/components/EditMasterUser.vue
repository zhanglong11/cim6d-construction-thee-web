<template>
  <el-dialog
    width="600px"
    :title="id ? '编辑' : '新建'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="角色" disabled>
        <el-input v-model="form.parentName" disabled></el-input>
      </el-form-item>
      <el-form-item label="选择人员" prop="dataUnicode">
        <el-select v-model="form.dataUnicode" style="width: 100%">
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :value="item.userId"
            :label="item.realName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 2 }"></el-input>
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

export default {
  name: 'EditMasterUser',
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
      userList: [],
      form: {
        parentName: '',
        parent: {}
      },
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
      if (this.visible) {
        this.form = _.cloneDeep(val)
        this.rules.dataUnicode[0].required = this.projectUserCategory === 1
        await this.$nextTick()
        this.$refs.form.clearValidate()
        this.refresh()
      }
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据
    async refresh() {
      projectApi.queryRoleSelectUser(this.form.parentId).then(res => {
        if (this.id) {
          res.data.push({ userId: this.form.dataUnicode, realName: this.form.realName })
        }
        this.userList = res.data
      })
    },
    //提交表单
    async submit() {
      await this.$refs.form.validate()
      if (this.id) {
        await projectApi.replaceRoleUser(_.pick(this.form, ['id', 'dataUnicode', 'remark']))
      } else {
        await projectApi.addRoleUser(_.pick(this.form, ['parentId', 'dataUnicode', 'remark']))
      }
      this.$message.success('成功')
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
