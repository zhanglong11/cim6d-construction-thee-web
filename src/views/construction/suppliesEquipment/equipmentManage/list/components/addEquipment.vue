<template>
  <el-dialog
    :title="id ? '修改' : '新建'"
    width="67%"
    top="10vh"
    :visible="visible"
    @close="$emit('update:visible', false)"
  >
    <div class="body-container">
      <el-form ref="form" label-width="150px" :model="form" :rules="formRules">
        <el-row :gutter="20">
          <el-col :md="24">
            <el-form-item label="编码">
              <el-input v-model="form.name" placeholder="编号" class="from-item" disabled> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请选择" class="from-item"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="规格及型号">
              <el-input v-model="form.name" placeholder="" class="from-item" disabled> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="设备状态" prop="name">
              <SelectList v-model="form.type" :self-list="equipmentStatus" :has-all-option="false" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="设备属性" prop="name">
              <SelectList v-model="form.type" :self-list="equipmentAttribute" :has-all-option="false" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="存放地点" prop="name">
              <el-input v-model="form.name" placeholder="请输入" class="from-item"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="折旧方式">
              <SelectList v-model="form.type" :self-list="equipmentWay" :has-all-option="false" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="技术状况" prop="name">
              <SelectList v-model="form.type" :self-list="equipmentCondition" :has-all-option="false" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="使用人" prop="name">
              <SelectUser v-moder="form.user" class="from-item" append-to-body></SelectUser>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="是否为特种装备" prop="name">
              <SelectList v-model="form.type" :self-list="isSpecialEquipment" :has-all-option="false" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="原值">
              <el-input v-model="form.name" placeholder="请输入" class="from-item"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="累计折旧">
              <el-input v-model="form.name" placeholder="请输入" class="from-item"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="净值">
              <el-input v-model="form.name" placeholder="请输入" class="from-item"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="使用开始日期" prop="date">
              <el-date-picker v-model="form.startDate" type="date" style="width: 400px"> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="净残值">
              <el-input v-model="form.name" placeholder="请输入" class="from-item"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="使用结束日期" prop="date">
              <el-date-picker v-model="form.endDate" type="date" style="width: 400px"> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="累计工作量">
              <el-input v-model="form.name" placeholder="请输入" class="from-item"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="使用月限">
              <el-input v-model="form.name" placeholder="自动生成" class="from-item" disabled> </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="工作总量">
              <el-input v-model="form.name" placeholder="请输入" class="from-item"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="净残值率%">
              <el-input v-model="form.name" placeholder="请输入" class="from-item"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="月折旧率">
              <el-input v-model="form.name" placeholder="请输入" class="from-item"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="计量单位">
              <el-input v-model="form.name" placeholder="请输入" class="from-item"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="月折旧额">
              <el-input v-model="form.name" placeholder="请输入" class="from-item"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="电机功率">
              <el-input v-model="form.name" placeholder="请输入" class="from-item"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="特种设备审验证号">
              <el-input v-model="form.name" placeholder="请输入" class="from-item"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="资金来源">
              <SelectList v-model="form.type" :self-list="capitalSource" :has-all-option="false" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="进口/国产">
              <SelectList v-model="form.type" :self-list="equipmentKind" :has-all-option="false" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="车牌号">
              <el-input v-model="form.name" placeholder="请输入" class="from-item"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="附件" prop="keyword">
              <Upload v-model="form.files" isOnlyButton multiple class="from-item"></Upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="备注">
              <el-input v-model="form.remark" style="width: 400px" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button v-promise-btn type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import Api from '../api'
import equipmentStatus from '../lib/equipmentStatus'
import equipmentAttribute from '../lib/equipmentAttribute'
import equipmentWay from '../lib/equipmentWay'
import equipmentCondition from '../lib/equipmentCondition'
import isSpecialEquipment from '../lib/isSpecialEquipment'
import capitalSource from '../lib/capitalSource'
import equipmentKind from '../lib/equipmentKind'
export default {
  name: 'AddEquipmentModal',
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
      equipmentStatus, //设备状态
      equipmentAttribute, //设备属性
      equipmentWay, //折旧方式
      equipmentCondition, //技术状况
      isSpecialEquipment, //是否特种装备
      capitalSource, //资金来源
      equipmentKind, //进口/国产
      form: {},
      formRules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }],
        date: [{ required: true, message: '必填', trigger: 'change' }]
      }
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
      // let res = await Api.getPlanDetail(this.id)
      // this.form = res
    },
    //点击确定
    async handleSubmit() {
      await this.$refs['form'].validate()
      this.$emit('submit', this.form)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-dialog__header {
  border: 1px #999 solid;
}
.body-container {
  max-height: 60vh;
  overflow: auto;
  padding: 10px 40px;
}
.from-item {
  width: 400px;
}
</style>
