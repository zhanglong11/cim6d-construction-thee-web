<template>
  <el-dialog
    width="800px"
    class="beauty"
    top="10vh"
    :title="!id ? '新建' : '编辑'"
    append-to-body
    :close-on-click-modal="false"
    :visible="visible"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="区域名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>

      <!--      <el-form-item label="区域类型" prop="title">-->
      <!--        <SelectList v-model="form.urgency" :self-list="areaTypeList" :has-all-option="false" />-->
      <!--      </el-form-item>-->

      <el-form-item label="区域负责人" prop="principalId">
        <SelectUser v-model="form.principalId" value-format="id" placeholder="请选择" :multiple="false" />
      </el-form-item>

      <!--      <el-form-item label="父级区域" prop="title">-->
      <!--        <SelectList v-model="form.urgency" :self-list="typeList" :has-all-option="false" />-->
      <!--      </el-form-item>-->

      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>

      <el-form-item label="附件" prop="fileId">
        <FileEdit v-model="form.fileId" />
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button v-promise-btn type="primary" @click="submit">确认</el-button>
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
        name: [{ required: true, message: '必填' }],
        principalId: [{ required: true, message: '必填' }]
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
  computed: {
    areaTypeList() {
      return this.$getArgList('workMeetingType') || []
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
      this.id ? await Api.update(cloneData) : await Api.add(cloneData)
      this.$message.success('操作成功')
      this.close()
      this.$parent.refresh()
    }
  }
}
</script>

<style scoped></style>
