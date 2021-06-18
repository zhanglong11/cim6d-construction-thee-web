<template>
  <el-dialog
    width="800px"
    class="beauty"
    top="10vh"
    title="详情"
    append-to-body
    :close-on-click-modal="false"
    :visible="visible"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="区域名称">
        {{ form.name }}
      </el-form-item>

      <!--      <el-form-item label="区域类型">-->
      <!--        {{ $getLabelFromArg('projectType', form.type) }}-->
      <!--      </el-form-item>-->

      <el-form-item label="区域负责人">
        {{ form.principalName }}
      </el-form-item>

      <!--      <el-form-item label="父级区域">-->
      <!--        {{ form.title }}-->
      <!--      </el-form-item>-->

      <el-form-item label="备注">
        {{ form.remark }}
      </el-form-item>

      <el-form-item label="附件">
        <FileList :ids="form.fileId" />
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button type="primary" @click="close">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import Api from '../api'
export default {
  name: 'AddDialog',
  props: {
    visible: {
      type: Boolean
    },
    id: {}
  },
  data() {
    // 这里存放数据
    return {
      form: {},
      rules: {
        title: [{ required: true, message: '必填' }],
        content: [{ required: true, message: '必填' }],
        personId: [{ required: true, message: '必填' }]
      },
      typeList: [
        {
          label: '紧急',
          value: 1
        },
        {
          label: '高',
          value: 2
        },
        {
          label: '中',
          value: 3
        }
      ]
    }
  },
  // 生命周期 - 挂载完成
  created() {
    if (!this.id) return
    this.refresh()
  },
  // 方法集合
  methods: {
    //刷新
    async refresh() {
      const res = await Api.detail(this.id)
      this.form = res.data
    },
    //关闭
    close() {
      this.$emit('update:visible', false)
    },
    //提交
    async submit() {
      await this.$refs.form.validate()
      let cloneData = _.cloneDeep(this.form)
      await Api.add(cloneData)
      this.$message.success('操作成功')
      this.close()
      this.$parent.refresh()
    }
  }
}
</script>

<style scoped></style>
