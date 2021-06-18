<template>
  <div class="container no-padding" :class="{ inDialog, isFooter: !inDialog }">
    <component :is="inDialog ? 'div' : 'el-card'" class="box-card">
      <el-row :gutter="15">
        <el-col :span="inDialog ? 22 : 10">
          <el-form ref="form" :model="form" :rules="rules" label-width="160px" class="form-con">
            <el-form-item label="编制日期" prop="diaryDate">
              <el-date-picker
                v-model="form.diaryDate"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="工程名称" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="项目负责人" prop="chargePersonId">
              <SelectUser :id.sync="form.chargePersonId" :name.sync="form.chargePersonName" :multiple="false" />
            </el-form-item>
            <el-form-item label="施工人员" prop="constructionPersonIds">
              <SelectLabourWorker
                :id.sync="form.constructionPersonIds"
                :name.sync="form.constructionPersonNames"
                :multiple="true"
                @close="handleUserSelected"
              />
            </el-form-item>
            <el-form-item label="施工人数">
              <InputNumberCommon v-model="form.constructionPersonCount" @change="handlePersonCountInput" />
            </el-form-item>
            <el-form-item label="天气">
              <el-input v-model="form.todayWeather" class="form-input" type="text" />
            </el-form-item>
            <el-form-item label="温度℃">
              <div class="form-input el-input el-input--small temperature">
                <input
                  v-model.number="form.lowTemperature"
                  type="text"
                  autocomplete="off"
                  class="el-input__inner"
                  placeholder="最低温度"
                />
                ~
                <input
                  v-model.number="form.highTemperature"
                  type="text"
                  autocomplete="off"
                  class="el-input__inner highTemperature"
                  placeholder="最高温度"
                />
              </div>
            </el-form-item>
            <el-form-item label="施工工程及内容" prop="costructionContent">
              <el-input v-model="form.costructionContent" class="form-input" type="textarea" :rows="4" />
            </el-form-item>
            <el-form-item label="质量情况" prop="qualityProblem">
              <el-input v-model="form.qualityProblem" type="textarea" :rows="4" />
            </el-form-item>
            <el-form-item label="安全情况" prop="safetyProblem">
              <el-input v-model="form.safetyProblem" type="textarea" :rows="4" />
            </el-form-item>
            <el-form-item label="进度情况" prop="constructionProgress">
              <el-input v-model="form.constructionProgress" type="textarea" :rows="4" />
            </el-form-item>
            <el-form-item label="物资设备进退场情况" prop="equipmentEnterExit">
              <el-input v-model="form.equipmentEnterExit" type="textarea" :rows="4" />
            </el-form-item>
            <el-form-item label="抄送人" prop="copyToPersonId">
              <SelectUser :id.sync="form.copyToPersonId" :name.sync="form.copyToPersonName" />
            </el-form-item>
            <el-form-item label="附件" prop="fileIds">
              <FileEdit v-model="form.fileIds" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="4" maxlength="200" show-word-limit />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </component>
    <div v-if="!inDialog" class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button size="lg" type="primary" :loading="btnSaveLoading" @click="submit(null)">保存</el-button>
    </div>
  </div>
</template>

<script>
import Api from './api/constructionLog'
import SelectLabourWorker from '@/components/SelectLabourWorker'
export default {
  name: 'Edit',
  components: {
    SelectLabourWorker
  },
  data() {
    return {
      id: null,
      form: {
        highTemperature: '',
        lowTemperature: ' ',
        weather: ' ',
        todayWeather: '',
        status: 0,
        diaryDate: '',
        constructionPersonCount: 0,
        constructionPersonIds: '',
        fileIds: ''
      },
      inDialog: false,
      weatherInfo: {},
      rules: {
        diaryDate: [{ required: true, message: '必填' }],
        name: [{ required: true, message: '必填' }],
        chargePersonId: [{ required: true, message: '必填' }],
        // constructionPersonIds: [{ required: true, message: '必填' }],
        costructionContent: [{ required: true, message: '必填' }],
        qualityProblem: [{ required: true, message: '必填' }],
        safetyProblem: [{ required: true, message: '必填' }],
        constructionProgress: [{ required: true, message: '必填' }],
        equipmentEnterExit: [{ required: true, message: '必填' }],
        copyToPersonId: [{ required: true, message: '必填' }]
      },
      btnSaveLoading: false
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    },
    latitude() {
      return this.$store.state.project.latitude
    },
    longitude() {
      return this.$store.state.project.longitude
    }
  },
  created() {
    this.form.diaryDate = moment().format('YYYY-MM-DD HH:mm:ss')
    this.getProjectName()
    this.queryWeatherInfo()
  },
  methods: {
    //选中施工人员，计算施工人数
    handleUserSelected(ids) {
      this.$set(this.form, 'constructionPersonCount', ids ? ids.length : null)
    },
    // 手动输入施工人数时，验证施工人数不能小于选择的人员数量
    handlePersonCountInput() {
      if (!this.form.constructionPersonIds) return
      let selectedPersonCount = this.form.constructionPersonIds.split(',').length
      // if (selectedPersonCount > this.form.constructionPersonCount) {
      //   this.$message.error('请输入正确的施工人数')
      // }
    },
    // 保存
    async submit() {
      await this.$refs.form.validate()
      let selectedPersonCount = this.form.constructionPersonIds.split(',').length
      // if (selectedPersonCount > this.form.constructionPersonCount) {
      //   this.$message.error('请输入正确的施工人数')
      //   return
      // }
      const form = _.cloneDeep(this.form)
      // form.constructionPersonCount = form.constructionPersonIds.split(',').length
      this.btnSaveLoading = true
      await Api.add(form)
      this.btnSaveLoading = false
      this.$message.success('操作成功')
      this.goBack()
    },
    //预设项目名称
    getProjectName() {
      let name = localStorage.getItem('projectName')
      this.form = {
        ...this.form,
        ...{ name }
      }
    },
    // 获取天气详情
    async queryWeatherInfo() {
      let params = {
        lat: this.latitude,
        lng: this.longitude
      }
      let result = await this.axios.post(`/weather/info`, params)
      Object.assign(this.form, {
        highTemperature: result.data.highTemperature,
        lowTemperature: result.data.lowTemperature,
        todayWeather: result.data.weather,
        weather: result.data.lowTemperature + ' ~ ' + result.data.highTemperature
      })
    },
    // 返回
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.inDialog {
  max-height: calc(100vh - 230px);
  overflow-y: auto;
  overflow-x: hidden;
}
.el-input.temperature {
  display: flex;
  border-radius: 4px;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  .el-input__inner {
    border: none;
    width: 66px;
    text-align: center;
    padding: 0 3px;
  }
}
</style>
