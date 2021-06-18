<template>
  <el-dialog title="接收人及状态" class="beauty" width="800px" :visible="visible" @close="close">
    <div>
      <el-input v-model="q" placeholder="请输入接收人" style="width: 200px; margin-bottom: 15px"></el-input>
      <el-button style="margin-left: 10px" type="primary">查询</el-button>
    </div>
    <el-row :gutter="20" type="flex">
      <el-col :span="14">
        <h2>已读 ({{ readList.length }})</h2>
        <vxe-table :data="readList" max-height="600">
          <vxe-table-column title="接收人" field="receiverName"></vxe-table-column>
          <vxe-table-column title="已读时间" field="readTime"></vxe-table-column>
        </vxe-table>
      </el-col>
      <el-col :span="10">
        <h2>未读 ({{ unreadList.length }})</h2>
        <vxe-table :data="unreadList" max-height="600">
          <vxe-table-column title="接收人" field="receiverName"></vxe-table-column>
        </vxe-table>
      </el-col>
    </el-row>
    <footer slot="footer">
      <el-button @click="close">我知道了</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { getReceiverList } from '../api/wechat'

export default {
  name: 'RecipientAndStatus',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    id: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    // 这里存放数据
    return {
      q: '',
      list: []
    }
  },
  computed: {
    computedList() {
      if (this.q) {
        return this.list.filter(({ receiverName }) => receiverName.includes(this.q))
      } else {
        return this.list
      }
    },
    readList() {
      return _.filter(this.computedList, { readStatus: 1 })
    },
    unreadList() {
      return _.filter(this.computedList, { readStatus: 0 })
    }
  },
  watch: {
    visible(val) {
      if (val) this.refresh()
    }
  },
  // 方法集合
  methods: {
    // 刷新主要数据
    async refresh() {
      getReceiverList(this.id).then(res => {
        this.list = res.data
      })
    },
    //关闭弹窗
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
/deep/ .el-dialog {
  .el-dialog__body {
    padding: 10px 20px;
  }
}
.el-row {
  .el-col {
    h2 {
      font-weight: normal;
      font-size: 18px;
      margin-bottom: 15px;
    }
    &:first-child {
      border-right: 1px solid #ddd;
    }
  }
}
</style>
