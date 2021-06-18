<template>
  <div>
    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column field="name" title="设备的Topic" />
      <vxe-table-column field="permitStr" title="设备具有的权限" />
      <vxe-table-column field="num" title="发布消息数">
        <template slot="header"
          >发布消息数
          <el-tooltip placement="top" :content="Hint.device.FABUXIAOXISHU"
            ><el-icon class="el-icon-question" /></el-tooltip
        ></template>
      </vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button
            type="text"
            @click="
              () => {
                activeRow = row
                SendMessageDialogVisible = true
              }
            "
            >发布消息</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>
    <SendMessage :topic="activeRow" :visible.sync="SendMessageDialogVisible" />
  </div>
</template>

<script>
import Hint from '../../Hint'
import SendMessage from './SendMessage'
export default {
  name: 'Topic',
  components: { SendMessage },
  data() {
    return {
      Hint,
      SendMessageDialogVisible: false,
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      activeRow: {},
      request(body) {
        return Promise.resolve({
          total: 2,
          records: [
            { id: '1', name: '/sys/a1JQT0LLieH/device1109/thing/event/property/post', permitStr: '发布', num: '0' },
            { id: '2', name: '/sys/a1JQT0LLieH/device1109/thing/service/property/set', permitStr: '订阅', num: '0' }
          ]
        })
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
    }
  }
}
</script>

<style scoped lang="less"></style>
