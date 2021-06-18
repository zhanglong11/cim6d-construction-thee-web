<template>
  <div class="container no-padding" :class="{ inDialog, isFooter: !inDialog }">
    <component :is="inDialog ? 'div' : 'el-card'" class="box-card">
      <el-row :gutter="15">
        <el-col :span="inDialog ? 22 : 10">
          <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="form-con">
            <el-form-item label="考勤组名称：" prop="attendanceGroupName">
              <el-input v-model="form.attendanceGroupName" class="form-input" />
            </el-form-item>
            <el-form-item label="考勤组人员：" prop="attendanceGroupType">
              <el-radio-group v-model="form.attendanceGroupType" @change="changeHandler">
                <el-radio :label="1">管理人员</el-radio>
                <el-radio :label="2">劳务人员</el-radio>
              </el-radio-group>
              <el-form-item prop="attendanceGroupUserId">
                <span v-if="attendanceGroupType === 1">
                  <SelectUser
                    :id.sync="form.attendanceGroupUserId"
                    :value="form.attendanceGroupUserId ? form.attendanceGroupUserId.split(',').map(id => ({ id })) : []"
                    append-to-body
                    @update:mobile="handmobile"
                  />
                </span>
                <span v-else-if="attendanceGroupType === 2">
                  <SelectLabourWorker
                    :id.sync="form.attendanceGroupUserId"
                    :value="form.attendanceGroupUserId ? form.attendanceGroupUserId.split(',').map(id => ({ id })) : []"
                    :name.sync="form.attendanceGroupUserName"
                    :multiple="true"
                    @update:mobile="handmobile"
                  />
                </span>
              </el-form-item>
            </el-form-item>
            <el-form-item label="考勤负责人：" prop="attendanceGroupPrincipalId">
              <SelectUser
                v-model="form.attendanceGroupPrincipalId"
                value-format="id"
                :multiple="false"
                placeholder="请选择"
              ></SelectUser>
            </el-form-item>
            <el-form-item label="地点：" prop="locationName">
              <el-button class="el-icon-location" @click="handleOpenMapDialog()">添加</el-button>
              <el-input v-model="form.locationName" class="form-input" disabled />
            </el-form-item>
            <el-form-item label="有效范围：" prop="effectiveRange">
              <div style="position: relative">
                <!-- <el-input v-model="form.effectiveRange" class="form-input" /> -->
                <InputNumber v-model="form.effectiveRange" :min="0" />
                <span style="position: absolute; right: -22px">米</span>
              </div>
            </el-form-item>
            <el-form-item label="打卡时段：" prop="workTime">
              <el-time-select
                v-model="form.workTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '23:59'
                }"
                placeholder="上班"
              >
              </el-time-select>
            </el-form-item>
            <el-form-item prop="offDutyTime">
              <el-time-select
                v-model="form.offDutyTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '23:59'
                }"
                placeholder="下班"
              >
              </el-time-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </component>
    <div v-if="!inDialog" class="footer-btn">
      <el-button size="lg" @click="goBack()">取消 </el-button>
      <el-button size="lg" type="primary" :loading="btnLoading" @click="submit()">保存</el-button>
    </div>

    <!-- 地图弹窗 -->
    <el-dialog
      title="地图选点"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="1000px"
      custom-class="map-container"
    >
      <Map
        :map-type="mapType"
        :address="addressDetail"
        :selected-position="selectedPostion"
        @choosedLocation="handlechoosedLocation"
      />
    </el-dialog>
  </div>
</template>

<script>
import Api from '../api/'
import Map from '../../../project/components/Map'
import SelectLabourWorker from '@/components/SelectLabourWorker'
export default {
  name: 'AppraisalAdd',
  components: {
    Map,
    SelectLabourWorker
  },
  data() {
    return {
      // 地图弹窗
      dialogVisible: false,
      mapType: null, // 联系地址还是注册地址
      selectedPostion: '', // 打开map组件是的默认位置
      addressDetail: '', // 详细位置
      id: '',
      form: {
        attendanceGroupType: 1,
        locationName: '',
        attendanceGroupUserMobile: '' //人员手机号
      },
      attendanceGroupType: 1,
      sourceList: [],
      equipmentType: [],
      rules: {
        attendanceGroupName: [{ required: true, message: '必填' }],
        attendanceGroupType: [{ required: true, message: '必选' }],
        attendanceGroupUserId: [{ required: true, message: '必选' }],
        attendanceGroupPrincipalId: [{ required: true, message: '必选' }],
        locationName: [{ required: true, message: '必填' }],
        offDutyTime: [{ required: true, message: '必填' }],
        workTime: [{ required: true, message: '必填' }],
        effectiveRange: [{ required: true, message: '必填' }]
      },
      inDialog: false,
      btnLoading: false
    }
  },
  watch: {},

  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.id = this.$route.params.id
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    handmobile(val) {
      console.log(val)
      this.form.attendanceGroupUserMobile = val
    },
    changeHandler(value) {
      if (this.attendanceGroupType === value) {
        this.attendanceGroupType = value
      } else {
        this.attendanceGroupType = value
        this.form.attendanceGroupUserId = ''
      }
    },
    getDetail() {
      Api.getAttendanceClockInDetail(this.id).then(res => {
        this.form = { ...res.data }
        this.attendanceGroupType = this.form.attendanceGroupType
      })
    },
    handleOpenMapDialog() {
      this.dialogVisible = true
    },
    // 地图选点后回填地址具体信息
    handlechoosedLocation(data) {
      //经 longitude
      this.form.locationCoordinate = data.longitude + ',' + data.latitude
      this.form.locationName = data.province + data.city + data.district + data.addr || ''
      this.dialogVisible = false
    },
    async refresh() {
      const res = await Api.getAttendanceClockInDetail(this.id)
      this.form = res.data
    },
    async submit() {
      this.$refs.form.validate(valid => {
        console.log(this.form.offDutyTime < this.form.workTime)
        if (this.form.offDutyTime < this.form.workTime) {
          this.$message.info('下班时间不能小于上班时间')
          return
        } else if (this.form.offDutyTime === this.form.workTime) {
          this.$message.info('下班时间不能等于上班时间')
          return
        }
        if (valid) {
          this.btnLoading = true

          // this.form.attendanceGroupUserMobile = this.attendanceGroupUserMobile
          const form = _.cloneDeep(this.form)
          // return
          // form.attendanceGroupUserId = form.attendanceGroupUserId.join(',')
          if (this.id) {
            Api.getAttendanceClockInUpdate(form)
              .then(res => {
                this.btnLoading = false
                this.$message.success('编辑成功')
                this.$router.back()
              })
              .finally(() => {
                this.btnLoading = false
              })
          } else {
            Api.getAttendanceClockInAdd(form)
              .then(res => {
                this.btnLoading = false
                this.$message.success('新增成功')
                this.$router.back()
              })
              .finally(() => {
                this.btnLoading = false
              })
          }
        }
      })
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin';
.inDialog {
  max-height: calc(100vh - 230px);
  overflow-y: auto;
  overflow-x: hidden;
  @include scroll(5px);
}
</style>
