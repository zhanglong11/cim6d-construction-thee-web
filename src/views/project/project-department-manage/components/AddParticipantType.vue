<template>
  <el-dialog :close-on-click-modal="false" title="新建" width="500px" :visible="visible" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="参与方性质" prop="participantsNatures">
        <SelectArg
          v-model="form.participantsNatures"
          style="width: 100%"
          multiple
          :filter="filter"
          :arg-group="`${projectType}_participantType`"
        ></SelectArg>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button v-promise-btn type="primary" @click="submit">创建</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { projectApi } from '../../api/project'

export default {
  name: 'AddParticipantType',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    parentId: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      required: true
    },
    existsParticipantTypes: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    // 这里存放数据
    return {
      form: {
        participantsNatures: []
      },
      rules: {
        participantsNatures: [{ required: true, message: '必填' }]
      }
    }
  },
  computed: {
    projectType() {
      return this.$store.state.project.projectType
    }
  },
  // 方法集合
  methods: {
    //提交表单
    async submit() {
      await this.$refs.form.validate()
      await projectApi.addParticipantsNature({ ...this.form, parentId: this.parentId })
      await this.close()
      this.$emit('change')
      this.$message.success('添加成功')
    },
    //关闭弹窗
    close() {
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    },
    // 过滤参与方选项，已有的隐藏
    filter(item) {
      return !this.existsParticipantTypes.includes(item.value)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
</style>
