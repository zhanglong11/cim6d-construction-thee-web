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
          <el-form-item label="">
            <el-input v-model="filterForm.search" placeholder="监控设备名称/监控设备编号/设备型号" style="width: 300px">
              <i slot="suffix" class="el-icon-search" />
            </el-input>
          </el-form-item>
          <el-form-item label="关联状态">
            <SelectList v-model="filterForm.status" :self-list="linkStatus" />
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
        <vxe-table-column field="name" title="监控设备名称" width="150" />
        <vxe-table-column field="code" title="监控设备编号" width="150" />
        <vxe-table-column field="models" title="监控设备型号" width="150" />
        <vxe-table-column field="creatorName" title="所属区域" width="150" />
        <vxe-table-column field="inspectTime" title="监控状态" width="150" />
        <vxe-table-column field="status" title="关联状态" width="150">
          <template #default="{ row }">
            {{ $getLabel(linkStatus, row.status - 0) }}
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" width="150" fixed="right">
          <template #default="{ row }">
            <template v-if="row.isBind">
              <el-button v-if="$hasPower('equipmentBimUnlink')" type="text" @click="unLink(row.id)">取消关联</el-button>
              <el-button type="text" @click="watchLink(row.id)">查看</el-button>
            </template>
            <template v-else>
              <el-button v-if="$hasPower('equipmentBimLink') && row.status !== 0" type="text" @click="link(row.id)"
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
import Api from '@/views/construction/suppliesEquipment/api/equipment/list'
export default {
  name: 'QualityLink',
  components: {},
  data() {
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      linkStatus: [
        {
          value: 0,
          label: '未关联'
        },
        {
          value: 1,
          label: '已关联'
        }
      ],
      request: body => Api.list(body),
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
      this.$refs.bim.pickElement(res.data)
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
