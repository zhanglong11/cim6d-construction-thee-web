<template>
  <div class="no-padding">
    <el-card class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">单位编号：xxxxxx</span>
        <el-button
          type="primary"
          size="mini"
          @click="
            $router.push({
              path: `/dataManage/qualityData/unitProjectEdit/${id}`
            })
          "
          >编辑</el-button
        >
      </div>
      <div class="details">
        <el-row>
          <el-col :md="24">
            <span class="label">单位名称</span>
            <span class="label-content">xxxx</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24">
            <span class="label">资料类型</span>
            <span class="label-content">质量控制资料</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="24">
            <span class="label">项目种类</span>
            <span class="label-content">建筑与结构</span>
          </el-col>
        </el-row>
      </div>
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
      <el-button size="lg" @click="handleBack()">返回</el-button>
    </div>
  </div>
</template>

<script>
import dataType from './lib/dataType'
import projectType from './lib/projectType'
import unitProjectTableConfig from './lib/unitProjectTableConfig'
import XEUtils from 'xe-utils'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'UnitProjectDetail',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id || '',
      dataType,
      projectType,
      unitProjectTableConfig,
      tableColumns: [],
      tableData: []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    console.log(this.$route.params.id)
    this.renderUnitProjectTable('11')
  },
  methods: {
    // 表格渲染
    renderUnitProjectTable(key) {
      let tableColumns = this.unitProjectTableConfig[key].columns
      this.tableColumns = [
        ...tableColumns,
        {
          title: '操作',
          slots: {
            default: ({ row }) => [
              <el-button type="text" onClick={() => this.handleViewAccessory(row, key)}>
                查看附件
              </el-button>
            ]
          }
        }
      ]
      this.tableData = this.unitProjectTableConfig[key].data
    },
    // 查看附件
    handleViewAccessory(row, key) {
      console.log(row.id, key)
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
    // 返回
    handleBack() {
      this.$router.push({ name: 'UnitProjectList' })
    }
  }
}
</script>

<style lang="less" scoped>
.details {
  font-size: 14px;
  .el-col {
    display: flex;
  }
  .label {
    margin-right: 25px;
    margin-bottom: 15px;
    color: #ccc;
    display: inline-block;
    width: 150px;
    text-align: right;
  }
  .label-content {
    margin-bottom: 15px;
    flex: 1;
  }
}
</style>
