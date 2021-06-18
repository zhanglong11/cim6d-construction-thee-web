<template>
  <div class="detail-container">
    <el-card class="box-card" shadow="never" style="margin: 10px">
      <div slot="header" class="clearfix">
        <span>危险源详情</span>
        <el-button style="float: right; padding: 3px 0" type="text"></el-button>
      </div>
      <div>
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
        <el-row :gutter="20">
          <el-col :span="16">
            <DangerLocation ref="location" v-model="info.placeList" :isEdit="false"></DangerLocation>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <div class="footer-btn">
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from './api'
import DetailItem from '@/views/construction/quality/components/detailItem'
import FileTable from '@/views/construction/quality/components/fileTable' //附件
import DangerLocation from './components/dangerLocation'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'DangerDetail',
  components: { DetailItem, FileTable, DangerLocation },
  data() {
    // 这里存放数据
    return {
      projectId: localStorage.getItem('projectId'),
      id: this.$route.query.id || '',
      info: {}
    }
  },
  computed: {
    //伤害类型
    harmTypeList() {
      return this.$getArgList('harmType') || []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  created() {
    this.getDetail()
  },
  // 方法集合
  methods: {
    //获取详情
    async getDetail() {
      let res = await Api.getDangerDetail(this.id)
      this.info = res.data
    },
    //返回
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
