<template>
  <el-dialog width="1000px" top="10vh" title="保养完成" :visible="visible" @close="cancelDialog">
    <EditTable
      ref="table"
      v-model="tableData"
      :tableColumn="editColumn"
      :validRules="validRules"
      :is-add="false"
      :is-remove="false"
      :show-footer="true"
      :border="true"
    />
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" :loading="btnSubmitLoading" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import Api from '../../../../api/maintenance/maintenance'
import equipmentType from '../../../list/lib/equipmentType'
export default {
  name: 'FinishDialog',
  props: ['id', 'visible'],
  data() {
    return {
      tableData: [],
      editColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'code',
          title: '设备编码',
          minWidth: 120
        },
        {
          field: 'name',
          title: '设备名称',
          minWidth: 120
        },
        {
          field: 'models',
          title: '规格型号',
          minWidth: 120
        },
        {
          field: 'unit',
          title: '单位',
          minWidth: 120
        },
        {
          field: 'manufacturer',
          title: '生产厂家',
          minWidth: 120
        },
        {
          field: 'supplier',
          title: '供应商',
          minWidth: 120
        },
        {
          field: 'type',
          title: '设备类别',
          minWidth: 120,
          slots: {
            default: ({ row }) => [<span>{this.$getLabel(equipmentType, row.type)}</span>]
          }
        },
        {
          field: 'maintenanceParts',
          title: '保养部位',
          minWidth: 120
        },
        {
          field: 'maintenanceStartTime',
          title: '保养开始时间',
          minWidth: 220
        },
        {
          field: 'maintenanceEndTime',
          title: '保养结束时间',
          slots: {
            default: ({ row }) => [
              <el-date-picker v-model={row.maintenanceEndTime} type="datetime" value-format="yyyy-MM-dd HH:mm:ss" />
            ]
          },
          minWidth: 220
        },
        {
          field: 'maintenanceTotalTime',
          title: '保养用时',
          slots: {
            default: ({ row }) => [
              <span>{moment(row.maintenanceEndTime).diff(moment(row.maintenanceStartTime), 'seconds') || ''}</span>
            ]
          },
          minWidth: 120
        },
        {
          field: 'maintenanceCost',
          title: '保养费用',
          slots: {
            default: ({ row }) => [<InputNumberCommon v-model={row.maintenanceCost} />]
          },
          minWidth: 120
        },
        {
          field: 'maintenanceInfo',
          title: '保养信息',
          slots: {
            default: ({ row }) => [<el-input v-model={row.maintenanceInfo} />]
          },
          minWidth: 120
        }
      ],
      validRules: {
        maintenanceEndTime: [{ required: true, message: '必填' }],
        maintenanceCost: [{ required: true, message: '必填' }],
        maintenanceInfo: [{ required: true, message: '必填' }]
      },
      btnSubmitLoading: false
    }
  },
  created() {
    if (this.id) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      const res = await Api.detail(this.id)
      this.tableData = res.data.details
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    async submit() {
      const details = _.cloneDeep(this.tableData)
      details.map(r => {
        r.maintenanceTotalTime = moment(r.maintenanceEndTime).diff(moment(r.maintenanceStartTime), 'seconds') + ''
        return r
      })
      await this.$refs.table.$refs.table.$refs.vxeTable.validate()
      this.btnSubmitLoading = true
      await Api.updateStatus({ id: this.id, status: 2, details })
      this.btnSubmitLoading = false
      this.$emit('update:visible', false)
      this.$message.success('操作成功')
      this.$parent.refresh()
    }
  }
}
</script>

<style scoped></style>
