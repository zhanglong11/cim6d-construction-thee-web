<template>
  <el-card class="box-card" shadow="never" style="margin: 10px">
    <div slot="header" class="clearfix">
      <span>问题整改</span>
      <el-button style="float: right; padding: 3px 0" type="text"></el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="16">
        <DetailItem label="整改方法" :value="info.rectifyContent"></DetailItem>
      </el-col>
      <el-col :span="16">
        <DetailItem label="现场照片"><FileTable :ids="info.fileIds"></FileTable></DetailItem>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import DetailItem from '@/views/construction/quality/components/detailItem'
import FileTable from '@/views/construction/quality/components/fileTable'
export default {
  name: 'RectifyForm',
  components: { DetailItem, FileTable },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  created() {
    console.log(this.info)
  },
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
@import '../index.less';
</style>
