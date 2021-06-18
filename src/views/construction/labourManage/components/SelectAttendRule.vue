<template>
  <el-select :value="value" :disabled="disabled" @change="val => $emit('input', val)">
    <template v-if="hasAll">
      <el-option :value="null" label="全部"></el-option>
    </template>
    <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
import Api from '../../healthy/api/work-bench'
export default {
  name: 'SelectAttendRule',
  props: {
    hasAll: {
      type: Boolean,
      default: false
    },
    value: [String, Number],
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      list: []
    }
  },
  created() {
    Api.getLabourAttendRuleList({ page: 1, rows: 10000, projectId: this.projectId }).then(res => {
      this.list = res.data.records
    })
  }
}
</script>
<style lang="less" scoped></style>
