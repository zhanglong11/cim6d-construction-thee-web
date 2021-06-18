<template>
  <div class="is-footer">
    <div class="common-table">
      <div class="header">
        <div class="pro-name">
          <el-input
            v-model="form.title"
            style="width: 360px"
            placeholder="工程名称/结构名称/分项工程名称/上传人/最新修改人"
          />
        </div>
        <div class="time">
          <el-input-number
            v-model="form.year"
            step-strictly
            :controls="false"
            style="width: 80px"
            :min="2000"
            :max="2022"
            label="年"
          />
          <span style="margin: 0 5px">年</span
          ><el-input-number
            v-model="form.month"
            step-strictly
            :controls="false"
            style="width: 50px"
            :min="1"
            :max="12"
            label="月"
          /><span style="margin: 0 5px">月</span>计量报审工程量汇总
        </div>
        <div class="name">
          <div class="label">工程名称</div>
          <div class="engineer-select">
            <el-select v-model="form.engineeringId" style="width: 300px">
              <el-option
                v-for="(item, index) of engineerList"
                :key="'EL' + index"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="eng-table">
        <vxe-table ref="table" auto-resize border="full" :data="tableData">
          <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
          <vxe-table-column field="structureName" title="结构名称" min-width="150">
            <template #default="{ row }">
              <el-select v-model="row.structureId" @change="structChange(row)">
                <el-option
                  v-for="(item, index) of getStructList()"
                  :key="'EL' + index"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </template>
          </vxe-table-column>
          <vxe-table-column field="subProjectName" title="分项工程名称" min-width="150">
            <template #default="{ row }">
              <el-select v-model="row.subProjectId">
                <el-option
                  v-for="(item, index) of getSubEngineering(row)"
                  :key="'EL' + index"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </template>
          </vxe-table-column>
          <!-- <vxe-table-column field="constructionTeamName" title="施工班组" min-width="150">
            <template #default="{ row }">
              <el-select v-model="row.constructionTeamId">
                <el-option
                  v-for="(item, index) of groupList"
                  :key="'EL' + index"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </template>
          </vxe-table-column>-->
          <vxe-table-column field="unit" title="单位" width="80"></vxe-table-column>
          <vxe-table-column field="asOfLastPeriodEngineeringAmounts" title="截止上期计量工程量" width="150">
            <template #default="{ row }">
              <el-input-number
                v-model="row.asOfLastPeriodEngineeringAmounts"
                :controls="false"
                :precision="2"
                :min="0"
                style="width: 120px"
              />
            </template>
          </vxe-table-column>
          <vxe-table-column field="thisIssueEngineeringAmounts" title="本期计量工程量" width="150">
            <template #default="{ row }">
              <el-input-number
                v-model="row.thisIssueEngineeringAmounts"
                :controls="false"
                :precision="2"
                :min="0"
                style="width: 120px"
              />
            </template>
          </vxe-table-column>
          <vxe-table-column field="totleEngineeringAmounts" title="合计" width="150">
            <template #default="{ row }">
              <span>{{ row.asOfLastPeriodEngineeringAmounts + row.thisIssueEngineeringAmounts }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="remark" title="备注" min-width="150">
            <template #default="{ row }">
              <el-input v-model="row.remark" />
            </template>
          </vxe-table-column>
          <vxe-table-column title="操作" width="80" fixed="right">
            <template #default="{ $rowIndex }">
              <el-button type="text" @click="handleDelete($rowIndex)">删除</el-button>
            </template>
          </vxe-table-column>
        </vxe-table>
        <div class="add-btn" @click="add"><i class="el-icon-plus"></i>新增</div>
      </div>
    </div>
    <div class="footer-btn">
      <el-button size="lg" @click="$router.back()">返 回</el-button>
      <el-button type="primary" size="lg" @click="save">保 存</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/views/construction/engineeringAmountManage/api'
import treeFind from '@/utils/treeFind'
export default {
  name: 'EditOwnerReceiveAmount',
  components: {},
  data() {
    return {
      id: this.$route.params.id || '',
      treeData: [],
      tableData: [],
      engineerList: [],
      groupList: [],
      form: {
        engineeringId: '',
        title: '',
        year: '',
        month: ''
      }
    }
  },
  computed: {},
  created() {
    this.getESSTree()
    this.getEngineerList()
    this.getGroupList()
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    async getESSTree() {
      let res = await Api.getESSTree()
      this.treeData = res.data || []
    },
    async getEngineerList() {
      let res = await Api.getESSList(0)
      this.engineerList = res.data || []
    },
    async getGroupList() {
      let res = await Api.getAllGroupList()
      this.groupList = res.data || []
    },
    getStructList() {
      let engineering = treeFind(this.treeData, item => item.id === this.form.engineeringId, 'childrens')
      return engineering?.childrens || []
    },
    structChange(row) {
      row.subProjectId = ''
    },
    getSubEngineering(data) {
      if (!data.structureId) return
      let struct = treeFind(this.treeData, item => item.id === data.structureId, 'childrens')
      return struct?.childrens || []
    },
    async getDetail() {
      let res1 = await Api.getTotalPayAmountInfoDetail(this.id)
      this.form = {
        ...res1.data,
        year: res1.data?.yearMonth?.split('-')[0] || '',
        month: res1.data?.yearMonth?.split('-')[1] || [],
        recordId: this.id
      }
      let res = await Api.getTotalPayAmountAllList(this.form)
      this.tableData = res.data || []
    },
    add() {
      this.tableData.push({
        structureId: '',
        subProjectId: '',
        constructionTeamId: '',
        asOfLastPeriodEngineeringAmounts: 0,
        thisIssueEngineeringAmounts: 0,
        totleEngineeringAmounts: 0,
        unit: '',
        remark: ''
      })
    },
    handleDelete(index) {
      this.tableData.splice(index, 1)
    },
    async save() {
      let tableArr = this.tableData.map(item => {
        return {
          ...item,
          engineeringId: this.form.engineeringId
        }
      })
      let params = { recordId: this.id, details: tableArr }
      await Api.saveTotalPayAmount(params)
      this.$message.success('提交成功')
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
@border-color: #6f6f6f;
.add-btn {
  padding: 5px 10px;
  background-color: #4b9cff;
  color: #fff;
  text-align: center;
  margin: 10px 0;
}
.header {
  .pro-name,
  .time {
    padding: 5px 0;
    text-align: center;
    border: 1px @border-color solid;
  }
  .time {
    border-top: none;
  }
  /deep/ .el-input {
    .el-input__inner {
      padding: 0 10px;
    }
  }
  .name {
    display: flex;
    align-items: center;
    .label {
      width: 160px;
      text-align: center;
      height: 42px;
      line-height: 42px;
      border-left: 1px @border-color solid;
      border-right: 1px @border-color solid;
    }
    .engineer-select {
      flex: 1;
      padding: 5px 0 5px 10px;
      border-right: 1px @border-color solid;
    }
  }
}
.eng-table {
  /deep/ .border--full {
    border: 1px @border-color solid;
  }
}
</style>
