<template>
  <div class="container no-padding is-footer">
    <el-card :header="'租赁单'" class="top">
      <header slot="header">
        <h2>租赁单 ({{ form.code }})</h2>
        <el-button v-if="form.status === 0" type="primary" @click="toEdit">编辑</el-button>
      </header>
      <div class="detail">
        <ul>
          <li>
            <span>申请人</span><span>{{ form.applicantName }}</span>
          </li>
          <li>
            <span>申请部门</span><span>{{ form.applyDepartmentName }}</span>
          </li>
          <li>
            <span>申请原因</span><span>{{ form.applyReason }}</span>
          </li>
          <li>
            <span>设备使用人</span><span>{{ form.userName }}</span>
          </li>
          <li>
            <span>设备使用部门</span><span>{{ form.useCompanyName }}</span>
          </li>
          <li>
            <span>设备使用位置</span><span>{{ form.usePart }}</span>
          </li>
          <li>
            <span>租赁单位</span><span>{{ form.leaseCompany }}</span>
          </li>
          <li>
            <span>租赁人</span><span>{{ form.leaseUserName }}</span>
          </li>
          <li>
            <span>租赁人联系方式</span><span>{{ form.leaseUserPhone }}</span>
          </li>
          <li>
            <span>租赁时间</span><span>{{ form.leaseStartTime }} - {{ form.leaseEndTime }}</span>
          </li>
          <li>
            <span>租赁总期限</span><span>{{ form.leasePeriod }}</span>
          </li>
          <li>
            <span>租赁总押金</span><span>{{ form.totalDeposit }}</span>
          </li>
          <li>
            <span>租赁总租金</span><span>{{ form.totalRent }}</span>
          </li>
          <li>
            <span>备注</span><span>{{ form.remark }}</span>
          </li>
        </ul>
        <aside>
          <h6>状态</h6>
          <p>{{ $getLabel(rentStatusList, form.status) }}</p>
        </aside>
      </div>
    </el-card>
    <el-card header="租赁明细" style="margin-top: 20px">
      <vxe-table :data="form.details">
        <vxe-table-column title="序号" type="seq" width="60px"></vxe-table-column>
        <vxe-table-column title="设备名称" field="name"></vxe-table-column>
        <vxe-table-column title="规格型号" field="models"></vxe-table-column>
        <vxe-table-column title="设备类型" field="type"></vxe-table-column>
        <vxe-table-column title="单位" field="unit"></vxe-table-column>
        <vxe-table-column title="生产厂家" field="manufacturer"></vxe-table-column>
        <vxe-table-column title="供应商" field="supplier"></vxe-table-column>
        <vxe-table-column title="租赁数量" field="number"></vxe-table-column>
        <vxe-table-column title="租赁押金" field="rentDeposit"></vxe-table-column>
        <vxe-table-column title="租赁期限(天)" field="rentTime"></vxe-table-column>
        <vxe-table-column title="租赁租金" field="rentReprises"></vxe-table-column>
        <vxe-table-column title="备注" field="remark"></vxe-table-column>
        <template v-if="form.status === 5">
          <vxe-table-column title="到货数量" field="arrivalNumber"></vxe-table-column>
          <vxe-table-column title="可入库量" field="enableInputNumber"></vxe-table-column>
        </template>
        <template v-if="form.status === 6">
          <vxe-table-column title="检定验收人" field="accepterName"></vxe-table-column>
          <vxe-table-column title="检定验收结果" field="acceptResult">
            <template #default="{ row }">
              <span>{{ Number(row.acceptResult) === 1 ? '合格' : '不合格' }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column title="检定验收单位" field="acceptUnitName"></vxe-table-column>
          <vxe-table-column title="检定验收内容" field="acceptContent"></vxe-table-column>
          <vxe-table-column title="检定验收时间" field="acceptTime"></vxe-table-column>
        </template>
      </vxe-table>
      <footer class="detail-footer">
        <div>
          <span>租赁总押金(元): </span><span class="number">{{ form.totalDeposit || 0 }}</span>
        </div>
        <div>
          <span>租赁总租金(元): </span><span class="number">{{ form.totalRent || 0 }}</span>
        </div>
      </footer>
    </el-card>

    <!-- 审批组件 start -->
    <CommonCheckFlow :id="id" ref="checkCard"></CommonCheckFlow>
    <!-- 审批组件 end -->
    <div class="footer-btn">
      <el-button size="large" @click="$router.back()">返回</el-button>
      <el-button v-if="form.status === 0" size="large" type="primary" :loading="btnSubmitLoading" @click="submit(1)"
        >保存并提交</el-button
      >
      <el-button v-if="isCheck && form.status === 1 && isShow === 1" size="large" type="primary" @click="handleAudit()"
        >审核</el-button
      >
      <el-button v-if="form.status === 2 && isShow === 1" size="large" type="primary" @click="rent(form)"
        >租赁</el-button
      >
      <el-button v-if="form.status === 4 && isShow === 1" size="large" type="primary" @click="confirm(form)"
        >到货确认</el-button
      >
      <el-button v-if="form.status === 5 && isShow === 1" size="large" type="primary" @click="check(form)"
        >检定验收</el-button
      >
      <el-button v-if="form.status === 6 && isShow === 1" size="large" type="primary" @click="warehousing(form)"
        >执行入库</el-button
      >
    </div>
    <AuditDialog :id="form.id" :visible.sync="auditDialogVisible"></AuditDialog>
    <RentDialog :id="form.id" :visible.sync="rentDialogVisible"></RentDialog>
    <ConfirmDialog :id="form.id" :visible.sync="confirmDialogVisible"></ConfirmDialog>
    <CheckDialog :id="form.id" :visible.sync="checkDialogVisible"></CheckDialog>
    <WarehousingDialog :id="form.id" :visible.sync="warehousingDialogVisible"></WarehousingDialog>
  </div>
</template>

<script>
import rentStatusList from './lib/rentStatusList'
import AuditDialog from './cpmponents/AuditDialog' //审核
import RentDialog from './cpmponents/RentDialog' //租赁
import ConfirmDialog from './cpmponents/ConfirmDialog' //到货确认
import CheckDialog from './cpmponents/CheckDialog' //检定验收
import WarehousingDialog from './cpmponents/WarehousingDialog'
import { workFlowApi } from '@/views/construction/workflow/api/workflow-api' //执行入库

export default {
  name: 'Detail',
  components: { AuditDialog, RentDialog, ConfirmDialog, CheckDialog, WarehousingDialog },
  data() {
    return {
      id: this.$route.query.id || '',
      isCheck: this.$route.query.isCheck || false,
      rentStatusList,
      form: {},
      auditDialogVisible: false,
      rentDialogVisible: false,
      confirmDialogVisible: false,
      checkDialogVisible: false,
      warehousingDialogVisible: false,
      btnSubmitLoading: false,
      detailInfo: {},
      isShow: ''
    }
  },
  created() {
    this.id = this.$route.query.id
    this.refresh()
    this.getTaskShow()
  },
  mounted() {},
  methods: {
    refresh() {
      this.axios.material.get('equipmentLease/get/' + this.id).then(res => {
        this.form = res.data
        this.wrapperInfo()
      })
    },
    //判断审核按钮是否显示
    async getTaskShow() {
      let res = await workFlowApi.getTaskShow(this.id)
      this.isShow = res.data
    },
    async submit() {
      this.form.status = 1
      this.btnSubmitLoading = true
      await this.axios.material.post('equipmentLease/submit', this.form).then(res => {
        this.btnSubmitLoading = false
        this.$message.success('成功')
      })
      this.$router.back()
    },
    remove() {},
    audit(row) {
      this.activeRow = row
      this.auditDialogVisible = true
    },
    //审核流程附件
    setAccessoryInfo() {
      let flag = true
      let approveContent = this.detailInfo.approveContent
      for (let i = 0; i < approveContent.length; i++) {
        if (approveContent[i].tableKey === '附件') {
          flag = false
          break
        }
      }
      if (flag) {
        this.detailInfo.approveContent.push({ tableKey: '附件', tableValue: this.getAccessoryInfo() })
      }
    },
    handleAudit() {
      this.$refs.checkCard.audit()
    },
    rent(row) {
      this.activeRow = row
      this.rentDialogVisible = true
    },
    confirm(row) {
      this.activeRow = row
      this.confirmDialogVisible = true
    },
    check(row) {
      this.activeRow = row
      this.checkDialogVisible = true
    },
    warehousing(row) {
      this.activeRow = row
      this.warehousingDialogVisible = true
    },
    toEdit() {
      this.$router.push({ name: `EquipmentRentEdit`, query: { id: this.id } })
    },
    // 包装-设备租赁单详情(施工)
    wrapperInfo() {
      let info = this.form
      this.detailInfo = {
        targetId: info.id,
        approveName: info.code,
        projectId: localStorage.getItem('projectId'),
        approveContent: [
          { tableKey: '申请人', tableValue: info.applicantName },
          { tableKey: '申请部门', tableValue: info.applyDepartmentName },
          { tableKey: '申请原因', tableValue: info.applyReason },
          { tableKey: '设备使用人', tableValue: info.userName },
          { tableKey: '设备使用部门', tableValue: info.useCompany },
          { tableKey: '设备使用位置', tableValue: info.usePart },
          { tableKey: '租赁单位', tableValue: info.leaseCompany },
          { tableKey: '租赁人', tableValue: info.leaseUserName },
          { tableKey: '租赁人联系方式', tableValue: info.leaseUserPhone },
          { tableKey: '租赁时间', tableValue: info.leaseStartTime + ' - ' + info.leaseEndTime },
          { tableKey: '租赁总期限', tableValue: info.leasePeriod },
          { tableKey: '租赁总押金', tableValue: info.totalDeposit },
          { tableKey: '租赁总租金', tableValue: info.totalRent },
          { tableKey: '备注', tableValue: info.remark }
        ]
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.detail {
  max-width: 1000px;
  position: relative;
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      display: flex;
      width: 50%;
      font-size: 14px;
      padding: 10px 0;
      span:first-child {
        color: rgba(153, 153, 153, 0.85);
        margin-right: 15px;
      }
    }
  }
}
.top {
  .el-card__header header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  position: relative;
  aside {
    position: absolute;
    top: 0px;
    right: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    h6 {
      font-size: 16px;
    }
    p {
      font-size: 18px;
      font-weight: bold;
    }
  }
}
.detail-footer {
  margin-top: 10px;
  display: flex;
  align-items: center;
  line-height: 30px;
  > div {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    & + div {
      margin-left: 20px;
    }
    .number {
      font-size: 22px;
      color: #409eff;
      margin-left: 10px;
    }
  }
}
</style>
