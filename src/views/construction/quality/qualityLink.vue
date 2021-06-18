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
      <!-- 工具栏 start -->
      <div class="tooltips">
        <el-form inline>
          <el-form-item>
            <el-input v-model="filterForm.search" placeholder="检查人" />
          </el-form-item>
          <el-form-item label="计划时间">
            <DateRange :startTime.sync="filterForm.startDate" :endTime.sync="filterForm.endDate"></DateRange>
          </el-form-item>
          <el-form-item label="状态">
            <SelectList v-model="filterForm.status" :self-list="statusList" />
          </el-form-item>
          <el-form-item label="检查性质">
            <SelectList v-model="filterForm.inspectNature" :self-list="inspectNatureList" />
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" icon="el-icon-search" @click="refresh()">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </div>
      <!-- 工具栏 end -->
      <Grid ref="table" :request="request" :filter-form.sync="filterForm">
        <vxe-table-column type="seq" title="序号" width="60" />
        <vxe-table-column field="problemArea" title="问题部位" min-width="150" />
        <vxe-table-column field="problemDesc" title="问题描述" min-width="200" />
        <vxe-table-column field="status" title="检查性质" width="150">
          <template #default="{ row }">
            {{ $getLabel(inspectNatureList, row.inspectNature - 0) }}
          </template>
        </vxe-table-column>
        <vxe-table-column field="creatorName" title="检查人" width="120" />
        <vxe-table-column field="inspectTime" title="检查时间" width="150" />
        <vxe-table-column field="rectifyPrincipalName" title="整改人" width="120" />
        <vxe-table-column field="rectifyDeadline" title="整改期限" width="150">
          <template #default="{ row }">
            {{ row.rectifyDeadline | ymd }}
          </template>
        </vxe-table-column>
        <vxe-table-column field="reviewPrincipalName" title="复检人" width="120"></vxe-table-column>
        <vxe-table-column field="status" title="状态" width="150">
          <template #default="{ row }">
            {{ $getLabel(statusList, row.status - 0) }}
          </template>
        </vxe-table-column>
        <vxe-table-column field="reviewTime" title="复检时间" width="150" />
        <vxe-table-column title="操作" width="150" fixed="right">
          <template #default="{ row }">
            <template v-if="row.isBind">
              <el-button v-if="$hasPower('qualityBimUnlink')" type="text" @click="unLink(row.id)">取消关联</el-button>
              <el-button type="text" @click="watchLink(row.id)">查看</el-button>
            </template>
            <template v-else>
              <el-button v-if="$hasPower('qualityBimLink') && row.status !== 0" type="text" @click="link(row.id)"
                >关联</el-button
              >
            </template>
          </template>
        </vxe-table-column>
      </Grid>
    </div>
  </div>
</template>

<script>
import Api from '@/views/construction/quality/api'
export default {
  name: 'QualityLink',
  components: {},
  data() {
    return {
      filterForm: {
        inspectType: 1,
        excludeStatus: 0,
        projectId: localStorage.getItem('projectId')
      },
      statusList: [
        { value: 1, label: '待整改' },
        { value: 2, label: '待复查' },
        { value: 3, label: '复查合格' }
      ],
      inspectNatureList: [
        { value: 1, label: '计划检查' },
        { value: 2, label: '日常巡检' }
      ],
      request: body => Api.getIssueList(body),
      modelId: localStorage.getItem('bimModelId'),
      allEleAry: [],
      isReady: false
    }
  },
  created() {},
  mounted() {},
  methods: {
    //刷新数据
    refresh() {
      this.$refs.table.refresh()
    },
    //重置搜索
    reset() {
      this.$refs.table.reset()
    },
    //关联
    async link(id) {
      let selectEleId = this.$refs.bim.getSelectElements()
      let selectEle = window.allEleAry.filter(a => selectEleId.includes(a.id))
      if (selectEle.length === 0) {
        this.loading = false
        return this.$message.error('请先选择构件')
      }
      let cloneData = _.cloneDeep(selectEle)
      await Api.link({
        dataId: id,
        modelId: this.modelId,
        bindDTOList: _.map(cloneData, c => _.pick(c, ['docId', 'elementId']))
      })
      this.$message.success('操作成功')
      this.refresh()
    },
    //取消关联
    async unLink(id) {
      await Api.unLink(id)
      this.$message.success('操作成功')
      this.refresh()
    },
    //查看关联
    async watchLink(id) {
      let res = await Api.watchLink(id)
      console.log(res)
      this.$refs.bim.pickElement(res.data)
      // this.$refs.bim.clearColor()
      // this.$refs.bim.setColor(res.data, [255, 0, 0])
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
