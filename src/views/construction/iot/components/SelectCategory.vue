<template>
  <el-cascader
    :props="{
      label: 'name',
      value: 'id',
      emitPath: false
    }"
    :options="list"
    :value="value"
    @change="val => $emit('input', val)"
  ></el-cascader>
</template>

<script>
import Api from '../api/iot-api'
export default {
  name: 'SelectCategory',
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
      list: []
    }
  },
  created() {
    Api.getIotProductTemplateList({}).then(res => {
      this.list = res.data
    })
  }
}
</script>
<style lang="less" scoped></style>
