<template>
  <el-dialog title="检定验收" width="1200px" :visible="visible" @close="close">
    <vxe-table
      ref="table"
      :data="detail.details"
      :edit-rules="validRules"
      :edit-config="{ trigger: 'click', mode: 'row', showIcon: false }"
    >
      <vxe-table-column title="序号" type="seq" width="60px"></vxe-table-column>
      <vxe-table-column title="设备名称" field="name"></vxe-table-column>
      <vxe-table-column title="规格型号" field="models"></vxe-table-column>
      <vxe-table-column title="单位" field="unit"></vxe-table-column>
      <!--      <vxe-table-column title="品牌" field="brand"></vxe-table-column>-->
      <vxe-table-column title="供应商" field="supplier"></vxe-table-column>
      <vxe-table-column
        title="检定验收结果"
        field="acceptResult"
        :edit-render="{ name: 'ElSelect', options: acceptResultList }"
      ></vxe-table-column>
      <vxe-table-column
        title="检定验收单位"
        field="acceptUnit"
        width="150"
        :edit-render="{ name: 'ElSelect', options: acceptResultList }"
      >
        <template #edit="{ row }">
          <SelectDepart
            :id.sync="row.acceptUnit"
            :multiple="false"
            :append-to-body="true"
            :name:sync="row.acceptUnitName"
            :value="row.acceptUnit ? { id: row.acceptUnit, label: row.acceptUnitName } : null"
            class="inputStyle"
            @input="getUnitVal"
          ></SelectDepart>
        </template>
        <template #default="{ row }"
          ><span>{{ row.acceptUnitName }}</span></template
        >
      </vxe-table-column>
      <vxe-table-column
        title="检定验收内容"
        field="acceptContent"
        :edit-render="{ name: 'input', attrs: { type: 'text' } }"
      ></vxe-table-column>
      <vxe-table-column title="检定验收时间" field="acceptTime" width="200" :edit-render="{}">
        <template #edit="{ row }">
          <el-date-picker v-model="row.acceptTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </template>
        <template #default="{ row }">{{ formatDate(row.acceptTime, 'yyyy-MM-dd HH:mm:ss') }}</template>
      </vxe-table-column>
      <vxe-table-column title="备注" field="remark" :edit-render="{ name: 'input' }"> </vxe-table-column>
    </vxe-table>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import equipmentType from '@/enumeration/device/equipmentType'
import XEUtils from 'xe-utils'
export default {
  name: 'CheckDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Array],
      default: null
    }
  },
  data() {
    return {
      detail: {
        details: []
      },
      validRules: {
        acceptResult: [{ required: true, message: '必填' }],
        acceptContent: [{ required: true, message: '必填' }],
        acceptUnit: [{ required: true, message: '必填' }],
        acceptTime: [{ required: true, message: '必填' }]
      },
      equipmentType,
      acceptResultList: [
        { label: '合格', value: '1' },
        { label: '不合格', value: '2' }
      ]
    }
  },
  watch: {
    visible(val) {
      val && this.refresh()
    }
  },
  mounted() {},
  methods: {
    refresh() {
      this.axios.material.get('equipmentLease/get/' + this.id).then(res => {
        res.data.details.forEach(e => (e.acceptResult = '1'))
        this.detail = res.data
      })
    },
    getUnitVal(e) {
      let { name, id } = e
      let data = this.detail.details.map(item => {
        if (item.acceptUnit === id) {
          return {
            ...item,
            acceptUnitName: name
          }
        } else {
          return {
            ...item
          }
        }
      })

      this.detail.details = data
      // console.log(111, data)
    },
    formatDate(value, format) {
      return XEUtils.toDateString(value, format)
    },
    async submit() {
      await this.$refs.table.validate(true)
      const list = this.detail.details.map(e =>
        _.pick(e, ['id', 'acceptResult', 'acceptContent', 'acceptUnit', 'remark', 'acceptTime'])
      )
      await this.axios.material.post('equipmentLease/verificationAcceptance', {
        id: this.id,
        leaseDetails: list
      })
      this.$message.success('操作成功')
      this.$parent.refresh()
      this.close()
      this.$router.back()
    },
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
