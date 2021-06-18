<template>
  <div>
    <el-tabs v-if="tabList.length > 0 && projectDetail.projectUserCategory === 1" v-model="tabIndex" type="card">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane v-for="item in tabList" :key="item.value" :label="item.label" :name="item.value"></el-tab-pane>
    </el-tabs>
    <div v-if="sourcePower.length > 0" v-loading="loading" class="tree-roll">
      <TreeCard
        v-show="treeList.length > 0"
        ref="treeCard"
        :showCheckbox="!role.directorFlag"
        isProjectRole
        :data="treeList"
        :role-id="roleId"
        :power-list-role="powerListRole"
        @change="handlePowerChange"
      />
    </div>
  </div>
</template>

<script>
import { projectApi } from '@/views/project/api/project'
import TreeCard from '../../company/components/tree-card'
import treeFilter from '@/utils/treeFilter'
import toFlat from '@/utils/toFlat'
import treeForEach from '@/utils/treeForEach'
export default {
  name: 'FeaturesPower',
  components: {
    TreeCard
  },
  props: {
    role: {
      type: Object,
      default() {
        return {}
      }
    },
    roleId: {
      type: [String, Number],
      default: ''
    },
    sourcePower: {
      type: Array,
      default: () => []
    }
  },
  data() {
    // 这里存放数据
    return {
      checkAll: false,
      tabIndex: 'all',
      tabList: [], // 选项卡数据
      treeList: [],
      powerListRole: [], // 已分配的权限
      loading: false
    }
  },
  computed: {
    // 公司信息
    companyInfo() {
      return this.$store.state.system.companyInfo
    },
    // 项目类型
    projectType() {
      return this.$store.state.project.projectType
    },
    // 项目详情
    projectDetail() {
      return this.$store.state.project.projectDetail
    }
  },
  watch: {
    roleId: {
      immediate: true,
      handler() {
        this.init()
      }
    },
    tabIndex(val) {
      if (val === 'all') this.treeList = _.cloneDeep(this.sourcePower)
      else if (val) this.getServiceTemplate(val)
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    console.log(555, this.projectDetail.projectUserCategory)
  },
  // 方法集合
  methods: {
    // 初始化
    async init() {
      this.tabIndex = 'all'
      await this.getPowerListRole()
      this.queryServiceTemplate()
    },
    // 获取服务模板
    async queryServiceTemplate() {
      let { data } = await projectApi.queryServiceTemplate({
        page: 1,
        rows: 100,
        serviceId: this.projectType
      })
      let records = data.records || []
      this.tabList = records.map(({ name: label, id: value }) => ({ label, value }))
      this.treeList = _.cloneDeep(this.sourcePower)
    },
    // 获取服务模板详情
    async getServiceTemplate(id) {
      let { data } = await projectApi.getServiceTemplate(id)
      let powerList = data.powerGroupDetailList || []
      let powerListHash = _.keyBy(powerList, 'powerKey')
      this.treeList = treeFilter(this.sourcePower, ({ powerKey }) => powerListHash[powerKey], true)
    },
    // 获取角色已分配权限
    async getPowerListRole() {
      if (this.role.directorFlag) {
        let allPowerKey = []
        treeForEach(this.sourcePower, item => {
          allPowerKey.push(item.powerKey)
        })
        this.powerListRole = allPowerKey
        this.$emit('handleSelectChange', toFlat(this.sourcePower))
      } else {
        this.loading = true
        const { data } = await projectApi.getPowerByRoleProjectRole(this.roleId).finally(() => {
          this.loading = false
        })
        this.powerListRole = _.map(data, 'powerId')
        this.$emit('handleSelectChange', data)
      }
    },
    // 权限改变
    handlePowerChange({ addedPowerKeys, removedPowerKeys }) {
      this.rolePowerKeys = _.chain(this.powerListRole).difference(removedPowerKeys).concat(addedPowerKeys).value()
      this.powerListRole = this.rolePowerKeys
      const flatSourcePower = toFlat(this.sourcePower)
      const hashSourcePower = _.keyBy(flatSourcePower, 'powerId')
      const rolePowerList = this.rolePowerKeys.map(key => hashSourcePower[key])
      this.$emit('handleSelectChange', rolePowerList)
    }
  }
}
</script>
<style lang="less" scoped>
@line: #e5e5e5;
//@import url(); 引入公共css类
/deep/.checkbox-tree {
  .no-icon {
    display: none;
  }
}
.main-card-header {
  display: flex;
  align-items: center;
  .el-checkbox {
    margin-right: 10px;
  }
}
.el-tabs {
  /deep/ .el-tabs__header {
    margin-bottom: 0;
  }
}
</style>
