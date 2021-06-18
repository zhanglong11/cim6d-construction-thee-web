<template>
  <el-dialog title="详情" width="1400px" top="10vh" :visible="visible" @close="$emit('update:visible', false)">
    <div class="body-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <DetailItem label="危险源名称" :value="info.dangerSource"></DetailItem>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <DetailItem label="伤害类型" :value="$getLabel(harmTypeList, info.harmCategory)"></DetailItem>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <DetailItem label="防范措施" :value="info.precautionaryMeasure"></DetailItem>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <DetailItem label="备注" :value="info.remark"></DetailItem>
        </el-col>
      </el-row>
      <!--附件-->
      <el-row :gutter="20">
        <el-col>
          <DetailItem label="附件"><FileTable :ids="info.fileId"></FileTable></DetailItem>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <DetailItem label="创建人" :value="info.creatorName"></DetailItem>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <DetailItem label="创建时间" :value="info.createTime"></DetailItem>
        </el-col>
      </el-row>
      <DangerLocation ref="location" :locationData="info.placeList" :isEdit="false"></DangerLocation>
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
import DangerLocation from './dangerLocation'
export default {
  name: 'DangerDetail',
  components: { DetailItem, FileTable, DangerLocation },
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
      info: {}
    }
  },
  computed: {
    //伤害类型
    harmTypeList() {
      return this.$getArgList('harmType') || []
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
      let res = await Api.getDangerDetail(this.id)
      this.info = res.data
    },
    async handleSave() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
</style>
