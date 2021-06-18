<template>
  <el-card class="box-card" shadow="never" style="margin: 10px">
    <div slot="header" class="clearfix">
      <span>检查{{ info.result === 0 ? '不合格' : '合格' }}</span>
      <el-button style="float: right; padding: 3px 0" type="text"></el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="16">
        <DetailItem label="检查结果">
          <el-radio-group :value="info.result" disabled class="from-item">
            <el-radio :label="1">合格</el-radio>
            <el-radio :label="0">不合格</el-radio>
          </el-radio-group>
        </DetailItem>
      </el-col>
      <template v-if="info.result === 1">
        <el-col :span="16">
          <DetailItem label="现场照片"><FileTable :ids="info.fileIds"></FileTable></DetailItem>
        </el-col>
        <el-col :span="16">
          <DetailItem label="备注" :value="info.remark"></DetailItem>
        </el-col>
      </template>
      <template v-else>
        <el-col :span="16">
          <DetailItem label="所在位置" :value="info.location"> </DetailItem>
        </el-col>
        <el-col :span="16">
          <DetailItem label="危险源时效性">{{ info.dangerStartTime | ymd }}~{{ info.dangerEndTime | ymd }}</DetailItem>
        </el-col>
        <el-col :span="16">
          <DetailItem label="问题描述">{{ info.desc }} </DetailItem>
        </el-col>
        <el-col :span="16">
          <DetailItem label="现场照片"><FileTable :ids="info.fileIds"></FileTable></DetailItem>
        </el-col>
        <el-col :span="16">
          <DetailItem label="整改期限">{{ info.deadline | ymd }}</DetailItem>
        </el-col>
      </template>
    </el-row>
  </el-card>
</template>

<script>
import DetailItem from '@/views/construction/quality/components/detailItem'
import FileTable from '@/views/construction/quality/components/fileTable'
export default {
  name: 'ReviewDetail',
  components: { DetailItem, FileTable },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
@import '../index.less';
</style>
