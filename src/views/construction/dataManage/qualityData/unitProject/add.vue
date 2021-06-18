<template>
  <div class="no-padding">
    <el-card class="box-card">
      <el-form ref="form" :model="form" :rules="formRules" label-width="140px">
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="单位编号" prop="unitCode">
              <el-input v-model="form.unitCode" readonly placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="单位名称" prop="unitName">
              <el-input v-model="form.unitName" readonly placeholder="请选择" />
            </el-form-item>
          </el-col>
          <el-col :md="16">
            <el-button type="text" @click="showSelectUnit">选择</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="资料类型" prop="dataType">
              <el-select v-model="form.dataType" placeholder="请选择" style="width: 100%" @change="handleChangeData">
                <el-option v-for="item in dataType" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="项目种类" prop="projectType">
              <el-select
                v-model="form.projectType"
                placeholder="请选择"
                style="width: 100%"
                @change="handleChangeProject"
              >
                <el-option v-for="item in projectType" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <vxe-grid
        ref="xGrid"
        auto-resize
        keep-source
        border
        show-footer
        :footer-method="footerMethod"
        :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
        :columns="tableColumns"
        :data="tableData"
      >
      </vxe-grid>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="handleCancelPage()">取消</el-button>
      <el-button size="lg" type="primary" :loading="btnSaveLoading" @click="handleSavePage()">保存</el-button>
    </div>

    <!-- 选择单位工程模态框 start -->
    <UnitDialog :visible.sync="visible" @getUnitInfo="getUnitInfo" />
    <!-- 选择单位工程模态框 end -->
  </div>
</template>

<script>
import dataType from './lib/dataType'
import projectType from './lib/projectType'
import UnitDialog from './dialog'
import unitProjectTableConfig from './lib/unitProjectTableConfig'
import XEUtils from 'xe-utils'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'UnitProjectAdd',
  components: { UnitDialog },
  data() {
    // 这里存放数据
    return {
      dataType,
      projectType,
      unitProjectTableConfig,
      form: {
        unitCode: '',
        unitName: '',
        dataType: 1,
        projectType: 1
      },
      formRules: {
        unitCode: [{ required: true, message: '必填' }],
        unitName: [{ required: true, message: '必选' }],
        dataType: [{ required: true, message: '必选' }],
        projectType: [{ required: true, message: '必选' }]
      },
      visible: false,
      tableColumns: [],
      tableData: [],
      btnSaveLoading: false
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    console.log(this.$route.params.id)
    this.renderUnitProjectTable('11')
  },
  // 方法集合
  methods: {
    // 选择单位名称
    showSelectUnit() {
      this.visible = true
    },
    // 获取选择的单位信息
    getUnitInfo(unitInfo) {
      // console.log(unitInfo)
      this.form.unitCode = unitInfo.id
      this.form.unitName = unitInfo.label
    },
    // 资料类型
    handleChangeData(val) {
      let key = val + '' + this.form.projectType
      this.renderUnitProjectTable(key)
    },
    // 项目种类
    handleChangeProject(val) {
      let key = this.form.dataType + '' + val
      this.renderUnitProjectTable(key)
    },
    // 表格渲染
    renderUnitProjectTable(key) {
      this.$refs.xGrid.clearActived().then(() => {
        let tableColumns = this.unitProjectTableConfig[key].columns
        this.tableColumns = [
          ...tableColumns,
          {
            title: '操作',
            slots: {
              default: ({ row }) =>
                this.$refs.xGrid.isActiveByRow(row)
                  ? [
                      <el-button type="text" onClick={() => this.handleSave(row, key)}>
                        保存
                      </el-button>,
                      <el-button type="text" onClick={() => this.handleCancel(row, key)}>
                        取消
                      </el-button>
                    ]
                  : [
                      <el-button type="text" onClick={() => this.handleEdit(row, key)}>
                        编辑
                      </el-button>,
                      <el-button type="text" onClick={() => this.handleUpload(row, key)}>
                        上传
                      </el-button>
                    ]
            }
          }
        ]
        this.tableData = this.unitProjectTableConfig[key].data
      })
    },
    // 编辑
    handleEdit(row, key) {
      console.log(row.id, key)
      this.$refs.xGrid.setActiveRow(row)
    },
    // 上传
    handleUpload(row, key) {
      console.log(row.id, key)
    },
    // 保存
    handleSave(row, key) {
      console.log(row.id, key)
      this.$refs.xGrid.clearActived().then(() => {
        console.log(this.tableData)
      })
    },
    // 取消
    handleCancel(row, key) {
      console.log(row.id, key)
      this.$refs.xGrid.clearActived().then(() => {
        this.$refs.xGrid.revertData(row)
      })
    },
    // 合计
    footerMethod({ columns, data }) {
      return [
        columns.map((column, index) => {
          if (index === 0) {
            return '合计'
          } else if (['copies', 'checkPoint', 'aPoint', 'bPoint', 'cPoint'].includes(column.property)) {
            return XEUtils.sum(data, column.property)
          }
          return null
        })
      ]
    },
    // 取消
    handleCancelPage() {
      this.$router.push({ name: 'UnitProjectList' })
    },
    // 保存
    handleSavePage() {}
  }
}
</script>

<style lang="less" scoped></style>
