<template>
  <el-select filterable :value="value" :disabled="disabled" @change="val => $emit('input', val)">
    <template v-if="hasAll">
      <el-option :value="null" label="全部"></el-option>
    </template>
    <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'SelectNation',
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
  computed: {
    options() {
      return this.$store.state.labour.nation
    }
  }
}
</script>
<style lang="less" scoped></style>
