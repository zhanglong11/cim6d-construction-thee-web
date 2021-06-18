<template>
  <el-dialog
    width="1400px"
    :title="'确认页面'"
    :visible="visible"
    @close="
      () => {
        $emit('update:visible', false)
      }
    "
  >
    <h4>设备明细</h4>
    <vxe-table
      ref="xTable"
      border
      resizable
      show-overflow
      :data="tableData"
      :edit-rules="validRules"
      :edit-config="{ trigger: 'click', mode: 'cell', autoClear: false }"
    >
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="name" title="设备名称"></vxe-table-column>
      <vxe-table-column field="models" title="规格型号"></vxe-table-column>
      <vxe-table-column
        field="type"
        title="设备类型"
        :formatter="({ cellValue }) => $getLabel(equipmentTypeList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="unit" title="单位"></vxe-table-column>
      <vxe-table-column field="type" title="设备类别"></vxe-table-column>
      <vxe-table-column field="manufacturer" title="生产厂家"></vxe-table-column>
      <vxe-table-column field="supplier" title="供应商"></vxe-table-column>
      <vxe-table-column field="number" title="申请采购数量"></vxe-table-column>
      <vxe-table-column field="univalence" title="单价"></vxe-table-column>
      <vxe-table-column field="combinedPrice" title="合价"> </vxe-table-column>
      <vxe-table-column field="accepter" title="检定验收人"> </vxe-table-column>
      <vxe-table-column
        field="acceptResult"
        title="检定验收结果"
        :edit-render="{
          name: '$input',
          props: { type: 'text' }
        }"
      ></vxe-table-column>
      <vxe-table-column
        field="acceptUnit"
        title="检定验收单位"
        :edit-render="{
          name: '$input',
          props: { type: 'text' }
        }"
      ></vxe-table-column>
      <vxe-table-column
        field="acceptContent"
        title="检定验收内容"
        :edit-render="{
          name: '$input',
          props: { type: 'text' }
        }"
      ></vxe-table-column>
      <vxe-table-column field="acceptTime" title="检定验收时间" :edit-render="{}" width="200">
        <template #edit="{ row }">
          <el-date-picker v-model="row.acceptTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </template>
        <template #default="{ row }">{{ formatDate(row.acceptTime, 'yyyy-MM-dd HH:mm:ss') }}</template>
      </vxe-table-column>
      <!--      <vxe-table-column-->
      <!--        field="acceptTime"-->
      <!--        title="检定验收时间"-->
      <!--        :edit-render="{-->
      <!--          name: '$input',-->
      <!--          props: { type: 'text' }-->
      <!--        }"-->
      <!--      ></vxe-table-column>-->
    </vxe-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="onOk">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api/index'
import equipmentTypeList from '../../lib/equipmentTypeList'
import XEUtils from 'xe-utils'
export default {
  name: 'VerificationAcceptanceModel',
  props: {
    visible: Boolean,
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      equipmentTypeList,
      validRules: {
        acceptResult: [{ required: true, message: '必填' }],
        acceptUnit: [{ required: true, message: '必填' }],
        acceptContent: [{ required: true, message: '必填' }],
        acceptTime: [{ required: true, message: '必填' }]
      },
      tableData: []
    }
  },
  computed: {
    name() {
      return this.$store.state.user.name
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    formatDate(value, format) {
      return XEUtils.toDateString(value, format)
    },
    async getDetail() {
      let res = await Api.getEquipmentPurchaseById(this.id)
      let arr = res.data.purchaseDetails.map(item => {
        return {
          ...item,
          accepter: this.name,
          acceptResult: '',
          acceptUnit: '',
          acceptContent: '',
          acceptTime: ''
        }
      })
      this.tableData = [...arr]
    },
    onOk() {
      this.$refs.xTable.validate(true).then(() => {
        this.$emit('submit', this.tableData)
      })
    }
  }
}
</script>

<style scoped lang="less">
.search_bar {
  display: flex;
  justify-content: space-between;

  .search_bar_btn {
    white-space: nowrap;
  }
}
</style>
