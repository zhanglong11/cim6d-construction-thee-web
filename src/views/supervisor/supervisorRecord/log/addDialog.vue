<template>
  <el-dialog :title="id ? '修改' : '新建' + '监理日志基本信息'" :visible="visible" width="820px" @close="handleCancel">
    <el-form ref="form" :model="form" :rules="formRules" label-width="150px">
      <el-row>
        <el-col :md="12">
          <el-form-item label="单位工程名称" prop="engineeringName">
            <el-input v-model="form.engineeringName" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="日期" prop="reportDate">
            <el-date-picker
              v-model="form.reportDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="12">
          <el-form-item label="日气象" prop="weather">
            <el-input v-model="form.weather" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="最高温度" prop="maximumTemperature">
            <el-input v-model="form.maximumTemperature" placeholder="请输入" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="12">
          <el-form-item label="最低温度" prop="minimumTemperature">
            <el-input v-model="form.minimumTemperature" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="日志填写人" prop="creatorName">
            <el-input v-model="form.creatorName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="12">
          <el-form-item label="签阅人" prop="signPersonId" class="select-author">
            <SelectUser
              :id.sync="form.signPersonId"
              :multiple="false"
              :value="form.signPersonId ? { id: form.signPersonId, label: form.signPersonName } : null"
              :name.sync="form.signPersonName"
              @input="validateAuthor('signPersonId')"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="12">
          <el-form-item label="施工进展情况">
            <el-input v-model="form.constructionProgressSituation" type="textarea" :rows="2" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="监理工作情况">
            <el-input v-model="form.supervisorWorkSituation" type="textarea" :row="2" placeolder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="12">
          <el-form-item label="存在问题及处理情况">
            <el-input v-model="form.issueHandleSituation" type="textarea" :rows="2" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="其他事项">
            <el-input v-model="form.otherItems" type="textarea" :row="2" placeolder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="14">
          <el-form-item label="监理日志附件">
            <FileEdit v-model="form.fileIds" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="btnSaveLoading" @click="handleSave">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'AddLogDialog',
  props: {
    visible: Boolean,
    id: String
  },
  // 这里存放数据
  data() {
    return {
      form: {
        projectId: this.$store.state.project.projectId,
        creatorName: this.$store.state.user.name,
        creator: this.$store.state.user.id,
        engineeringName: ''
      },
      formRules: {
        engineeringName: [{ required: true, message: '必填' }],
        weather: [{ required: true, message: '必填' }],
        minimumTemperature: [{ required: true, message: '必填' }],
        creatorName: [{ required: true, message: '必填' }],
        reportDate: [{ required: true, message: '必选' }],
        maximumTemperature: [{ required: true, message: '必填' }],
        signPersonId: [{ required: true, message: '必选' }]
      },
      btnSaveLoading: false
    }
  },
  computed: {
    latitude() {
      return this.$store.state.project.latitude
    },
    longitude() {
      return this.$store.state.project.longitude
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    // this.queryWeatherInfo()
    if (this.id) {
      this.getDetail()
    }
  },
  // 方法集合
  methods: {
    // 编制人校验
    validateAuthor(signPersonId) {
      this.$nextTick(() => {
        this.$refs.form.validateField(signPersonId)
      })
    },
    // 取消
    handleCancel() {
      this.$emit('update:visible', false)
    },
    // 保存
    async handleSave() {
      try {
        await this.$refs.form.validate()
        this.btnSaveLoading = true
        await Api.getLogAdd(this.form).then(res => {
          if (res.code === 200) {
            this.btnSaveLoading = false
            this.$message.success('保存成功')
            this.handleCancel()
            this.$parent.refresh()
          } else {
            this.$message.success('保存失败')
          }
        })
      } catch (e) {
        this.btnSaveLoading = false
      }
    },
    // 获取详情
    getDetail() {
      Api.getLogInfo(this.id).then(res => {
        this.form = res.data || {}
      })
    },
    // 获取天气详情
    async queryWeatherInfo() {
      let params = {
        lat: this.latitude,
        lng: this.longitude
      }
      let result = await this.axios.post(`/weather/info`, params)
      this.form = {
        ...this.form,
        maximumTemperature: result.data.highTemperature,
        minimumTemperature: result.data.lowTemperature,
        weather: result.data.weather,
        temperature: result.data.temperature
      }
    }
  }
}
</script>

<style lang="less" scoped>
.select-author.is-error {
  /deep/ .vue-treeselect__control {
    border-color: #f56c6c;
  }
  /deep/ .vue-treeselect__control:hover {
    border-color: #f56c6c;
  }
}
</style>
