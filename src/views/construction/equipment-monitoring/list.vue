<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="pageQuery" inline :model="queryForm">
        <el-form-item>
          <el-form-item label="">
            <el-input v-model="queryForm.monitorAreaName" clearable placeholder="所属区域" style="width: 140px" />
          </el-form-item>
          <!--          <el-select-->
          <!--            v-model="queryForm.monitorAreaId"-->
          <!--            clearable-->
          <!--            placeholder="所属区域"-->
          <!--            @clear="queryForm.monitorAreaId = null"-->
          <!--          >-->
          <!--            <el-option v-for="item in monitorAreaList" :key="item.id" :label="item.name" :value="item.id" />-->
          <!--          </el-select>-->
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.status" clearable placeholder="监控状态">
            <el-option v-for="item in monitorStatusList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="queryForm.keyword"
            style="width: 360px"
            placeholder="监控设备编号/设备型号/设备负责人/区域负责人"
          />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('EquipmentMonitoringAdd')" type="primary" icon="el-icon-plus" @click="add"
            >新增</el-button
          >
          <el-button type="primary" @click="together">同步</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <Grid ref="table" :request="request" :filter-form.sync="queryForm">
      <vxe-table-column type="seq" title="序号" />
      <vxe-table-column field="deviceName" title="监控设备名称" minWidth="140px" />
      <vxe-table-column field="deviceNum" title="监控设备编号" minWidth="140px" />
      <vxe-table-column field="factoryNum" title="监控设备型号" minWidth="140px" />
      <vxe-table-column field="monitorAreaName" title="所属区域" minWidth="140px" />
      <vxe-table-column field="status" title="监控状态" minWidth="140px">
        <template slot-scope="scope">
          <span :class="`status status-${scope.row.status}`">
            <i></i>
            {{ $getLabelFromArg('monitorStatus', scope.row.status) }}
          </span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="devicePrincipalName" title="监控设备负责人" minWidth="140px" />
      <vxe-table-column field="areaPrincipalName" title="监控区域负责人" minWidth="140px" />
      <vxe-table-column title="操作" width="340" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="$hasPower('EquipmentMonitoringDetails')"
            type="text"
            size="mini"
            @click="toDetails(scope.row.id)"
            >查看</el-button
          >
          <el-button
            v-if="$hasPower('EquipmentMonitoringEdit')"
            type="text"
            size="mini"
            @click="editMonitoring(scope.row.id)"
            >修改</el-button
          >
          <el-button
            v-if="$hasPower('EquipmentMonitoringPremisson')"
            type="text"
            size="mini"
            @click="updatePermission(scope.row.id)"
            >权限配置</el-button
          >
          <el-button
            v-if="$hasPower('EquipmentMonitoringTop') && !scope.row.topFlag"
            type="text"
            size="mini"
            @click="top(scope.row.id, true)"
          >
            置顶
          </el-button>
          <el-button
            v-if="$hasPower('EquipmentMonitoringCancelTop') && scope.row.topFlag"
            type="text"
            size="mini"
            @click="top(scope.row.id, false)"
          >
            取消置顶
          </el-button>
          <el-button
            v-if="
              $hasPower('EquipmentMonitoringStart') && ['monitorStatus_2', 'monitorStatus_4'].includes(scope.row.status)
            "
            type="text"
            size="mini"
            @click="updateStatus(scope.row.id, 'monitorStatus_1')"
            >启用
          </el-button>
          <el-button
            v-if="
              $hasPower('EquipmentMonitoringStop') && !['monitorStatus_2', 'monitorStatus_4'].includes(scope.row.status)
            "
            type="text"
            style="color: #00ff00"
            size="mini"
            @click="updateStatus(scope.row.id, 'monitorStatus_4')"
          >
            停用
          </el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <PermissonDialog v-if="permissonVisible" :id="curId" :visible.sync="permissonVisible" />
  </div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-28
 * @Last Modified by: gengweigang
 */
import Api from './api/work-bench'
import PermissonDialog from './components/permissionDialog'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'EquipmentMonitoringList',
  components: {
    PermissonDialog
  },
  data() {
    // 这里存放数据
    return {
      queryForm: {},
      request: body => {
        return Api.getMonitorList(body)
      },
      permissonVisible: false,
      curId: null,
      monitorAreaList: []
    }
  },
  computed: {
    // //监控区域
    // monitorAreaList() {
    //   return this.$getArgList('monitorArea') || []
    // },
    //监控状态
    monitorStatusList() {
      return this.$getArgList('monitorStatus') || []
    },
    //监控目标
    monitorTargetList() {
      return this.$getArgList('monitorTarget') || []
    }
  },
  created() {
    this.getAreaList()
  },

  // 方法集合
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
    },
    async getAreaList() {
      const res = await Api.getAreaList({})
      this.monitorAreaList = res.data.records
    },
    // 查看详情
    toDetails(id) {
      this.$router.push({
        path: `/equipment-monitoring/details?id=${id}`
      })
    },
    // 新增监控设备
    add() {
      this.$router.push({
        path: '/equipment-monitoring/add'
      })
    },
    // 编辑监控设备
    editMonitoring(id) {
      this.$router.push({
        path: `/equipment-monitoring/edit?id=${id}`
      })
    },
    //权限配置
    updatePermission(id) {
      this.curId = id
      this.permissonVisible = true
    },
    //置顶
    async top(id, top) {
      top ? await Api.top(id) : await Api.cancelTop(id)
      this.$message.success('操作成功')
      this.refresh()
    },
    async updateStatus(monitorCameraId, status) {
      await Api.updateStatus({ monitorCameraId, status })
      this.$message.success('操作成功')
      this.refresh()
    },
    async together() {
      await Api.together()
      this.$message.success('操作成功')
      this.refresh()
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.status {
  display: flex;
  align-items: center;
  i {
    margin-right: 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00cc00;
  }
  &.status-3 i {
    background: #999;
  }
  &.status-2 i {
    background: #ff9900;
  }
}
</style>
