<template>
  <el-dialog
    title="详情"
    width="1000px"
    top="12vh"
    :visible="visible"
    append-to-body
    @close="$emit('update:visible', false)"
  >
    <div class="body-container">
      <el-row :gutter="20">
        <el-col :span="24">
          <DetailItem label="问题部位" :value="info.code"></DetailItem>
        </el-col>
        <el-col :span="24">
          <DetailItem label="问题描述" :value="info.code"></DetailItem>
        </el-col>
        <el-col :span="24">
          <DetailItem label="照片"> <FileTable :ids="info.fileIds"></FileTable></DetailItem>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api'
import DetailItem from '@/views/construction/quality/components/detailItem'
import FileTable from '@/views/construction/quality/components/fileTable' //附件
export default {
  name: 'AddPlanModal',
  components: { DetailItem, FileTable },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      info: {
        code: 111,
        fileIds: '1,2,3',
        tableData: [
          { id: 1, name: '111' },
          { id: 2, name: '222' }
        ]
      },
      issueData: [] //问题列表
    }
  },
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    //获取详情
    async getDetail() {
      //let res = await Api.getPlanDetail(this.id)
      //this.info = res
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
</style>
