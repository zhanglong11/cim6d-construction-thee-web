<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div class="header baseInfo">
        <h6 class="title">
          <i class="icon"></i>
          <span>材料检验单({{ info.code }})</span>
        </h6>
        <div class="statusWrapper">
          <!-- <div v-if="info.status === 0" class="details-title">
            <el-button type="primary" style="margin-left: 50px; margin-bottom: 15px;" @click="toEdit(id)"
              >编辑</el-button
            >
          </div> -->
          <p class="gray">检验状态</p>
          <p>{{ $getLabel(purchaseStatus, info.status) }}</p>
        </div>
      </div>
      <div class="details">
        <el-row>
          <el-col :md="24">
            <span class="label">见证人:</span>
            <span>{{ info.witnessCreatorName }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">取样人:</span>
            <span>{{ info.creatorName }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">取样时间:</span>
            <span>{{ info.createTime }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">备注:</span>
            <span>{{ info.remark }}</span>
          </el-col>
          <el-col :md="24">
            <span class="label">附件</span>
            <div style="display: inline-block; vertical-align: top">
              <FileList :ids="info.fileIds" />
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 取样明细 start -->
    <el-card class="box-card">
      <div slot="header" class="detailList">
        <div>取样明细</div>
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
          <vxe-table-column field="usePart" title="使用部位"></vxe-table-column>
          <vxe-table-column field="representativeCount" title="代表数量"></vxe-table-column>
          <vxe-table-column field="sampleCount" title="试样数量"></vxe-table-column>
          <vxe-table-column field="sampleLocation" title="取样地点"></vxe-table-column>
        </vxe-table>
      </div>
    </el-card>
    <!-- 取样明细 end -->
    <!--见证信息 start-->
    <el-card v-if="info.status > 1" class="box-card">
      <div class="header baseInfo">
        <div slot="header" class="detailList">
          <div>取样见证</div>
        </div>

        <div class="details">
          <el-row>
            <el-col :md="24">
              <span class="label">见证人签字:</span>
              <el-image :src="info.witnessSign" class="signature-wrapper"></el-image>
            </el-col>
            <!--            <el-col :md="24">-->
            <!--              <span class="label">见证意见:</span>-->
            <!--              <span>{{ info.applyTime }}</span>-->
            <!--            </el-col>-->
            <!--            <el-col :md="24">-->
            <!--              <span class="label">见证人:</span>-->
            <!--              <span>{{ info.applyTime }}</span>-->
            <!--            </el-col>-->

            <el-col :md="24">
              <span class="label">附件</span>
              <div style="display: inline-block; vertical-align: top">
                <FileList :ids="info.witnessFileIds" />
              </div>
            </el-col>
            <el-col :md="24">
              <span class="label">备注:</span>
              <span>{{ info.witnessRemark }}</span>
            </el-col>
            <el-col :md="24">
              <span class="label">见证时间:</span>
              <span>{{ info.witnessCreateTime }}</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    <!--见证信息 end-->

    <!--检验结果 start-->
    <el-card v-if="info.status > 2" class="box-card">
      <div class="header baseInfo">
        <div slot="header" class="detailList">
          <div>结果填报</div>
        </div>

        <div class="details">
          <el-row>
            <el-col :md="24">
              <span class="label">填报结果</span>
              <span>{{ info.status === 3 ? '合格' : '不合格' }}</span>
            </el-col>
            <el-col :md="24">
              <span class="label">附件</span>
              <div style="display: inline-block; vertical-align: top">
                <FileList :ids="info.fillFileIds" />
              </div>
            </el-col>
            <el-col :md="24">
              <span class="label">备注:</span>
              <span>{{ info.fillRemark }}</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    <!--检验结果 end-->

    <!--见证 start-->
    <el-card v-if="info.status === 1 && checked" class="box-card">
      <div slot="header" class="detailList">
        <div>取样见证</div>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :md="12" style="margin-top: 15px">
            <el-form ref="formPerson" :model="form" label-width="150px" :rules="rules">
              <el-form-item label="见证人签名" prop="witnessSign">
                <VueSignaturePad
                  ref="signaturePad"
                  v-model="form.witnessSign"
                  width="100%"
                  height="120px"
                  class="signature-wrapper"
                ></VueSignaturePad>
                <div class="row" style="margin-top: 5px">
                  <el-col :md="3">
                    <el-button type="info" @click="undoSignature">撤销</el-button>
                  </el-col>
                  <el-col :md="3">
                    <el-button type="danger" @click="clearSignature">清空</el-button>
                  </el-col>
                  <el-col :md="3">
                    <el-button type="primary" @click="saveSignature">保存</el-button>
                  </el-col>
                </div>
                <!--              <el-input v-model="form.auditOpinion" type="textarea" placeholder="请填写审核原因" />-->
              </el-form-item>
              <!--              <el-form-item label="见证意见">-->
              <!--                <el-input v-model="form.auditOpinion" type="textarea" placeholder="请填写审核原因" />-->
              <!--              </el-form-item>-->
              <el-form-item label="附件">
                <FileEdit v-model="form.witnessFileIds" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="form.witnessRemark" type="textarea" placeholder="请输入备注" />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!--见证 end-->
    <!--填报 start-->
    <el-card v-if="info.status === 2 && checked" class="box-card">
      <div slot="header" class="detailList">
        <div>结果填报</div>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :md="12" style="margin-top: 15px">
            <el-form ref="fillForm" :model="fillForm" label-width="120px" :rules="rules">
              <el-form-item label="填报结果" prop="status">
                <el-radio-group v-model="fillForm.status">
                  <el-radio :label="3">合格</el-radio>
                  <el-radio :label="4">不合格</el-radio>
                </el-radio-group>
              </el-form-item>
              <!--              <el-form-item label="检验意见">-->
              <!--                <el-input v-model="form.auditOpinion" type="textarea" placeholder="请填写审核原因" />-->
              <!--              </el-form-item>-->
              <el-form-item label="附件">
                <FileEdit v-model="fillForm.fillFileIds" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="fillForm.fillRemark" type="textarea" placeholder="请输入备注" />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!--填报 end-->
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button
        v-if="info.status === 1 && checked"
        size="lg"
        :loading="btnAuditLoading"
        type="primary"
        @click="handleTestifySubmit"
        >见证</el-button
      >
      <el-button
        v-if="info.status === 2 && checked"
        size="lg"
        :loading="btnAuditLoading"
        type="primary"
        @click="handleFillSubmit"
        >填报</el-button
      >
    </div>
  </div>
</template>

<script>
import Api from '../../api/material/procurement'
import purchaseStatus from './lib/purchaseStatus'

export default {
  name: 'MaterialInspectDetail',
  data() {
    // 这里存放数据
    return {
      tableLoading: true,
      checked: this.$route.query.checked,
      purchaseStatus, //检验状态
      tableData: [],
      id: '',
      info: {}, //详情信息
      type: '',
      form: {
        witnessSign: ''
      }, //见证结果
      fillForm: {}, //填报结果
      rules: {
        witnessSign: [{ required: true, message: '必填' }],
        status: [{ required: true, message: '填报结果必填' }]
      },
      btnAuditLoading: false
    }
  },
  created() {
    // this.type = this.$route.params.type
    this.id = this.$route.query.id
    this.getInspectInfo()
  },
  mounted() {},
  // 方法集合
  methods: {
    async getInspectInfo() {
      const res = await Api.getInspectInfo(this.id)
      this.info = res.data
      this.tableData = res.data.detail || []
      this.tableLoading = false
    },
    //编辑
    toEdit(id) {
      _.isNil(id)
        ? this.$router.push({ name: `MaterialInspectAdd` })
        : this.$router.push({ name: `MaterialInspectEdit`, params: { id } })
    },
    //撤退签名
    undoSignature() {
      this.$refs.signaturePad.undoSignature()
    },
    //清除签名
    clearSignature() {
      this.$refs.signaturePad.clearSignature()
    },
    //保存签名
    saveSignature() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature()
      // console.log(data)
      if (data) {
        this.form.witnessSign = data
        this.$message.success('签名保存成功')
      } else {
        this.$message.info('请先签名')
        return
      }

      // console.log(this.base64ImgtoFile(data))
    },
    //见证提交
    async handleTestifySubmit() {
      try {
        if (!this.form.witnessSign) {
          this.$message.info('请先签名并保存')
          return
        }
        this.btnAuditLoading = true
        await Api.getInspectTestify({ ...this.form, id: this.id }).then(res => {
          this.btnAuditLoading = false
          if (res.code === 200) {
            this.$message.success('见证成功')
            this.goBack()
          }
        })
      } catch (e) {
        this.btnAuditLoading = false
      }
    },
    //填报结果
    async handleFillSubmit() {
      await this.$refs.fillForm.validate()
      try {
        this.btnAuditLoading = true
        await Api.getInspectFill({ ...this.fillForm, id: this.id }).then(res => {
          this.btnAuditLoading = false
          if (res.code === 200) {
            this.$message.success('填报成功')
            this.goBack()
          }
        })
      } catch (e) {
        this.btnAuditLoading = false
      }
    },
    // 返回
    goBack() {
      this.$router.go(-1)
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
/deep/.details {
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
.signature-wrapper {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 0 6px #dcdfe6;
  background-color: rgba(242, 242, 242, 1);
}

/*.el-dialog__wrapper {*/
/*  z-index: 111111 !important;*/
/*}*/
</style>
