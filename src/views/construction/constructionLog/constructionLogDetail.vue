<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>施工日志详情</span>
        <PreviewDownload
          v-if="$hasPower('ConstructionLogPreviewDownload')"
          :id="id"
          type="construction"
          fileName="施工日志"
          url="/dailydiary/download"
        />
      </div>

      <div class="content">
        <el-row class="row" :gutter="40">
          <el-col :span="8">
            编制日期:
            <span>{{ details.diaryDate | formatData }}</span>
          </el-col>
          <el-col :span="8">
            工程名称: <span>{{ details.name }}</span>
          </el-col>
          <el-col :span="8">
            日志编号: <span>{{ details.code }}</span>
          </el-col>
        </el-row>

        <el-row class="row" :gutter="40">
          <el-col :span="8">
            项目负责人: <span>{{ details.chargePersonName }}</span>
          </el-col>
          <el-col :span="8">
            记录人: <span>{{ details.creatorName }}</span>
          </el-col>
          <el-col :span="8">
            施工人员: <span>{{ details.constructionPersonNames }}</span>
          </el-col>
        </el-row>

        <el-row class="row" :gutter="40">
          <el-col :span="8">
            施工人数: <span>{{ details.constructionPersonCount }}</span>
          </el-col>
          <el-col :span="8">
            天气: <span>{{ details.todayWeather }}</span>
          </el-col>
          <el-col :span="8">
            温度 ℃:
            <span v-if="details.lowTemperature">{{ details.lowTemperature }} ~ {{ details.highTemperature }}</span>
          </el-col>
        </el-row>

        <el-row class="row" :gutter="40">
          <el-col :span="8">
            施工工程及内容: <span>{{ details.costructionContent }}</span>
          </el-col>
          <el-col :span="8">
            质量情况: <span>{{ details.qualityProblem }}</span>
          </el-col>
        </el-row>

        <el-row class="row" :gutter="40">
          <el-col :span="8">
            安全情况: <span>{{ details.safetyProblem }}</span>
          </el-col>
          <el-col :span="8">
            进度情况: <span>{{ details.constructionProgress }}</span>
          </el-col>
          <el-col :span="8">
            抄送人: <span>{{ details.copyToPersonName }}</span>
          </el-col>
        </el-row>

        <el-row class="row">
          备注: <span>{{ details.remark }}</span>
        </el-row>
        <el-row class="row" type="flex">
          <span>附件: </span>

          <span> <FileList :ids="details.fileIds" /></span>
        </el-row>
      </div>

      <div class="footer-btn">
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import Api from './api/constructionLog'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'ConstructionLogDetail',
  components: {},
  data() {
    return {
      id: this.$route.query.id || '',
      details: {}
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    this.getData()
  },
  // 方法集合
  methods: {
    // 获取施工日志详情
    async getData() {
      if (!this.id) {
        return
      }
      let result = await Api.getLogDetail(this.id)
      this.details = result.data
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.header {
  border-bottom: 1px solid #ddd;
}
.content {
  font-size: 14px;
  margin-left: 40px;
  line-height: 25px;
  .row {
    margin: 14px 0;
  }
}
.back {
  float: right;
  margin-right: 50px;
}
</style>
