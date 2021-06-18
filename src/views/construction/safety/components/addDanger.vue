<template>
  <el-dialog
    :title="id ? '修改' : '新建'"
    width="1400px"
    top="5vh"
    :visible="visible"
    :close-on-click-modal="false"
    @close="$emit('update:visible', false)"
  >
    <div class="body-container">
      <el-form ref="form" label-width="150px" :model="form" :rules="formRules">
        <el-form-item label="危险源名称" prop="dangerSource">
          <el-input v-model.trim="form.dangerSource" placeholder="请输入危险源名称" class="from-item"> </el-input>
        </el-form-item>
        <el-form-item label="伤害类型" prop="harmCategory">
          <el-select v-model="form.harmCategory" class="from-item">
            <el-option
              v-for="(item, index) of harmTypeList"
              :key="'ss' + index"
              :value="item.value"
              :label="item.label"
            ></el-option
          ></el-select>
        </el-form-item>
        <el-form-item label="防范措施" prop="precautionaryMeasure">
          <el-input
            v-model.trim="form.precautionaryMeasure"
            placeholder="请输入防范措施"
            class="from-item"
            type="textarea"
            :rows="2"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="附件" prop="fileId">
          <Upload v-model="form.fileId" isOnlyButton multiple class="from-item"></Upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" class="from-item" type="textarea" :rows="2">
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="placeList">
          <DangerLocation ref="location" v-model="form.placeList"></DangerLocation>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button v-promise-btn type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api'
import DangerLocation from './dangerLocation'
export default {
  name: 'AddDanger',
  components: { DangerLocation },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      form: { placeList: [] },
      formRules: {
        dangerSource: [{ required: true, message: '危险源名称必填', trigger: 'blur' }],
        harmCategory: [{ required: true, message: '伤害类型必选', trigger: 'change' }],
        precautionaryMeasure: [{ required: true, message: '防范措施必填', trigger: 'blur' }],
        placeList: [{ required: true, message: '位置必填', trigger: 'change' }]
      }
    }
  },
  computed: {
    //伤害类型
    harmTypeList() {
      return this.$getArgList('harmType') || []
    }
  },
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    //获取详情
    async getDetail() {
      let res = await Api.getDangerDetail(this.id)
      this.form = res.data
    },
    //点击确定
    async handleSubmit() {
      await this.$refs['form'].validate()
      this.$emit('submit', { ...this.form, projectId: this.projectId })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
</style>
