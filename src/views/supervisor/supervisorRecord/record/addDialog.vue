<template>
  <el-dialog :title="id ? '修改' : '新建' + '旁站记录基本信息'" :visible="visible" width="820px" @close="handleCancel">
    <el-form ref="form" :model="form" :rules="formRules" label-width="150px">
      <el-row>
        <el-col :md="12">
          <el-form-item label="单位工程名称" prop="engineeringName">
            <el-input v-model="form.engineeringName" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="旁站部位或工序" prop="partProcedure">
            <el-input v-model="form.partProcedure" placeholder="请输入" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="12">
          <el-form-item label="天气" prop="weather">
            <el-input v-model="form.weather" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="旁站人" prop="creatorName">
            <el-input v-model="form.creatorName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="12">
          <el-form-item label="旁站开始时间" prop="startDate">
            <el-date-picker
              v-model="form.startDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="请选择"
              style="width: 100%"
              :picker-options="pickerOptionsStart(form.endDate)"
            />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="旁站结束时间" prop="endDate">
            <el-date-picker
              v-model="form.endDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="请选择"
              style="width: 100%"
              :picker-options="pickerOptionsEnd(form.startDate)"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="12">
          <el-form-item label="施工情况" prop="constructionSituation">
            <el-input v-model="form.constructionSituation" type="textarea" :rows="2" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="监理情况" prop="supervisorSituation">
            <el-input v-model="form.supervisorSituation" type="textarea" :row="2" placeolder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="12">
          <el-form-item label="发现问题">
            <el-input v-model="form.findIssue" type="textarea" :rows="2" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="处理问题">
            <el-input v-model="form.handleIssue" type="textarea" :row="2" placeolder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="12">
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="14">
          <el-form-item label="旁站附件">
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
  name: 'AddRecordDialog',
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
        engineeringName: '',
        endDate: '',
        startDate: ''
      },
      pickerOptionsStart(val) {
        return {
          disabledDate(time) {
            return time.getTime() > new Date(val).getTime()
          }
        }
      },
      pickerOptionsEnd(val) {
        return {
          disabledDate(time) {
            return time.getTime() < new Date(val).getTime()
          }
        }
      },
      formRules: {
        engineeringName: [{ required: true, message: '必填' }],
        partProcedure: [{ required: true, message: '必填' }],
        weather: [{ required: true, message: '必填' }],
        startDate: [{ required: true, message: '必填' }],
        endDate: [{ required: true, message: '必选' }],
        constructionSituation: [{ required: true, message: '必填' }],
        supervisorSituation: [{ required: true, message: '必填' }]
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
        let res = this.id ? await Api.getRecordUpdate(this.form) : await Api.getRecordAdd(this.form)
        if (res.code === 200) {
          this.btnSaveLoading = false
          this.$message.success('保存成功')
          this.handleCancel()
          this.$parent.refresh()
        } else {
          this.$message.success('保存失败')
        }
      } catch (e) {
        this.btnSaveLoading = false
      }
    },
    // 获取详情
    getDetail() {
      Api.getRecordInfo(this.id).then(res => {
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
