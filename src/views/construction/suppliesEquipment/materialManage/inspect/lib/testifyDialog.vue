<template>
  <el-dialog
    title=""
    :visible="visible"
    width="45%"
    top="10vh"
    style="margin-left: 150px"
    :modal-append-to-body="false"
    @close="$emit('close')"
  >
    <div class="container">
      <el-row :gutter="20">
        <el-col :md="24" style="margin-top: 15px">
          <el-form ref="formPerson" :model="form" label-width="150px" :rules="rules">
            <el-form-item label="见证人签名">
              <VueSignaturePad
                ref="signaturePad"
                width="100%"
                height="120px"
                class="signature-wrapper"
                :option="signatureOptions"
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
            <el-form-item label="见证意见">
              <el-input v-model="form.auditOpinion" type="textarea" placeholder="请填写审核原因" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
            <el-form-item label="附件" prop="contentFileIds">
              <FileEdit v-model="form.contentFileIds" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <footer slot="footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>
<script>
export default {
  name: 'TestifyDialog',
  props: {
    visible: {},
    detailList: {
      type: Array
    }
  },

  data() {
    // 这里存放数据
    return {
      loading: false,
      /*列表*/
      tableData: [],
      form: {
        projectId: localStorage.getItem('projectId')
      },
      checkedVal: '',
      rules: {
        nextPersonId: [{ required: true, message: '指定到货确定人必填' }]
      },
      signatureOptions: {} //签名设置
    }
  },
  watch: {
    detailList: {
      deep: true,
      handler(val) {
        console.log('val', val)
        this.tableData = val
      },
      immediate: true
    }
  },

  methods: {
    submit() {
      this.$refs.formPerson.validate(valid => {
        if (valid) {
          this.$emit('getTarget', { checked: this.form })
          this.$emit('update:visible', false)
          this.$emit('close')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    undoSignature() {
      this.$refs.signaturePad.undoSignature()
    },
    clearSignature() {
      this.$refs.signaturePad.clearSignature()
    },
    saveSignature() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature()
      // console.log(this.base64ImgtoFile(data))
      console.log(data)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  .treeView {
    margin-bottom: 15px;
  }
  .buttons {
    margin: 10px 0;
  }
}
.signature-wrapper {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 0 6px #dcdfe6;
  background-color: rgba(242, 242, 242, 1);
}
</style>
