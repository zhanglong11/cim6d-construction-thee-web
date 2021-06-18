<template>
  <div>
    <el-tabs v-model="tabIndex">
      <el-tab-pane v-if="$hasPower('FormManage')" label="表单管理" name="form">
        <FormManage />
      </el-tab-pane>
      <el-tab-pane v-if="$hasPower('FormStyle')" label="审批样式库" name="style">
        <FormStyle />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FormManage from './components/formManage'
import FormStyle from './components/formStyle'

export default {
  components: {
    FormManage,
    FormStyle
  },
  data() {
    return {
      tabIndex: this.$route.query.type || this.$hasPower('FormManage') ? 'form' : 'style'
    }
  }
}
</script>
