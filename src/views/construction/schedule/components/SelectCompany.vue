<template>
  <TreeSelect
    :value="value"
    :options="list"
    :multiple="multiple"
    :valueFormat="valueFormat"
    :defaultExpandLevel="1"
    loading-text="加载中..."
    no-options-text="没有选项..."
    no-results-text="没有匹配的选项..."
    noChildrenText="没有子项了"
    placeholder="请选择"
    style="width: 100%"
    flat
    @input="
      val => {
        $emit('input', val)
      }
    "
    @select="
      node => {
        $emit('update:id', node && node.dataUnicode)
      }
    "
  />
</template>

<script>
import { roleApi } from '@/views/company/api/role'
import toTree from '@/utils/toTree'
export default {
  name: 'SelectDepart',
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: [String, Number, Array, Object],
    valueFormat: {
      type: String,
      default: 'object',
      enum: ['id', 'object']
    }
  },
  data() {
    return {
      list: []
    }
  },
  async created() {
    this.getPartiesRecordList()
  },
  methods: {
    // 获取项目参与方数据
    async getPartiesRecordList() {
      let { data } = await roleApi.getCompanyList({ typeList: [1, 2, 3] }, this.$store.state.projectId)
      data = _.filter(data, ({ participantType, organType }) => participantType === 2 && organType !== 1)
      data.forEach(item => {
        item.label = item.dataName
      })
      this.list = toTree(data, 'parentId')
    }
  }
}
</script>
<style lang="less" scoped>
.vue-treeselect {
  display: inline-block;
  width: 215px;
  font-size: unset;
}
</style>
