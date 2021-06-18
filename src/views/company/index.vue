<template>
  <div class="app-wrapper">
    <navbar />
    <el-tabs
      v-model="tabIndex"
      :class="{ isCompanyUpdateActive: routerName === 'CompanyUpdate' }"
      class="custom-menu"
      type="card"
      @tab-click="clickTab"
    >
      <el-tab-pane label="首页" name="CompanyHome"></el-tab-pane>
      <el-tab-pane v-for="{ label, name } in tabs" :key="name" :name="name" :label="label"></el-tab-pane>
    </el-tabs>
    <div class="main-wrap">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
      </transition>
    </div>
  </div>
</template>

<script>
import { Navbar } from '@/layout/components'
import companyRouter from './router'
export default {
  components: {
    Navbar
  },
  data() {
    //这里存放数据
    return {
      tabIndex: this.$route.name
    }
  },
  computed: {
    key() {
      return this.$route.path
    },
    routerName() {
      return this.$route.name
    },
    companyAdminFlag() {
      return this.$store.state.user.companyAdminFlag
    },
    tabs() {
      let routerList = companyRouter
        .filter(item => !item.hidden && this.$hasPower(item.name))
        .map(item => ({
          name: item.name,
          label: item.meta?.title
        }))
      return routerList
    }
  },
  watch: {
    routerName(val) {
      this.getTabIndex(val)
    }
  },
  created() {
    this.$store.dispatch('userPower/getSystemPower')
  },
  mounted() {
    this.getTabIndex()
  },
  //方法集合
  methods: {
    // 获取默认索引
    getTabIndex(val) {
      this.$store.commit('setProjectId', '')
      this.$store.commit('setProjectType', '')
      let tabIndex = val || this.tabIndex
      if (tabIndex === 'SystemFormListAdd' || tabIndex === 'SystemFormListEdit') {
        tabIndex = 'SystemFormList'
      }

      if (
        tabIndex === 'CompanyAddFormStyle' ||
        tabIndex === 'CompanyEditFormStyle' ||
        tabIndex === 'CompanyAddForm' ||
        tabIndex === 'CompanyEditForm'
      ) {
        tabIndex = 'CompanyOa'
      }
      this.tabIndex = tabIndex
    },
    // 选项卡切换
    clickTab() {
      if (this.tabIndex === 'CompanyHome') {
        this.$router.push('/home')
        return
      }
      this.$router.push({
        name: this.tabIndex
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/companyBase');
.isCompanyUpdateActive /deep/ #tab-CompanyManage {
  background: #5e7bdf;
  color: #fff;
  border-bottom-color: #ffffff;
}
</style>
