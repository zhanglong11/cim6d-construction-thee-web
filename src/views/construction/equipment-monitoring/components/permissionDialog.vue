<template>
  <el-dialog
    width="500px"
    class="beauty"
    top="10vh"
    title="权限"
    append-to-body
    :close-on-click-modal="false"
    :visible="visible"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="参与方公司" prop="permission">
        <el-select v-model="form.permission" multiple placeholder="请选择">
          <el-option-group v-for="group in permissonList" :key="group.participantType" :label="group.participantType">
            <el-option
              v-for="item in group.companys"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button v-promise-btn type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import Api from '../api/work-bench'
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
      form: {
        permission: []
      },
      rules: {
        permission: [{ required: true, message: '必填' }]
      },
      permissonList: []
    }
  },
  // 生命周期 - 挂载完成
  created() {
    this.refresh()
  },
  // 方法集合
  methods: {
    async getSelectData() {
      const res = await Api.getList()
      this.permissonList = res.data
    },
    //刷新
    async refresh() {
      await this.getSelectData()
      const res = await Api.getMonitorDetail(this.id)
      if (res.data.companyIdList.length) {
        this.form.permission = res.data.companyIdList
      }
    },
    //关闭
    close() {
      this.$emit('update:visible', false)
    },
    //提交
    async submit() {
      await this.$refs.form.validate()
      let cloneData = _.cloneDeep(this.form.permission)
      await Api.setAuthCompany({ id: this.id, companyIdList: cloneData })
      this.$message.success('操作成功')
      this.close()
      this.$parent.refresh()
    }
  }
}
</script>

<style scoped></style>
