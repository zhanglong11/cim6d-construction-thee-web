<template>
  <el-select v-if="!radio" filterable v-bind="$attrs" v-on="$listeners" @change="handleChange">
    <el-option v-if="hasAll" label="全部" :value="null"></el-option>
    <el-option
      v-for="item in argGroup ? argGroupOptions : options"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    ></el-option>
  </el-select>
  <el-radio-group v-else v-bind="$attrs" v-on="$listeners" @change="handleChange">
    <el-radio v-for="item in argGroup ? argGroupOptions : options" :key="item.value" :label="item.value">
      {{ item.label }}
    </el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: 'Select',
  props: {
    options: {
      type: Array,
      default() {
        return []
      }
    },
    argGroup: {
      type: String,
      default: null
    },
    hasAll: {
      type: Boolean,
      default: false
    },
    // 是否以radio的样式显示,与hasAll = true 冲突
    radio: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      argGroupOptions: []
    }
  },
  created() {
    if (this.argGroup) this.refresh()
  },
  methods: {
    handleChange(value) {
      this.$emit(
        'update:label',
        _.find(this.options, { value })?.label || _.find(this.argGroupOptions, { value })?.label
      )
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.el-select {
  width: 100%;
}
</style>
