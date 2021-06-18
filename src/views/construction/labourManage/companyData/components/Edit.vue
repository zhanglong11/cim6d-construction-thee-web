<template>
  <el-dialog
    class="beauty"
    :title="form.id ? '修改劳务信息' : '新增劳务信息'"
    :visible="visible"
    width="850px"
    :close-on-click-modal="false"
    @close="close"
  >
    <div>
      <div class="dialog-content">
        <span class="dia-sp">项目基本情况</span>
        <el-form
          ref="form"
          :model="form"
          style="width: 650px; margin-top: 10px; margin-left: 10px"
          label-width="150px"
          :rules="rules"
        >
          <el-form-item label="公司名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入公司名称"></el-input>
          </el-form-item>
          <el-form-item label="公司类型" prop="type">
            <SelectArg v-model="form.type" arg-group="labourCompanyType"></SelectArg>
          </el-form-item>
          <el-form-item label="负责人姓名" prop="principal">
            <SelectUser
              v-model="form.principal"
              value-format="id"
              :multiple="false"
              :name.sync="form.principalName"
              placeholder="请选择"
              @update:mobile="handmobile"
            ></SelectUser>
          </el-form-item>
          <el-form-item label="负责人联系方式" prop="principalMobile">
            <el-input v-model="form.principalMobile" placeholder="请输入负责人联系方式" disabled></el-input>
          </el-form-item>
          <el-form-item label="每月工资发放日期" prop="payoffTime">
            <InputNumbers
              v-model="form.payoffTime"
              :min="1"
              :max="31"
              placeholder="请输入每月工资发放日期1号~31号"
            ></InputNumbers>
          </el-form-item>
        </el-form>
      </div>
      <!-- 班组内容 start -->
      <div class="dialog-content2">
        <div style="margin-bottom: 15px">
          <span class="dia-sp">关联班组</span>
          <el-button
            v-if="$hasPower('LabourCompanyAddGroup')"
            type="primary"
            style="margin-left: 10px"
            @click="getAdd()"
            >新增班组</el-button
          >
        </div>
        <!-- 工具栏 -->
        <vxe-table
          ref="newTable"
          border
          show-overflow
          keep-source
          :data="groupList"
          :edit-rules="validRules"
          :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
        >
          <vxe-table-column
            field="name"
            title="班组名称"
            width="200"
            :edit-render="{
              name: 'input',
              attrs: { type: 'text' }
            }"
          ></vxe-table-column>
          <vxe-table-column
            field="principal"
            title="班组负责人"
            width="200"
            :edit-render="{
              name: 'input',
              attrs: { type: 'text' }
            }"
          >
            <!-- <template slot-scope="scope">
                <SelectUser
                  v-model="scope.row.principal"
                  class="select"
                  append-to-body
                  :multiple="false"
                  value-format="id"
                  :name.sync="scope.row.principalName"
                >
                </SelectUser>
              </template> -->
          </vxe-table-column>
          <vxe-table-column
            field="principalMobile"
            title="班组负责人联系方式"
            :edit-render="{
              name: 'input',
              immediate: true,
              attrs: { type: 'text' }
            }"
          >
          </vxe-table-column>
          <vxe-table-column title="操作" width="200px">
            <template slot-scope="scope">
              <vxe-button @click="handleDelete(scope)">删除</vxe-button>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
      <!-- 班组内容 end -->
    </div>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="getSubmit">保存</el-button>
    </footer>
  </el-dialog>
</template>
<script>
import regular from '@/utils/regular'
import api from '../../api/labour-api'
import InputNumbers from './InputNumber'

export default {
  name: 'CompanyEdit',
  components: { InputNumbers },
  props: {
    // 弹窗是否显示
    visible: {
      default: false,
      type: Boolean
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      index: '',
      // 表单数据
      form: {},
      btnLoading: false,
      groupList: [], //班组列表
      rules: {
        name: [{ required: true, message: '必填公司名称' }],
        type: [{ required: true, message: '必填公司类型' }],
        principal: [{ required: true, message: '必填负责人姓名' }],
        principalMobile: [{ required: true, message: '必填负责人联系方式' }],
        payoffTime: [{ required: true, message: '必填工资发放日期为数字' }]
      },
      validRules: {
        name: [{ required: true, message: '必填班组名称' }],
        principal: [{ required: true, message: '必填负责人' }],
        principalMobile: [{ required: true, message: '请输入正确手机号格式', pattern: regular.telephone }]
      }
    }
  },
  watch: {
    'form.principal'(val) {
      if (!val) {
        this.form.principalMobile = ''
      }
    }
  },
  created() {
    if (this.id) {
      api.getLabourCompanyDetail(this.id).then(res => {
        this.form = res.data || {}
        this.groupList = this.form.groupList
      })
    }
  },
  methods: {
    handmobile(val) {
      this.form.principalMobile = val
    },
    // handmobileTwo(val) {},
    //提交保存
    async getSubmit() {
      try {
        await this.$refs.newTable.validate(true)
        await this.$refs.form.validate()
        //移除空对象s
        for (let i = 0; i < this.groupList.length; i++) {
          if (!this.groupList[i].name && !this.groupList[i].principal && !this.groupList[i].principalMobile) {
            this.groupList.splice(i, 1)
          }
        }
        //移除空对象end
        this.form.groupList = this.groupList //获取班组所有值
        this.btnLoading = true
        if (this.form.id) {
          await api.updateLabourCompany(this.form).then(res => {
            this.btnLoading = false
            this.$message.success('编辑成功')
            this.close()
            this.$parent.refresh()
          })
        } else {
          await api.addLabourCompany(this.form).then(res => {
            this.btnLoading = false
            this.$message.success('新增成功')
            this.close()
            this.$parent.refresh()
          })
        }
      } catch (e) {
        this.btnLoading = false
      }
    },
    //新增班组
    async getAdd() {
      let obj = {
        name: this.name,
        principal: this.principal,
        principalMobile: this.principalMobile
      }
      if (this.groupList === null) {
        this.groupList = []
      }
      this.groupList.push(obj)
      this.$refs.newTable.setActiveRow(obj)
    },
    //删除当前班组行
    handleDelete(scope) {
      if (scope.data[scope.$rowIndex].id) {
        let id = scope.data[scope.$rowIndex].id
        api.getGroupEmployee(id).then(type => {
          if (type.data === 'true') {
            this.$confirm('该班组下有关联人员！您确定要删除?').then(type => {
              if (type === 'confirm') {
                this.$refs.newTable.remove(scope.row)
                this.groupList.splice(scope.$rowIndex, 1)
              }
            })
          } else {
            this.$refs.newTable.remove(scope.row)
            this.groupList.splice(scope.$rowIndex, 1)
          }
        })
      } else {
        this.$confirm('您确定要删除该行?').then(type => {
          if (type === 'confirm') {
            this.$refs.newTable.remove(scope.row)
            this.groupList.splice(scope.$rowIndex, 1)
          }
        })
      }
    },
    // 关闭弹窗
    close() {
      this.$emit('update:visible', false)
      this.$refs.form.clearValidate()
    }
  }
}
</script>
<style lang="less">
.el-popup-parent--hidden /deep/.vxe-table--tooltip-wrapper.vxe-table--valid-error {
  z-index: 9999 !important;
}
.dia-sp {
  font-size: 16px;
}
</style>
