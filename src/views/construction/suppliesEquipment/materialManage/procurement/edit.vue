<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="140px" class="form-con">
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="申请人" prop="applicantId">
              <SelectUser
                :id.sync="form.applicantId"
                :value="form.applicantId ? { id: form.applicantId, label: form.applicantName } : null"
                :departId.sync="form.applyDepartmentId"
                :multiple="false"
                :clearable="false"
                :append-to-body="true"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="申请部门" prop="applyDepartmentId">
              <!--              <el-input v-model="form.applyDepartmentId" class="none"></el-input>-->
              <SelectDepart
                :id.sync="form.applyDepartmentId"
                :multiple="false"
                :value="form.applyDepartmentId ? { id: form.applyDepartmentId, label: form.applyDepartmentName } : null"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="申请到货时间" prop="appyArrivalTime">
              <el-date-picker
                v-model="form.appyArrivalTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="date"
                placeholder="选择时间"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="申请原因" prop="applyReason">
              <el-input v-model="form.applyReason" type="textarea" placeholder="请填写原因" @change="changeReason" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="审批人" prop="firstAuditPersonId">
              <SelectUser v-model="form.firstAuditPersonId" :multiple="false" value-format="id" :appendToBody="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="detailList">
        <div>采购明细</div>
        <div>
          <el-button type="primary" @click="selectMaterialBtn">选择材料</el-button>
          <el-button type="primary" @click="AddMaterialVisible = true">添加新材料</el-button>
        </div>
      </div>
      <div>
        <vxe-table
          ref="xTable"
          border
          resizable
          show-overflow
          :data="tableData"
          :edit-rules="validRules"
          :edit-config="{ trigger: 'click', mode: 'cell', autoClear: true }"
          @edit-closed="handleEditClosed"
        >
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="code" title="材料编码"></vxe-table-column>
          <vxe-table-column field="name" title="材料名称"></vxe-table-column>
          <vxe-table-column field="models" title="规格型号"></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="brand" title="品牌"></vxe-table-column>
          <vxe-table-column field="supplier" title="供应商"></vxe-table-column>
          <vxe-table-column field="inventoryNumber" title="库存量"></vxe-table-column>
          <vxe-table-column
            field="number"
            title="申请采购数量"
            :edit-render="{
              name: '$input',
              props: { type: 'number', min: 0 }
            }"
          ></vxe-table-column>
          <vxe-table-column
            field="univalence"
            title="单价"
            :edit-render="{
              name: '$input',
              props: {
                type: 'number',
                min: 0
              }
            }"
          ></vxe-table-column>

          <!--          <vxe-table-column field="number" title="申请采购数量" :edit-render="{}">-->
          <!--            <template v-slot:edit="{ row }">-->
          <!--              <el-input-number v-model="row.number"></el-input-number>-->
          <!--            </template>-->
          <!--          </vxe-table-column>-->
          <!--          <vxe-table-column field="univalence" title="单价" :edit-render="{}">-->
          <!--            <template v-slot:edit="{ row }">-->
          <!--              <el-input v-model="row.univalence"></el-input>-->
          <!--            </template>-->
          <!--          </vxe-table-column>-->

          <vxe-table-column field="combinedPrice" title="合价">
            <!--            <template slot-scope="{ row }"> {{ row.univalence && row.number && row.number * row.univalence }}</template>-->
            <template slot-scope="{ row }">
              <span>{{ combinedPrice(row) }}</span></template
            >
          </vxe-table-column>
          <vxe-table-column field="set" title="操作">
            <template slot-scope="{ row }">
              <span style="margin: 0 3px"><a @click="handleDeleteRow(row)">删除</a></span></template
            >
          </vxe-table-column>
        </vxe-table>
        <h4 style="margin-top: 15px">
          采购金额（元): <strong>{{ countTotalMoney }}</strong>
        </h4>
      </div>
    </el-card>
    <!--关联材料 start-->
    <ProcurentDialog
      v-if="procurentVisible"
      :visible="procurentVisible"
      @close="procurentVisible = false"
      @getTarget="getTarget"
    >
    </ProcurentDialog>
    <!--关联材料 end-->
    <!--添加新材料 start-->
    <AddMaterialDialog
      v-if="AddMaterialVisible"
      :visible="AddMaterialVisible"
      @close="AddMaterialVisible = false"
      @getTarget="AddMaterial"
    >
    </AddMaterialDialog>
    <!--添加新材料 end-->
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button size="lg" type="primary" :loading="btnSaveLoading" @click="submit(1)">保存</el-button>
      <el-button size="lg" type="primary" :loading="btnSaveSubmitLoading" @click="submit(null)">保存并提交</el-button>
    </div>
  </div>
</template>

<script>
import Api from '../../api/material/procurement'
import ProcurentDialog from './lib/ProcurentDialog'
import AddMaterialDialog from './lib/AddMaterialDialog'
import XEUtils from 'xe-utils'
import treeForEach from '@/utils/treeForEach'
import _ from 'lodash'

export default {
  name: 'ProcurementEdit',
  components: {
    ProcurentDialog,
    AddMaterialDialog
  },
  data() {
    return {
      id: '',
      procurentVisible: false,
      AddMaterialVisible: false,
      form: {},
      tableData: [],
      rules: {
        applicantId: [{ required: true, message: '申请人必填', trigger: 'blur' }],
        applyDepartmentId: [{ required: true, message: '申请部门必填', trigger: 'blur' }],
        appyArrivalTime: [{ required: true, message: '申请到货时间必填', trigger: 'blur' }],
        applyReason: [{ required: true, message: '申请原因必填' }],
        firstAuditPersonId: [{ required: true, message: '审批人必选', trigger: 'blur' }]
      },
      validRules: {
        number: [
          { required: true, message: '必填' }
          // { pattern: /[^0-9]/g, message: '必须为数字值' }
        ],
        univalence: [
          { required: true, message: '必填' }
          // { pattern: /[^0-9]/g, message: '必须为数字值' }
        ]
      },
      countTotalMoney: 0,
      btnSaveLoading: false,
      btnSaveSubmitLoading: false
    }
  },
  computed: {
    multipleValue() {
      if (this.form.firstAuditPersonId && this.form.firstAuditPersonId.length) {
        let ids = this.form.firstAuditPersonId.split(',')
        let names = this.form.firstAuditPersonName.split(',')
        let value = []
        for (let i = 0; i < ids.length; i++) {
          value.push({ id: ids[i], label: names[i] })
        }
        return value
      } else {
        return []
      }
    }
  },
  watch: {
    tableData: {
      deep: true,
      handler(val) {
        this.countTotalMoney = this.countAllAmount(val)
      }
    }
  },
  created() {
    const { id } = this.$route.query
    this.id = id
    this.refresh()
  },
  methods: {
    async refresh() {
      if (!this.id) {
        return
      }
      const res = await Api.getPurchaseOrderDetail(this.id)
      this.form = res.data || {}
      this.tableData = res.data.detailList.map(item => {
        return {
          brand: item.materialBrand,
          code: item.materialCode,
          models: item.materialModels,
          name: item.materialName,
          remark: item.materialRemark,
          supplier: item.materialSupplier,
          unit: item.materialUnit,
          combinedPrice: item.combinedPrice,
          materialId: item.materialId,
          inventoryNumber: item.materialInventoryNumber,
          number: item.number,
          univalence: item.univalence
        }
      })
    },
    //获取登录人信息
    async getLoginInfo() {
      let loginUserId = localStorage.getItem('id')
      let curUser, curDepart
      let res = await this.axios.post(`cim6d/system/project/organ/query`, {
        projectId: localStorage.getItem('projectId')
      })
      let data = res.data || []
      if (_.get(data, '0.children.0')) {
        data = data[0].children
      }
      let userList = []
      treeForEach(data, (e, parent) => {
        e.label = e.name
        if (!e.children) e.children = []
        if (e.type === 2) {
          e.organId = parent?.id
        }
        if (e.type === 3) {
          e.organId = parent.organId
          e.organName = parent.name
          e.id = e.userId
          delete e.children
          userList.push(e)
        }
      })
      let departmentUserList = _.cloneDeep(userList)
      let departList = _.cloneDeep(data)
      treeForEach(departmentUserList, e => {
        if (loginUserId === e.id) {
          curUser = e
        }
      })
      treeForEach(departList, e => {
        if (curUser && curUser.organId === e.id) {
          curDepart = e
        }
      })
      this.form = {
        ...this.form,
        ...{
          applicantId: curUser?.id || '',
          applicantName: curUser?.name || '',
          applyDepartmentId: curDepart?.id || '',
          applyDepartmentName: curDepart?.name || ''
        }
      }
    },
    //编辑结束触发
    handleEditClosed(data) {
      this.countTotalMoney = this.countAllAmount(data.data)
    },
    //计算总额
    combinedPrice(row) {
      return XEUtils.multiply(row.univalence, row.number)
    },
    countAllAmount(data) {
      return XEUtils.sum(data.map(row => this.combinedPrice(row)))
    },
    async submit(type) {
      await this.$refs.formRef.validate()
      await this.$refs.xTable.validate(true).then(e => {
        let data = _.cloneDeep(this.form)
        data.detailAddList = this.tableData.map(item => {
          return {
            materialBrand: item.brand,
            materialCode: item.code,
            materialModels: item.models,
            materialName: item.name,
            materialRemark: item.remark,
            materialSupplier: item.supplier,
            materialUnit: item.unit,
            combinedPrice: item.number && item.univalence && item.number * item.univalence,
            materialId: item.id || item.materialId,
            inventoryNumber: item.inventoryNumber,
            number: item.number,
            univalence: item.univalence
          }
        })
        if (type === 1) {
          this.btnSaveLoading = true
          Api.getPurchaseOrderAdd(data)
            .then(res => {
              this.btnSaveLoading = false
              this.$message.success('已保存草稿')
              setTimeout(() => {
                this.goBack()
              }, 1000)
            })
            .catch(() => {
              this.btnSaveLoading = false
            })
        } else {
          this.btnSaveSubmitLoading = true
          Api.getPurchaseOrderSubmit(data)
            .then(res => {
              this.btnSaveSubmitLoading = false
              this.$message.success('保存成功')
              setTimeout(() => {
                this.goBack()
              }, 1000)
            })
            .catch(() => {
              this.btnSaveSubmitLoading = false
            })
        }
      })
    },
    //添加新材料
    AddMaterial(e) {
      // console.log(e)
      this.tableData = [...this.tableData, ...e.checked]
      // console.log(111, this.tableData)
    },
    goBack() {
      // this.$router.back()
      this.$router.push({ name: `Procurement` })
    },
    //选择材料弹窗
    selectMaterialBtn() {
      this.procurentVisible = true
    },
    changeReason(v) {
      this.form = {
        ...this.form,
        applyReason: _.trim(v)
      }
    },
    //选择材料获取的数据
    getTarget(e) {
      let targetList = (e.checked || []).map(item => {
        return {
          ...item,
          number: null,
          univalence: null
        }
      })
      let diffData = _.differenceBy(this.tableData, targetList, 'code')
      this.tableData = [...diffData, ...targetList]
    },
    //删除
    handleDeleteRow(row) {
      this.tableData = this.tableData.filter(item => item._XID !== row._XID)
    }
  }
}
</script>

<style lang="less" scoped>
.detailList {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/deep/.el-picker-panel {
  z-index: 100000 !important;
}
</style>
