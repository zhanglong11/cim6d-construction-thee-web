<template>
  <div>
    <el-dialog
      class="beauty"
      title="打卡详情"
      :visible="visible"
      width="680px"
      :close-on-click-modal="false"
      @close="close"
    >
      <div class="desc">
        <el-row :gutter="4">
          <el-col :span="12">
            <span class="desc-label">姓名:</span>
            <span>{{ dateListNames }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="4">
          <!-- <span v-for="(item, index) of exceptionList" :key="index" style="font-size: 14px">
            <el-col :span="12">
              <span class="desc-label">日期：{{ item.date ? moment(item.date).format('YYYY-MM-DD') : '' }}</span>
              <span>打卡状态：{{ $getLabel(kaoqinStausList, item.status) }}</span>
            </el-col>
          </span> -->
          <el-table ref="table" class="table" max-height="280" stripe :data="exceptionList">
            <el-table-column prop="date" label="日期" align="center" />
            <el-table-column prop="status" label="打卡状态" align="center" show-overflow-tooltip>
              <template #default="{ row }">
                {{ $getLabel(kaoqinStausList, row.status) }}
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </div>
      <footer slot="footer">
        <el-button type="primary" @click="close">取消</el-button>
      </footer>
    </el-dialog>
  </div>
</template>
<script>
import Api from '../api'
import kaoqinStausList from '../lib/kaoqinStausList'
export default {
  name: 'MyDetail',
  components: {},
  props: {
    // 弹窗是否显示
    visible: {
      default: false,
      type: Boolean
    },
    dateListNames: {
      default: '',
      type: String
    },
    type: {
      default: '',
      type: String
    },
    queryTimes: {
      default: '',
      type: String
    },
    mobileUid: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      kaoqinStausList,
      // 表单数据
      form: {},
      exceptionList: []
    }
  },
  watch: {
    async visible(val) {
      this.form.attendanceGroupType = this.type
      this.form.userId = this.mobileUid
      this.form.queryTime = this.queryTimes
      if (val) {
        Api.getDetailKaopin(this.form).then(res => {
          this.exceptionList = res.data || []
        })
      }
    }
  },
  methods: {
    // 关闭弹窗
    close() {
      this.$emit('update:visible', false)
    },
    refresh() {}
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
.el-col {
  margin-bottom: 25px;
  font-size: 16px;
}
.desc-label {
  margin-right: 10px;
}
</style>
