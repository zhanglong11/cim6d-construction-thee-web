<template>
  <el-card class="box-card" shadow="never" style="margin: 10px">
    <div slot="header" class="clearfix">
      <span>检查结果</span>
      <el-button style="float: right; padding: 3px 0" type="text"></el-button>
    </div>
    <el-form ref="form" :model="form" :rules="rules" class="form" label-width="120px">
      <el-form-item label="检查结果" prop="firstInspectStatus">
        <el-radio-group v-model="form.firstInspectStatus" class="form-item">
          <el-radio :label="1">合格</el-radio>
          <el-radio :label="0">不合格</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.firstInspectStatus === 0">
        <el-form-item label="所在位置" prop="dangerSourcePlaceId">
          <el-select v-model="form.dangerSourcePlaceId" class="form-item">
            <el-option
              v-for="(item, index) of positionList"
              :key="'ss' + sourceId + '' + index"
              :value="item.id"
              :label="item.placeName"
            ></el-option
          ></el-select>
        </el-form-item>
        <el-form-item label="危险源时效性">
          <el-input v-model="form.timeliness" disabled class="form-item" placeholder="随位置带出" />
        </el-form-item>
        <el-form-item label="问题描述" prop="problemDesc">
          <el-input
            v-model="form.problemDesc"
            :autosize="{ minRows: 3, maxRows: 5 }"
            type="textarea"
            placeholder="请输入问题描述"
            class="form-item"
          />
        </el-form-item>
      </template>
      <!--  <el-form-item label="现场照片" prop="fileId">
        <Upload
          :key="'firstInspectStatus' + form.firstInspectStatus"
          v-model="form.fileId"
          isOnlyButton
          multiple
          class="form-item"
          btnText="上传照片"
        ></Upload>
      </el-form-item>-->
      <el-form-item
        v-if="form.firstInspectStatus === 0"
        label="现场照片"
        prop="fileId"
        :rules="{
          required: true,
          message: '照片不能为空'
        }"
      >
        <Upload
          :key="'firstInspectStatus' + sourceId + form.firstInspectStatus"
          v-model="form.fileId"
          accept="jpg,png,gif,bmp,webp"
          isOnlyButton
          multiple
          class="form-item"
          btnText="上传照片"
        ></Upload>
      </el-form-item>
      <el-form-item v-else label="现场照片" prop="fileId">
        <Upload
          :key="'firstInspectStatus' + sourceId + form.firstInspectStatus"
          v-model="form.fileId"
          isOnlyButton
          multiple
          accept="jpg,png,gif,bmp,webp"
          class="form-item"
          btnText="上传照片"
        ></Upload>
      </el-form-item>
      <template v-if="form.firstInspectStatus === 1 || form.firstInspectStatus === null">
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            :autosize="{ minRows: 3, maxRows: 5 }"
            type="textarea"
            placeholder="请输入备注"
            class="form-item"
          />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="整改期限" prop="rectifyDeadline">
          <el-date-picker
            v-model="form.rectifyDeadline"
            value-format="yyyy-MM-dd 23:59:59"
            style="width: 400px"
            type="date"
            placeholder="选择整改期限"
          >
          </el-date-picker>
        </el-form-item>
      </template>
    </el-form>
  </el-card>
</template>

<script>
import Api from '@/views/construction/safety/api'

export default {
  name: 'RectifyForm',
  components: {},
  props: {
    sourceId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: { firstInspectStatus: null, fileId: '', remark: '' },
      rules: {
        firstInspectStatus: [{ required: true, message: '检查结果不能为空', trigger: 'change' }],
        reviewOpinion: [{ required: true, message: '整改方法不能为空', trigger: 'blur' }],
        dangerSourcePlaceId: [{ required: true, message: '位置不能为空', trigger: 'change' }],
        problemDesc: [{ required: true, message: '问题描述不能为空', trigger: 'blur' }],
        rectifyDeadline: [{ required: true, message: '整改期限不能为空', trigger: 'change' }]
      },
      positionList: [] //位置列表
    }
  },
  watch: {
    'form.dangerSourcePlaceId': {
      immediate: false,
      handler(val) {
        if (val) {
          this.handlePositionChange(val)
        } else {
          this.form.timeliness = ''
        }
      }
    },
    'form.firstInspectStatus': {
      immediate: false,
      handler(val) {
        if (val || val === 0) {
          this.form.fileId = ''
          this.form.remark = ''
          this.$refs.form.clearValidate()
        }
      }
    },
    sourceId: {
      immediate: false,
      handler(val) {
        this.form.fileId = ''
        if (val || val === 0) {
          //this.form = { firstInspectStatus: null }
          this.$refs.form.resetFields()
          this.$refs.form.clearValidate()
          this.getPosition()
        }
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    //获取危险源位置列表
    async getPosition() {
      let res = await Api.getPositionList(this.sourceId)
      this.positionList = res.data || []
    },
    //危险源改变时
    handlePositionChange(val) {
      let selectPosition = this.positionList.filter(item => item.id === val)[0]
      this.form.timeliness = `${this.ymd(selectPosition.timelinessStartTime)}~${this.ymd(
        selectPosition.timelinessEndTime
      )}`
    },
    async validForm() {
      let res = await this.$refs.form.validate().catch(e => false)
      let res1 = await this.$refs.form.validateField(['field'])
      return res ? { ...this.form } : false
    }
  }
}
</script>

<style scoped lang="less">
@import '../index.less';
.form-item {
  width: 400px;
}
</style>
