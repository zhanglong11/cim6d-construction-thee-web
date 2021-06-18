<template>
  <div class="container no-padding is-footer">
    <!-- 流程图 start -->
    <ViewFlow :id="id" :info="detailInfo" />
    <!-- 流程图 end -->
    <el-card class="box-card">
      <div class="header baseInfo">
        <h6 class="title">
          <i class="icon"></i>
          <span>{{ info.applyName }}-{{ info.code }}</span>
        </h6>
        <div class="statusWrapper">
          <!-- <div v-if="info.status === 0" class="details-title">
            <el-button type="primary" style="margin-left: 50px; margin-bottom: 15px;" @click="toEdit(id)"
              >编辑
            </el-button>
          </div> -->
          <p class="gray">计划状态</p>
          <p>{{ $getLabel(purchaseStatus, info.status) }}</p>
        </div>
      </div>
      <div class="details">
        <el-row>
          <el-col :md="24">
            <span class="label">申请人:</span>
            <span>{{ info.creatorName }}</span>
          </el-col>
          <el-col v-if="info.firstAuditPersonName" :md="24">
            <span class="label">指定审核人:</span>
            <span>{{ info.firstAuditPersonName }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">申请部门:</span>
            <span>{{ info.applyDepartmentName }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">申请时间:</span>
            <span>{{ info.createTime }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">申请原因:</span>
            <span>{{ info.applyReason }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">关联进度:</span>
            <span>{{ info.procedureName || info.schduleName }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">通知采购人:</span>
            <span>{{ info.purchasePersonName }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">备注:</span>
            <span>{{ info.remark }}</span>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 采购明细 start -->
    <el-card class="box-card">
      <div slot="header" class="detailList">
        <div>采购明细</div>
      </div>
      <div>
        <vxe-table
          ref="xTable"
          border
          resizable
          show-overflow
          :data="tableData"
          :edit-config="{ trigger: 'click', mode: 'cell', autoClear: false }"
        >
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="code" title="材料编码"></vxe-table-column>
          <vxe-table-column field="name" title="材料名称"></vxe-table-column>
          <vxe-table-column field="models" title="规格型号"></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="brand" title="品牌"></vxe-table-column>
          <vxe-table-column field="supplier" title="供应商"></vxe-table-column>
          <vxe-table-column field="inventoryNumber" title="库存量">
            <template #default="{ row }">
              {{ row.inventoryNumber || 0 }}
            </template>
          </vxe-table-column>
          <vxe-table-column field="number" title="申请使用数量"></vxe-table-column>
        </vxe-table>
      </div>
    </el-card>
    <!-- 采购明细 end -->

    <div class="footer-btn">
      <el-button v-if="!isCheck" @click="goBack">返回</el-button>
      <template v-else>
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" :loading="btnAuditLoading" @click="handleSubmit">审核</el-button>
      </template>
    </div>
    <!-- 审核组件 start -->
    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <!-- 审核组件 end -->
  </div>
</template>

<script>
import Api from '../../api/material/procurement'
import purchaseStatus from './lib/purchaseStatus'
import type from './lib/type'

export default {
  name: 'ProcurementDetail',
  data() {
    // 这里存放数据
    return {
      tableLoading: true,
      purchaseStatus,
      receiveGoodsVisible: '',
      purchaseVisible: '',
      tableData: [],
      id: '',
      info: {},
      purchaseType: type,
      type: '',
      checkVisible: false,
      form: {},
      isAuditValue: '1',
      nextPerson: '',
      rules: {
        auditStatus: [{ required: true, message: '审核结果必填' }],
        nextPersonName: [{ required: true, message: '必填' }]
      },
      btnAuditLoading: false,
      detailInfo: {}
    }
  },
  computed: {
    isCheck() {
      return this.$route.params.isCheck
    }
  },
  created() {
    this.type = this.$route.params.type
    this.id = this.$route.params.id
    this.getMaterialApplyDetail()
  },
  mounted() {},
  // 方法集合
  methods: {
    handleChangeIsAudit(e) {
      this.isAuditValue = e
      if (e === '0') {
        this.form.nextPersonId = ''
        this.form.nextPersonName = ''
      }
    },
    async getMaterialApplyDetail() {
      const res = await Api.getMaterialApplyDetail(this.id)
      this.info = res.data
      // this.tableData = res.data.detailList || []
      this.tableData = res.data.details.map(item => {
        return {
          brand: item.materialEntity.brand,
          code: item.materialEntity.code,
          models: item.materialEntity.models,
          name: item.materialEntity.name,
          remark: item.materialEntity.remark,
          supplier: item.materialEntity.supplier,
          unit: item.materialEntity.unit,
          // combinedPrice: item.materialEntity.code,
          materialId: item.materialEntity.id,
          number: item.number,
          inventoryNumber: item.materialEntity.inventoryNumber || 0
          // budgetNumber: item.budgetNumber || 0,
          // univalence: item.univalence
        }
      })
      this.tableLoading = false
      this.wrapperInfo()
    },
    //编辑
    toEdit(id) {
      console.log(_.isNil(id))
      _.isNil(id)
        ? this.$router.push({ name: `ProcurementUserAddSmartDecoration` })
        : this.$router.push({ name: `ProcurementUserEditSmartDecoration`, params: { id } })
    },
    // 审核中 进行审核
    async handleCheck() {
      await this.$refs.form.validate()
      let obj = {
        id: this.info.id
      }
      if (this.form.nextPersonName) {
        this.form.status = 1
      }
      // this.isAuditValue
      await this.axios.material.post(`materialApply/audit`, { ...this.form, ...obj }).then(res => {
        this.$message.success('审核完成')
        setTimeout(() => {
          this.goBack()
        }, 1000)
      })
    },

    // 返回
    goBack() {
      this.$router.go(-1)
    },
    handleSubmit() {
      this.btnAuditLoading = true
      this.$refs.checkCard.audit()
      this.btnAuditLoading = false
    },
    // 包装-材料使用申请详情
    wrapperInfo() {
      let info = this.info
      this.detailInfo = {
        targetId: info.id,
        approveName: info.applyName,
        projectId: localStorage.getItem('projectId'),
        approveContent: [{ tableKey: '申请人', tableValue: info.creatorName }]
      }
      if (info.firstAuditPersonName) {
        this.detailInfo.approveContent.push({ tableKey: '指定审核人', tableValue: info.firstAuditPersonName })
      }
      this.detailInfo.approveContent.push({ tableKey: '申请部门', tableValue: info.applyDepartmentName })
      this.detailInfo.approveContent.push({ tableKey: '申请时间', tableValue: info.createTime })
      this.detailInfo.approveContent.push({ tableKey: '申请原因', tableValue: info.applyReason })
      this.detailInfo.approveContent.push({ tableKey: '关联进度', tableValue: info.procedureName || info.schduleName })
      this.detailInfo.approveContent.push({ tableKey: '通知采购人', tableValue: info.purchasePersonName })
      this.detailInfo.approveContent.push({ tableKey: '备注', tableValue: info.remark })
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.header {
  display: flex;
  justify-content: flex-end;
  margin-top: -41px;
}
.header.baseInfo {
  display: block;
  position: relative;
  margin-top: 0;
  .title {
    padding: 10px;
    font-size: 20px;
    .icon {
      display: inline-block;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: url('~@/assets/code-image.png') no-repeat center;
      vertical-align: -4px;
      margin-right: 15px;
    }
  }
  .statusWrapper {
    position: absolute;
    top: 20px;
    right: 50px;
    z-index: 20;
  }
}
.details {
  font-size: 14px;
  margin-top: 20px;

  .label {
    margin-right: 25px;
    margin-bottom: 15px;
    color: #999;
    display: inline-block;
    width: 103px;
  }

  .title {
    margin-bottom: 30px;
    font-size: 20px;
  }

  .upload-con {
    display: flex;

    .upload-list {
      margin-bottom: 10px;
    }
  }
}

.title-btn {
  float: right;
  display: flex;
  justify-content: space-around;
  align-items: center;

  > p {
    margin-right: 10px;

    > span + span {
      margin-left: 10px;
    }
  }
}

/deep/ .details {
  .label {
    margin-bottom: 10px;
  }
}

/deep/ .el-divider--horizontal {
  margin: 10px 0 20px 0;
}

.statusWrapper {
  position: relative;
  top: 55px;
  right: 50px;
  text-align: center;

  .gray {
    color: #ccc;
  }
}

.footer-btn {
  z-index: 1000;
  justify-content: flex-end;
  padding-right: 250px !important;
}

/*.el-dialog__wrapper {*/
/*  z-index: 111111 !important;*/
/*}*/
</style>
