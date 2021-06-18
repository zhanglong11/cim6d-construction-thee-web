<template>
  <div>
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column field="sendTime" title="推送时间" />
      <vxe-table-column field="powerKey" title="功能模块" :formatter="getPowerName" />
      <vxe-table-column field="mechanismType" title="推送机制">
        <template #default="{ row }">
          <span>{{ $getLabelFromArg('push_mechanism', row.mechanismType) }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="sendCount" title="推送消息数量" />
      <vxe-table-column title="操作" fixed="right">
        <template #default="{ row }">
          <el-button type="text" @click="showDetail(row.id)">查看接收人及状态</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <RecipientAndStatus :id="activeId" :visible.sync="recipientAndStatusDialogVisible"></RecipientAndStatus>
  </div>
</template>

<script>
import { getWeChatMessageList } from '../api/wechat'
import RecipientAndStatus from './RecipientAndStatus'

export default {
  name: 'WeChatMessage',
  // import引入的组件需要注入到对象中才能使用
  components: { RecipientAndStatus },
  data() {
    // 这里存放数据
    return {
      activeId: null,
      filterForm: {},
      request: body => {
        return getWeChatMessageList(body)
      },
      recipientAndStatusDialogVisible: false
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {},
    showDetail(id) {
      this.activeId = id
      this.recipientAndStatusDialogVisible = true
    },
    getPowerName({ cellValue: powerKey }) {
      return _.find(this.$store.state.userPower.powerFlatList, { powerKey })?.powerName ?? '-'
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color';
</style>
