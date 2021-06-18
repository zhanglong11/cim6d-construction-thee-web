<template>
  <div class="main">
    <div class="top">
      <el-card class="aside">
        <div slot="header" class="clearfix">
          <span>单体楼层</span>
        </div>
        <BimTree :model-ready="isReady" :is-model="false" :model-id="modelId" />
      </el-card>
      <div class="bim">
        <BimView ref="bim" :model-id="modelId" @ready="isReady = true" />
      </div>
    </div>
    <div class="table-wrap">
      <el-form ref="filterForm" :inline="true">
        <div>
          <el-form-item label="选择计划" label-width="100px" style="margin-right: 20px">
            <el-select v-model="filterForm.unicode" placeholder="请选择">
              <el-option
                v-for="item in planList"
                :key="item.unicode"
                :label="item.scheduleFileName"
                :value="item.unicode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联状态" label-width="100px" style="margin-right: 20px">
            <el-select v-model="filterForm.isBind" placeholder="请选择">
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0" style="margin-right: 20px">
            <el-input v-model="filterForm.keyWord" placeholder="任务编号/任务名称" style="width: 200px">
              <i slot="suffix" class="el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item label-width="0">
            <el-button type="primary" icon="el-icon-search" @click="refresh(true)">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
      <vxe-table
        ref="xTable"
        v-loading="loading"
        border
        max-height="460px"
        :tree-config="{
          reserve: true
        }"
        :data="tableData"
        resizable
        row-id="taskId"
        :edit-config="{ trigger: 'manual', mode: 'row' }"
      >
        <vxe-table-column title="任务编号" type="seq" tree-node width="120"></vxe-table-column>
        <vxe-table-column title="任务名称" field="taskName"></vxe-table-column>
        <vxe-table-column
          field="isBind"
          title="关联状态"
          width="200"
          :formatter="({ cellValue }) => $getLabel(statusList, cellValue)"
        >
        </vxe-table-column>
        <vxe-table-column title="操作">
          <template #default="{ row }">
            <template v-if="row.isBind === 1">
              <el-button v-if="$hasPower('ScheduleTaskBindBim')" type="text" @click="handleUnbind(row.taskId)"
                >取消关联</el-button
              >
              <el-button type="text" @click="watchLink(row)">查看</el-button>
            </template>
            <template v-else>
              <el-button v-if="$hasPower('ScheduleTaskUnbindBim')" type="text" @click="handleBind(row.taskId)"
                >关联</el-button
              >
            </template>
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>
  </div>
</template>

<script>
import api from './api'
import statusList from '@/lib/paramList/statusList'
import bimMixin from '@/mixins/bimMixin.js'
import toTree from '@/utils/toTree'
export default {
  name: 'ScheduleBimRelated',
  mixins: [bimMixin],
  data() {
    return {
      loading: false,
      planList: [],
      statusList,
      filter: {},
      filterForm: {
        projectId: localStorage.getItem('projectId'),
        unicode: null
      },
      tableData: [],
      modelId: localStorage.getItem('bimModelId'),
      allEleAry: [],
      isReady: false
    }
  },
  watch: {
    'filterForm.unicode'() {
      this.refresh()
    }
  },
  created() {
    this.getPlanList()
  },
  mounted() {},
  methods: {
    // 重新渲染bim模型
    async refresh() {
      if (this.filterForm.unicode) {
        await api.getScheduleTaskList(this.filterForm).then(res => {
          this.tableData = toTree(res.data.baseList, 'parentTaskUniqueId', null, 'taskUniqueId')
        })
      }
    },
    async getPlanList() {
      api.getSchedulePlanList({ projectId: localStorage.getItem('projectId') }).then(res => {
        this.planList = res.data
        this.filterForm.unicode = _.first(res.data)?.unicode
      })
    },
    reset() {
      this.filterForm.isBind = undefined
      this.filterForm.keyWord = undefined
      this.refresh()
    },
    async handleBind(id) {
      this.loading = true
      let selectEleId = this.$refs.bim.getSelectElements()
      let selectEle = window.allEleAry.filter(a => selectEleId.includes(a.id))
      if (selectEle.length === 0) {
        this.loading = false
        return this.$message.error('请先选择构件')
      }
      let cloneData = _.cloneDeep(selectEle)
      await api.scheduleTaskBindBim({
        dataId: id,
        modelId: this.modelId,
        bindDTOList: cloneData.map(c => _.pick(c, ['docId', 'elementId']))
      })
      this.loading = false
      this.$message.success('关联成功')
      this.refresh()
    },
    async watchLink(row) {
      let res = await api.getTaskBindBimById(row.taskId)
      this.$refs.bim.pickElement(res.data)
    },
    async handleUnbind(id) {
      await api.scheduleTaskUnBindBim(id)
      this.$message.success('取消关联成功')
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
div.main {
  padding: 0;
  .top {
    display: flex;
    height: 500px;
    .aside {
      width: 330px;
      overflow: auto;
    }
    .bim {
      width: 100%;
      height: 500px;
    }
  }
  .table-wrap {
    padding: 20px;
  }
}
</style>
