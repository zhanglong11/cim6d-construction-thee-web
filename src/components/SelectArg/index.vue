<!--
 -->
<template>
  <el-select :value="value" :disabled="disabled" :multiple="multiple" @change="val => $emit('input', val)">
    <template v-if="hasAll">
      <el-option :value="null" label="全部"> </el-option>
    </template>
    <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value"> </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'SelectArg',
  props: {
    hasAll: {
      type: Boolean,
      default: false
    },
    value: [String, Number, Array],
    disabled: {
      type: Boolean,
      default: false
    },
    argGroup: {
      type: String,
      required: true
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 过滤函数，过滤其中的选项
    filter: {
      type: Function,
      default: null
    }
  },
  computed: {
    list() {
      let list = this.$store.state.systemConfig.config[this.argGroup]?.children
      if (this.filter) {
        list = list.filter(this.filter)
      }
      return list
    }
  }
}
</script>
<style lang="less" scoped></style>
