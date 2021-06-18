<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="140px" class="form-con">
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="见证人" prop="witnessCreator">
              <SelectUser
                :id.sync="form.witnessCreator"
                :value="form.witnessCreators"
                :name.sync="form.witnessCreatorName"
                class="from-item"
                append-to-body
                :multiple="false"
              ></SelectUser>
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
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="附件">
              <FileEdit v-model="form.fileIds" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="detailList">
        <div>取样明细</div>
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
          keep-source
          show-overflow
          :data="tableData"
          :edit-rules="validRules"
          :edit-config="{ trigger: 'click', mode: 'cell', autoClear: true }"
        >
          <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
          <vxe-table-column field="code" title="材料编码"></vxe-table-column>
          <vxe-table-column field="name" title="材料名称"></vxe-table-column>
          <vxe-table-column field="models" title="规格型号"></vxe-table-column>
          <vxe-table-column field="unit" title="单位"></vxe-table-column>
          <vxe-table-column field="brand" title="品牌"></vxe-table-column>
          <vxe-table-column field="supplier" title="供应商"></vxe-table-column>
          <vxe-table-column field="usePart" title="使用部位" :edit-render="{ name: '$input' }"> </vxe-table-column>
          <vxe-table-column
            field="representativeCount"
            title="代表数量"
            :edit-render="{
              name: '$input',
              props: { type: 'number', min: 0 }
            }"
          ></vxe-table-column>
          <vxe-table-column
            field="sampleCount"
            title="试样数量"
            :edit-render="{
              name: '$input',
              props: { type: 'number', min: 0 }
            }"
          ></vxe-table-column>
          <vxe-table-column field="sampleLocation" title="取样地点" :edit-render="{ name: '$input' }">
          </vxe-table-column>
          <vxe-table-column field="set" title="操作">
            <template slot-scope="{ row }">
              <span style="margin: 0 3px"><a @click="handleDeleteRow(row)">删除</a></span></template
            >
          </vxe-table-column>
        </vxe-table>
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
        witnessCreator: [{ required: true, message: '必填', trigger: 'blur' }]
        // applyDepartmentId: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      validRules: {
        sampleCount: [
          { required: true, message: '必填' }
          // { pattern: /[^0-9]/g, message: '必须为数字值' }
        ],
        sampleLocation: [
          { required: true, message: '必填' }
          // { pattern: /[^0-9]/g, message: '必须为数字值' }
        ]
        // representativeCount: [{ pattern: /[^0-9]/g, message: '必须为数字值' }]
      },
      btnSaveLoading: false,
      btnSaveSubmitLoading: false
    }
  },
  created() {
    const { id } = this.$route.query
    this.id = id
    if (this.id) {
      this.refresh()
    }
  },

  methods: {
    //刷新
    async refresh() {
      const res = await Api.getInspectInfo(this.id)
      this.form = res.data || {}
      this.tableData = res.data.detail
      this.form.witnessCreators = {
        id: res.data.witnessCreator,
        name: res.data.witnessCreatorName
      }
    },
    //添加新材料
    AddMaterial(e) {
      this.tableData = [...this.tableData, ...e.checked]
    },
    //选择材料弹窗
    selectMaterialBtn() {
      this.procurentVisible = true
    },
    //选择材料获取的数据
    getTarget(e) {
      let targetList = (e.checked || []).map(item => {
        return {
          ...item,
          usePart: null,
          sampleCount: null,
          sampleLocation: null,
          representativeCount: null
        }
      })
      let diffData = _.differenceBy(this.tableData, targetList, 'code')
      this.tableData = [...diffData, ...targetList]
    },
    //提交
    async submit(type) {
      try {
        await this.$refs.formRef.validate()
        await this.$refs.xTable.validate(true)
        let data = _.cloneDeep(this.form)
        data.detail = this.tableData.map(item => {
          return {
            materialId: item.id || item.materialId,
            code: item.code,
            name: item.name,
            models: item.models,
            unit: item.unit,
            brand: item.brand,
            supplier: item.supplier,
            usePart: item.usePart,
            sampleCount: item.sampleCount,
            sampleLocation: item.sampleLocation,
            representativeCount: item.representativeCount
          }
        })
        if (type === 1) {
          this.btnSaveLoading = true
          await Api.getInspectSave(data).then(res => {
            this.btnSaveLoading = false
            this.$message.success('已保存草稿')
            setTimeout(() => {
              this.goBack()
            }, 1000)
          })
        } else {
          this.btnSaveSubmitLoading = true
          await Api.getInspectSaveAndSubmit({ ...data, status: 1 }).then(res => {
            this.btnSaveSubmitLoading = false
            this.$message.success('保存成功')
            setTimeout(() => {
              this.goBack()
            }, 1000)
          })
        }
      } catch (e) {
        this.btnSaveLoading = false
        this.btnSaveSubmitLoading = false
      }
    },
    //返回上一页
    goBack() {
      // this.$router.back()
      this.$router.push({ name: `MaterialInspect` })
    },
    //删除
    handleDeleteRow(row) {
      this.tableData = this.tableData.filter(item => item._XID !== row._XID)
    }
  }
}
</script>

<style lang="less">
.detailList {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
