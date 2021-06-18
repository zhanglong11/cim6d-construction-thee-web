<template>
  <el-dialog title="详情" width="1400px" top="5vh" :visible="visible" @close="$emit('update:visible', false)">
    <div class="body-container">
      <el-form ref="form" label-width="150px" :model="form" :rules="formRules">
        <el-card class="box-card" shadow="never" style="margin: 10px">
          <div slot="header" class="clearfix">
            <span>危险源信息</span>
            <el-button style="float: right; padding: 3px 0" type="text"></el-button>
          </div>
          <div>
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
          </div>
        </el-card>
      </el-form>
      <!--时间轴 start-->
      <FlowLine :info="{}"></FlowLine>
      <!--时间轴  end-->
      <CheckForm ref="checkForm" :sourceId="form.dangerSourceId"></CheckForm>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button v-promise-btn :disabled="!form.dangerSourceId" type="primary" @click="handleSave">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api'
import DetailItem from '@/views/construction/quality/components/detailItem'
import FileTable from '@/views/construction/quality/components/fileTable' //附件
import CheckForm from './checkForm' //巡检检查表单
import FlowLine from './flowLine' //检查流程
export default {
  name: 'DangerCheckDetailForm',
  components: { DetailItem, FileTable, FlowLine, CheckForm },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
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
  created() {
    this.getAllDanger()
  },
  methods: {
    //获取所有危险源
    async getAllDanger() {
      //projectId: this.projectId, page: 1, rows: 9999
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
        await this.$parent.refresh()
        this.$emit('update:visible', false)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
</style>
