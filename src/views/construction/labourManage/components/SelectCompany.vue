<template>
  <el-select :value="value" :disabled="disabled" @change="val => $emit('input', val)">
    <template v-if="hasAll">
      <el-option :value="null" label="全部"></el-option>
    </template>
    <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
import Api from '../api/labour-api'
export default {
  name: 'SelectCompany',
  props: {
    hasAll: {
      type: Boolean,
      default: false
    },
    value: [String, Number],
    disabled: {
      type: Boolean,
      default: false
    },
    status: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      list: []
    }
  },
  created() {
    Api.getLabourCompanyList({ page: 1, rows: 100000, projectId: localStorage.getItem('projectId') }).then(res => {
      this.list = res.data.records
    })
  }
}
</script>
<style lang="less" scoped></style>
