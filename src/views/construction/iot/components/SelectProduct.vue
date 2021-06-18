<template>
  <el-select :value="value" :disabled="disabled" @change="val => $emit('input', val)">
    <template v-if="hasAll">
      <el-option :value="null" label="全部"></el-option>
    </template>
    <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
import Api from '../api/iot-api'
export default {
  name: 'SelectProduct',
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
    Api.getIotProductList({}).then(res => {
      this.list = res.data.records
    })
  }
}
</script>
<style lang="less" scoped></style>
