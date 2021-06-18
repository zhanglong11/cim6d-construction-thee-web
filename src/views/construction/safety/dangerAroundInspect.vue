<template>
  <div class="detail-container">
    <el-card class="box-card" shadow="never" style="margin: 10px">
      <div slot="header" class="clearfix">
        <span>危险源信息</span>
        <el-button style="float: right; padding: 3px 0" type="text"></el-button>
      </div>
      <div>
        <el-form ref="form" label-width="150px" :model="form" :rules="formRules">
          <!--<el-card class="box-card" shadow="never" style="margin: 10px">
            <div slot="header" class="clearfix">
              <span>危险源信息</span>
              <el-button style="float: right; padding: 3px 0" type="text"></el-button>
            </div>
            <div>-->
          <el-form-item label="危险源名称" prop="dangerSourceId">
            <el-select v-model="form.dangerSourceId" class="from-item">
              <el-option
                v-for="(item, index) of dangerList"
                :key="'ss' + index"
                :value="item.id"
                :label="item.dangerSource"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="伤害类型" prop="harmCategoryLabel">
            <el-input
              v-model="form.harmCategoryLabel"
              placeholder="选择危险源名称后自动带出"
              disabled
              class="from-item"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="防范措施" prop="precautionaryMeasure">
            <el-input
              v-model="form.precautionaryMeasure"
              placeholder="选择危险源名称后自动带出"
              disabled
              class="from-item"
            >
            </el-input>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="24">
              <DetailItem label="附件"> <FileTable :ids="fileIds"></FileTable></DetailItem>
            </el-col>
          </el-row>
          <!--</div>
          </el-card>-->
        </el-form>
      </div>
    </el-card>
    <!--时间轴 start-->
    <FlowLine :info="{}"></FlowLine>
    <!--时间轴  end-->
    <CheckForm ref="checkForm" :sourceId="form.dangerSourceId"></CheckForm>
    <div class="footer-btn">
      <el-button @click="goBack">返回</el-button>
      <el-button v-promise-btn :disabled="!form.dangerSourceId" type="primary" @click="handleSave">保 存</el-button>
    </div>
  </div>
</template>

<script>
import Api from './api'
import DetailItem from '@/views/construction/quality/components/detailItem'
import FileTable from '@/views/construction/quality/components/fileTable' //附件
import CheckForm from './components/checkForm' //巡检检查表单
import FlowLine from './components/flowLine' //检查流程
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'DangerAroundInspect',
  components: { DetailItem, FileTable, FlowLine, CheckForm },
  data() {
    // 这里存放数据
    return {
      projectId: localStorage.getItem('projectId'),
      form: { dangerSourceId: '' },
      formRules: { dangerSourceId: [{ required: true, message: '请选择危险源', trigger: 'change' }] },
      dangerList: [], //危险源名称
      fileIds: ''
    }
  },
  computed: {
    //伤害类型
    harmTypeList() {
      return this.$getArgList('harmType') || []
    }
  },
  watch: {
    'form.dangerSourceId': {
      immediate: false,
      handler(val) {
        this.handleDangerChange(val)
      }
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  created() {
    this.getAllDanger()
  },
  // 方法集合
  methods: {
    //获取所有危险源
    async getAllDanger() {
      let res = await Api.getAllDangerList({ projectId: this.projectId, page: 1, rows: 9999 })
      this.dangerList = res.data.records || []
    },
    //危险源改变时
    handleDangerChange(val) {
      let selectSource = this.dangerList.filter(item => item.id === val)[0]
      this.form.harmCategoryLabel = this.$getLabel(this.harmTypeList, selectSource.harmCategory)
      this.form.precautionaryMeasure = selectSource.precautionaryMeasure
      this.fileIds = selectSource.fileId
    },
    //保存
    async handleSave() {
      await this.$refs.form.validate()
      let data = await this.$refs.checkForm.validForm()
      if (data) {
        await Api.addDangerInspect({ ...data, dangerSourceId: this.form.dangerSourceId, projectId: this.projectId })
        this.$message.success('保存成功')
        setTimeout(() => {
          this.$router.back()
        }, 500)
      }
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
